import { PolicyStatus } from '../../types/policy';
import styles from './StatusBadge.module.scss';

const LABELS: Record<PolicyStatus, string> = {
  active: 'Active',
  due: 'Payment Due',
  lapsed: 'Lapsed',
};

export function StatusBadge({ status }: { status: PolicyStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`} aria-label={`Status: ${LABELS[status]}`}>
      {LABELS[status]}
    </span>
  );
}
