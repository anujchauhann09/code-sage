import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import * as api from '../utils/api';
import styles from './GithubIngestForm.module.css';

export default function GithubIngestForm() {
  const { setNamespace } = useAppContext();
  const [repoUrl, setRepoUrl] = useState('');
  const [namespace, setNamespaceLocal] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!repoUrl.trim()) {
      setError('Repository URL is required.');
      return;
    }
    if (!namespace.trim()) {
      setError('Namespace is required.');
      return;
    }

    setLoading(true);
    try {
      await api.ingestGithub({
        repo_url: repoUrl.trim(),
        namespace: namespace.trim(),
        branch: branch.trim() || undefined,
      });
      setNamespace(namespace.trim());
      setSuccess('Repository ingested successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="github-repo-url" className={styles.label}>
          Repository URL <span className={styles.required}>*</span>
        </label>
        <input
          id="github-repo-url"
          type="url"
          className={styles.input}
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="github-namespace" className={styles.label}>
          Namespace <span className={styles.required}>*</span>
        </label>
        <input
          id="github-namespace"
          type="text"
          className={styles.input}
          placeholder="my-project"
          value={namespace}
          onChange={(e) => setNamespaceLocal(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="github-branch" className={styles.label}>
          Branch <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="github-branch"
          type="text"
          className={styles.input}
          placeholder="main"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Ingest Repository'}
      </button>
    </form>
  );
}
