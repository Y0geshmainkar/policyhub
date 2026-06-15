import { useAppSelector } from '../../store/hooks';
import { DIVISION_NAMES } from '../../types/policy';
import { PolicyCard } from '../../components/PolicyCard/PolicyCard';
import { ShieldIcon, ChartIcon, MedicalIcon } from '../../components/icons/Icons';
import { usePolicies } from '../../hooks/usePayment';
import styles from './Dashboard.module.scss';

export function Dashboard() {
  const activeDivision = useAppSelector(s => s.policies.activeDivision);
  const { data: policies = [], isLoading, isError } = usePolicies();

  const filtered   = policies.filter(p => p.division === activeDivision);
  const activeCount = filtered.filter(p => p.status === 'active').length;
  const dueCount    = filtered.filter(p => p.status === 'due').length;
  const totalPremium = filtered.reduce((s, p) => s + p.premium, 0);

  return (
    <main
      id={`panel-${activeDivision}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeDivision}`}
      className={styles.panel}
    >
      {/* Page header — plain, no dark bg */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back. Here's your {DIVISION_NAMES[activeDivision]} overview.</p>
      </div>

      {/* Stat cards */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Active Policies</span>
              <span className={styles.statValue}>{activeCount}</span>
              <span className={styles.statSub}>of {filtered.length} total</span>
            </div>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <ShieldIcon color="#22A86E" />
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Monthly Premium</span>
              <span className={styles.statValue}>${totalPremium.toFixed(0)}</span>
              <span className={styles.statSub}>combined/mo</span>
            </div>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <ChartIcon color="#F58220" />
            </div>
          </div>
          {dueCount > 0 && (
            <div className={styles.statCard}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Payment Due</span>
                <span className={styles.statValue}>{dueCount}</span>
                <span className={styles.statSub}>action required</span>
              </div>
              <div className={`${styles.statIcon} ${styles.red}`}>
                <MedicalIcon color="#EF4444" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Division policies */}
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
