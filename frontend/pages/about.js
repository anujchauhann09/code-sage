import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

const STACK = [
  { name: 'FastAPI', desc: 'Python backend & REST API', icon: '⚡' },
  { name: 'Pinecone', desc: 'Vector database for embeddings', icon: '🌲' },
  { name: 'Gemini', desc: 'LLM & embedding model by Google', icon: '✨' },
  { name: 'Next.js', desc: 'React framework for the frontend', icon: '▲' },
];

const PIPELINE = [
  {
    step: '01',
    title: 'Ingestion',
    desc: 'Source code is loaded from a GitHub repo or ZIP archive, then split into semantic chunks.',
  },
  {
    step: '02',
    title: 'Embedding',
    desc: 'Each chunk is converted into a vector embedding using Gemini and stored in Pinecone.',
  },
  {
    step: '03',
    title: 'Retrieval',
    desc: 'When you ask a question, the most relevant chunks are retrieved via similarity search.',
  },
  {
    step: '04',
    title: 'Generation',
    desc: 'Gemini generates a grounded answer using the retrieved context, with source citations.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — CodeSage</title>
        <meta name="description" content="Learn how CodeSage works." />
      </Head>

      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>About CodeSage</h1>
          <p className={styles.desc}>
            CodeSage is an AI-powered codebase Q&A tool. Ingest any codebase and ask questions in plain English — get accurate, cited answers backed by your actual source code.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/tools" className={styles.primaryBtn}>Get Started</Link>
            <Link href="/chat" className={styles.secondaryBtn}>Try the Chat</Link>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>How it works</p>
          <h2 className={styles.sectionTitle}>The RAG Pipeline</h2>
          <div className={styles.pipeline}>
            {PIPELINE.map((p, i) => (
              <div key={p.step} className={styles.pipelineStep}>
                <div className={styles.pipelineConnector}>
                  <span className={styles.pipelineNum}>{p.step}</span>
                  {i < PIPELINE.length - 1 && <span className={styles.pipelineLine} />}
                </div>
                <div className={styles.pipelineContent}>
                  <p className={styles.pipelineTitle}>{p.title}</p>
                  <p className={styles.pipelineDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel}>Tech Stack</p>
          <h2 className={styles.sectionTitle}>Built with</h2>
          <div className={styles.stackGrid}>
            {STACK.map((s) => (
              <div key={s.name} className={styles.stackCard}>
                <span className={styles.stackIcon}>{s.icon}</span>
                <p className={styles.stackName}>{s.name}</p>
                <p className={styles.stackDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
