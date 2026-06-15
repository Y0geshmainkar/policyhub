import { useAppSelector } from '../../store/hooks';
import { DIVISION_NAMES } from '../../types/policy';
import { PolicyCard } from '../../components/PolicyCard/PolicyCard';
import { usePolicies } from '../../hooks/usePayment';
import styles from './Dashboard.module.scss';

const TrendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 14l4-4 3 3 6-7" stroke="#F58220" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ShieldStatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5L10 2z" stroke="#22A86E" strokeWidth="1.5" fill="none"/>
    <path d="M7 10l2 2 4-4" stroke="#22A86E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const AlertStatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3L2 17h16L10 3z" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <path d="M10 9v3M10 14v1" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function Dashboard() {
  const activeDivision = useAppSelector(s => s.policies.activeDivision);
  const { data: policies = [], isLoading, isError } = usePolicies();

  const filtered      = policies.filter(p => p.division === activeDivision);
  const activeCount   = filtered.filter(p => p.status === 'active').length;
  const dueCount      = filtered.filter(p => p.status === 'due').length;
  const totalPremium  = filtered.reduce((s, p) => s + p.premium, 0);

  return (
    <main
      id={`panel-${activeDivision}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeDivision}`}
      className={styles.panel}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back. Here's your {DIVISION_NAMES[activeDivision]} overview.</p>
      </div>

      {/* Stat cards — only when data loaded and division has policies */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Monthly Premium</span>
              <span className={styles.statValue}>${totalPremium.toFixed(0)}</span>
              <span className={styles.statSub}>combined/mo</span>
            </div>
            <div className={`${styles.statIcon} ${styles.orange}`}><TrendIcon /></div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Active Policies</span>
              <span className={styles.statValue}>{activeCount}</span>
              <span className={styles.statSub}>of {filtered.length} total</span>
            </div>
            <div className={`${styles.statIcon} ${styles.green}`}><ShieldStatIcon /></div>
          </div>

          {dueCount > 0 && (
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Payment Due</span>
                <span className={styles.statValue}>{dueCount}</span>
                <span className={styles.statSub}>action required</span>
              </div>
              <div className={`${styles.statIcon} ${styles.red}`}><AlertStatIcon /></div>
            </div>
          )}
        </div>
      )}

      <div className={styles.sectionHeading}>
        {DIVISION_NAMES[activeDivision]}
        <span>{activeDivision}</span>
      </div>

      {isLoading && <p className={styles.empty}>Loading policies…</p>}
      {isError   && <p className={styles.empty}>Failed to load policies.</p>}

      {!isLoading && !isError && (
        <div className={styles.grid}>
          {filtered.length === 0
            ? <p className={styles.empty}>No policies in this division.</p>
            : filtered.map(p => <PolicyCard key={p.id} policy={p} />)
          }
        </div>
      )}
    </main>
  );
}
