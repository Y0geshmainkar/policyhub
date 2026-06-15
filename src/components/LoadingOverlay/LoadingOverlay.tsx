import { useAppSelector } from '../../store/hooks';
import styles from './LoadingOverlay.module.scss';

export function LoadingOverlay() {
  const { isLoading, loadingMessage } = useAppSelector(s => s.ui);
  if (!isLoading) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.spinner} />
      {loadingMessage && <span className={styles.message}>{loadingMessage}</span>}
    </div>
  );
}
