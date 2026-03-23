import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GithubIngestForm from '../components/GithubIngestForm';
import ZipUploadForm from '../components/ZipUploadForm';
import styles from '../styles/Tools.module.css';

const TABS = ['github', 'zip'];

export default function ToolsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('github');

  useEffect(() => {
    if (!router.isReady) return;
    const tab = router.query.tab;
    if (tab && TABS.includes(tab)) setActiveTab(tab);
  }, [router.isReady, router.query.tab]);

  function handleTabClick(tab) {
    setActiveTab(tab);
    router.replace({ pathname: '/tools', query: { tab } }, undefined, { shallow: true });
  }

  return (
    <>
      <Head>
        <title>Tools — CodeSage</title>
        <meta name="description" content="Ingest your codebase via GitHub or ZIP upload." />
      </Head>

      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Ingest Codebase</h1>
          <p className={styles.subheading}>
            Connect a GitHub repo or upload a ZIP archive to get started.
          </p>
        </div>

        <div className={styles.cards}>
          <div
            className={`${styles.card} ${activeTab === 'github' ? styles.cardActive : ''}`}
            onClick={() => handleTabClick('github')}
          >
            <span className={styles.cardIcon}>🐙</span>
            <div>
              <p className={styles.cardTitle}>GitHub Repo</p>
              <p className={styles.cardDesc}>Ingest directly from a GitHub URL</p>
            </div>
          </div>

          <div
            className={`${styles.card} ${activeTab === 'zip' ? styles.cardActive : ''}`}
            onClick={() => handleTabClick('zip')}
          >
            <span className={styles.cardIcon}>📦</span>
            <div>
              <p className={styles.cardTitle}>ZIP Upload</p>
              <p className={styles.cardDesc}>Upload a local ZIP archive</p>
            </div>
          </div>
        </div>

        <div className={styles.formPanel}>
          {activeTab === 'github' ? (
            <div role="tabpanel" aria-label="GitHub ingestion form">
              <h2 className={styles.formTitle}>GitHub Repository</h2>
              <p className={styles.formDesc}>Enter the repo URL and a namespace to identify this codebase.</p>
              <GithubIngestForm />
            </div>
          ) : (
            <div role="tabpanel" aria-label="ZIP upload form">
              <h2 className={styles.formTitle}>ZIP Upload</h2>
              <p className={styles.formDesc}>Drag and drop a .zip file or click to browse.</p>
              <ZipUploadForm />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
