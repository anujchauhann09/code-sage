import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const FEATURES = [
  {
    icon: '🐙',
    title: 'GitHub Ingestion',
    desc: 'Point to any public repo and ingest it in seconds.',
  },
  {
    icon: '📦',
    title: 'ZIP Upload',
    desc: 'Drag and drop a ZIP archive of your codebase — no git required.',
  },
  {
    icon: '🧠',
    title: 'Context-Aware Answers',
    desc: 'Powered by RAG — answers are grounded in your actual source code.',
  },
  {
    icon: '📎',
    title: 'Source Citations',
    desc: 'Every answer links back to the exact files it was derived from.',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Ingest your codebase',
    desc: 'Upload a ZIP or connect a GitHub repo. We chunk and embed your code.',
  },
  {
    num: '2',
    title: 'Ask in plain English',
    desc: 'Type any question about the code — architecture, logic, bugs, anything.',
  },
  {
    num: '3',
    title: 'Get cited answers',
    desc: 'Receive AI-generated answers with direct references to source files.',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>CodeSage — AI-powered Codebase Q&A</title>
        <meta name="description" content="Understand any codebase with AI. Ingest GitHub repos or ZIP files and ask questions in plain English." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.badge}>✦ AI-Powered Code Intelligence</span>
          <h1 className={styles.title}>
            Understand any codebase<br />
            <span className={styles.titleAccent}>with AI</span>
          </h1>
          <p className={styles.tagline}>
            Ingest a GitHub repo or ZIP archive and ask questions about your code in plain English. Get accurate, cited answers instantly.
          </p>
          <div className={styles.ctas}>
            <Link href="/chat" className={styles.primaryBtn}>
              Start Chatting →
            </Link>
            <Link href="/tools" className={styles.secondaryBtn}>
              Upload Codebase
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <section className={styles.howSection}>
          <p className={styles.sectionLabel}>How it works</p>
          <h2 className={styles.sectionTitle}>Three steps to code clarity</h2>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.step}>
                <span className={styles.stepNum}>{s.num}</span>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
