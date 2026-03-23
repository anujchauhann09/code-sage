import CitationList from './CitationList';
import styles from './MessageBubble.module.css';


function renderContent(text) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const lang = lines[0].trim();
      const code = (lang && !/\s/.test(lang) ? lines.slice(1) : lines).join('\n').trim();
      return (
        <pre key={i} className={styles.codeBlock}>
          <code>{code}</code>
        </pre>
      );
    }

    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((s, j) =>
          s.startsWith('`') && s.endsWith('`') ? (
            <code key={j} className={styles.inlineCode}>{s.slice(1, -1)}</code>
          ) : (
            <span key={j}>{s}</span>
          )
        )}
      </span>
    );
  });
}


export default function MessageBubble({ message }) {
  const { role, content, citations } = message;

  if (role === 'user') {
    return (
      <div className={styles.userRow}>
        <div className={styles.userBubble}>
          <p className={styles.userContent}>{content}</p>
        </div>
      </div>
    );
  }

  if (role === 'system') {
    return (
      <div className={styles.systemRow}>
        <div className={styles.systemBubble}>
          <span className={styles.systemIcon}>⚠️</span>
          <p className={styles.systemContent}>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aiRow}>
      <div className={styles.aiAvatar}>🤖</div>
      <div className={styles.aiContent}>
        <div className={styles.aiText}>{renderContent(content)}</div>
        {citations && citations.length > 0 && (
          <CitationList citations={citations} />
        )}
      </div>
    </div>
  );
}
