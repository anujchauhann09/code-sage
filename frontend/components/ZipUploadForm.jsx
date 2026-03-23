import { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import * as api from '../utils/api';
import styles from './ZipUploadForm.module.css';

export default function ZipUploadForm() {
  const { setNamespace } = useAppContext();
  const [file, setFile] = useState(null);
  const [namespace, setNamespaceLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function validateAndSetFile(selectedFile) {
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      setError('Only .zip files are accepted.');
      return false;
    }
    setFile(selectedFile);
    setError('');
    return true;
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      validateAndSetFile(dropped);
    }
  }

  function handleFileInputChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a .zip file.');
      return;
    }
    if (!namespace.trim()) {
      setError('Namespace is required.');
      return;
    }

    setLoading(true);
    try {
      await api.ingestZip(file, namespace.trim());
      setNamespace(namespace.trim());
      setSuccess('Codebase ingested successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for ZIP file upload"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          className={styles.hiddenInput}
          onChange={handleFileInputChange}
          disabled={loading}
          aria-hidden="true"
          tabIndex={-1}
        />
        {file ? (
          <p className={styles.fileName}>
            <span className={styles.fileIcon}>📦</span> {file.name}
          </p>
        ) : (
          <>
            <p className={styles.dropText}>Drag &amp; drop a <strong>.zip</strong> file here</p>
            <p className={styles.dropSubText}>or click to browse</p>
          </>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="zip-namespace" className={styles.label}>
          Namespace <span className={styles.required}>*</span>
        </label>
        <input
          id="zip-namespace"
          type="text"
          className={styles.input}
          placeholder="my-project"
          value={namespace}
          onChange={(e) => setNamespaceLocal(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Upload & Ingest'}
      </button>
    </form>
  );
}
