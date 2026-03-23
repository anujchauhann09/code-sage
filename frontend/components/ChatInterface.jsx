import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import * as api from '../utils/api';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import styles from './ChatInterface.module.css';

export default function ChatInterface() {
  const { namespace, setNamespace } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [namespaceInput, setNamespaceInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setNamespaceInput(namespace);
  }, [namespace]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputValue]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function commitNamespace() {
    setNamespace(namespaceInput.trim());
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    const query = inputValue.trim();
    if (!query || loading) return;

    if (!namespace) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'No namespace set. Please ingest a codebase first via the Tools page.',
          citations: [],
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: query, citations: [] },
    ]);
    setInputValue('');
    setLoading(true);

    try {
      const data = await api.queryCodebase({ query, namespace });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: data.answer ?? '',
          citations: data.context_used ?? [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'system', content: err.message, citations: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const sidebarContent = (
    <>
      <p className={styles.sidebarTitle}>Session</p>

      <div className={styles.namespaceBlock}>
        <label className={styles.namespaceLabel} htmlFor="ns-input">
          Namespace
        </label>
        {namespace ? (
          <div className={styles.namespaceBadge}>
            <span className={styles.namespaceDot} />
            {namespace}
          </div>
        ) : (
          <span className={styles.namespaceUnset}>not set</span>
        )}
        <input
          id="ns-input"
          type="text"
          className={styles.namespaceInput}
          value={namespaceInput}
          onChange={(e) => setNamespaceInput(e.target.value)}
          onBlur={commitNamespace}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitNamespace();
              setDrawerOpen(false);
            }
          }}
          placeholder="Enter namespace"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      <button
        type="button"
        className={styles.clearBtn}
        onClick={() => { setMessages([]); setDrawerOpen(false); }}
        disabled={messages.length === 0}
      >
        🗑 Clear chat
      </button>
    </>
  );

  return (
    <div className={styles.chatWrapper}>
      {mounted && drawerOpen && createPortal(
        <>
          <div
            className={styles.backdrop}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={`${styles.sidebar} ${styles.sidebarOpen}`}
            aria-label="Session settings"
          >
            {sidebarContent}
          </aside>
        </>,
        document.body
      )}

      <aside className={styles.sidebarDesktop} aria-label="Session settings">
        {sidebarContent}
      </aside>

      <div className={styles.main}>
        <div className={styles.mobileBar}>
          <span className={styles.mobileBarNamespace}>
            {namespace
              ? <><strong>{namespace}</strong></>
              : 'No namespace set'}
          </span>
          <button
            type="button"
            className={styles.drawerToggle}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open session settings"
            aria-expanded={drawerOpen}
          >
            ⚙ Settings
          </button>
        </div>

        <div className={styles.messages} aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🧠</span>
              <p className={styles.emptyTitle}>Ask anything about your codebase</p>
              <p className={styles.emptyDesc}>
                Set a namespace and start asking questions. CodeSage will find answers from your ingested code.
              </p>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}

          {loading && (
            <div className={styles.loadingRow}>
              <div className={styles.aiAvatar}>🤖</div>
              <LoadingDots />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.inputBar}>
          <form className={styles.inputForm} onSubmit={handleSubmit} noValidate>
            <textarea
              ref={textareaRef}
              className={styles.textInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your codebase…"
              disabled={loading}
              rows={1}
              aria-label="Chat input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={loading || !inputValue.trim()}
              aria-label="Send message"
            >
              ↑
            </button>
          </form>
          <p className={styles.inputHint}>Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
