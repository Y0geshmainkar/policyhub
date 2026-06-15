import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import styles from './LoadingOverlay.module.scss';

export function LoadingOverlay() {
  // Show spinner when any TanStack query is fetching OR any mutation is pending
  const isFetching  = useIsFetching();
  const isMutating  = useIsMutating();
  const { loadingMessage } = useAppSelector(s => s.ui);

  if (!isFetching && !isMutating) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.spinner} />
      {loadingMessage && <span className={styles.message}>{loadingMessage}</span>}
    </div>
  );
}
