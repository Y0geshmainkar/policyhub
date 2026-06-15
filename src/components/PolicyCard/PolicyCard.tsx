import { Link } from 'react-router-dom';
import { Policy } from '../../types/policy';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './PolicyCard.module.scss';

export function PolicyCard({ policy }: { policy: Policy }) {
  const due = new Date(policy.dueDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <Link
      to={`/policy/${policy.id}`}
      className={styles.card}
      aria-label={`${policy.type}, policy ${policy.id}, insured ${policy.insuredName}`}
    >
      <div className={styles.header}>
        <span className={styles.policyId}>{policy.id}</span>
        <StatusBadge status={policy.status} />
      </div>
      {policy.insuredName && (
        <span className={styles.insuredName}>{policy.insuredName}</span>
      )}
      <span className={styles.type}>{policy.type}</span>
      <div className={styles.footer}>
        <span className={styles.premium}>${policy.premium.toFixed(2)}/mo</span>
        <span className={styles.dueDate}>Due {due}</span>
      </div>
      {policy.autoPay && <span className={styles.autoPay}>AutoPay ON</span>}
    </Link>
  );
}
