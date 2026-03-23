import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';
import styles from '../styles/Chat.module.css';

export default function ChatPage() {
  return (
    <>
      <Head>
        <title>Chat — CodeSage</title>
        <meta name="description" content="Ask questions about your codebase with AI." />
      </Head>
      <main className={styles.page}>
        <ChatInterface />
      </main>
    </>
  );
}
