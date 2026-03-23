import styles from './CitationList.module.css';

const MAX_CONTENT_LENGTH = 150;


export default function CitationList({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Sources ({citations.length})</summary>
      <ul className={styles.list}>
        {citations.map((citation, index) => {
          const snippet =
            citation.content && citation.content.length > MAX_CONTENT_LENGTH
              ? citation.content.slice(0, MAX_CONTENT_LENGTH) + '...'
              : citation.content;

          return (
            <li key={index} className={styles.item}>
              <span className={styles.fileName}>{citation.file_name}</span>
              {snippet && <p className={styles.snippet}>{snippet}</p>}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
