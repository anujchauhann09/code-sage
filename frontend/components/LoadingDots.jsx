import styles from './LoadingDots.module.css';

export default function LoadingDots() {
  return (
    <div className={styles.container} aria-label="Loading">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
