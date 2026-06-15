import { Link, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { AutoPayToggle } from '../../components/AutoPayToggle/AutoPayToggle';
import { openModal } from '../../store/paymentSlice';
import styles from './PolicyDetail.module.scss';

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const policy = useAppSelector(s => s.policies.policies.find(p => p.id === id));

  if (!policy) {
    return (
      <main className={styles.page}>
        <Link to="/" className={styles.back}>← Back</Link>
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
        <div className={styles.cardHeader}>
          <span className={styles.id}>{policy.id}</span>
          <span className={styles.sourceBadge} title="Source system">via {policy.sourceSystem}</span>
        </div>

        <h1 className={styles.title}>{policy.type}</h1>
        {policy.insuredName && (
          <div className={styles.insured}>{policy.insuredName}</div>
        )}
        <StatusBadge status={policy.status} />

        <div className={styles.rows}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Division</span>
            <span className={styles.rowValue}>{policy.divisionName} ({policy.division})</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Monthly Premium</span>
            <span className={`${styles.rowValue} ${styles.mono}`}>${policy.premium.toFixed(2)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Paid To Date</span>
            <span className={styles.rowValue}>{due}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>AutoPay</span>
            <AutoPayToggle policyId={policy.id} checked={policy.autoPay} />
          </div>
        </div>

        <button
          className={styles.makePaymentBtn}
          onClick={() => dispatch(openModal(policy.id))}
          disabled={policy.status === 'active' && !policy.paymentHistory.length}
          aria-label={`Make a payment for policy ${policy.id}`}
        >
          Make a Payment
        </button>

        {/* Payment History */}
        <section className={styles.section} aria-label="Payment history">
          <h2 className={styles.sectionTitle}>Payment History</h2>
          {policy.paymentHistory.length === 0 ? (
            <p className={styles.noHistory}>No payment history available.</p>
          ) : (
            <div className={styles.historyList}>
              {policy.paymentHistory.map((p, i) => (
                <div key={i} className={styles.historyRow}>
                  <span className={styles.historyDate}>{p.date}</span>
                  <span className={styles.historyMethod}>{p.method}</span>
                  <span className={styles.historyAmount}>${p.amount.toFixed(2)}</span>
                  <span className={`${styles.historyStatus} ${styles[p.status]}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
