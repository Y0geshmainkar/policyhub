import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import styles from './PolicyDetail.module.scss';

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const policy = useAppSelector(s => s.policies.policies.find(p => p.id === id));

  if (!policy) {
    return (
      <main className={styles.page}>
        <Link to="/" className={styles.back}>← Back to Dashboard</Link>
        <p className={styles.notFound}>Policy not found.</p>
      </main>
    );
  }

  const due = new Date(policy.dueDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>← Back to Dashboard</Link>
      <div className={styles.card}>
        <div className={styles.id}>{policy.id}</div>
        <h1 className={styles.title}>{policy.type}</h1>
        <StatusBadge status={policy.status} />
        <div className={styles.rows}>
          <span className={styles.label}>Division</span>
          <span className={styles.value}>{policy.divisionName} ({policy.division})</span>

          <span className={styles.label}>Monthly Premium</span>
          <span className={`${styles.value} ${styles.mono}`}>${policy.premium.toFixed(2)}</span>

          <span className={styles.label}>Next Due Date</span>
          <span className={styles.value}>{due}</span>

          <span className={styles.label}>AutoPay</span>
          <span className={styles.value}>{policy.autoPay ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div className={styles.sourceBadge} title="Source system for this policy record">
          via {policy.sourceSystem}
        </div>
      </div>
    </main>
  );
}
