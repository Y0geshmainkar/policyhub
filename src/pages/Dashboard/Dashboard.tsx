import { useAppSelector } from '../../store/hooks';
import { DIVISION_NAMES } from '../../types/policy';
import { PolicyCard } from '../../components/PolicyCard/PolicyCard';
import { usePolicies } from '../../hooks/usePayment';
import styles from './Dashboard.module.scss';

export function Dashboard() {
  const activeDivision = useAppSelector(s => s.policies.activeDivision);
  const { data: policies = [], isLoading, isError } = usePolicies();
  const filtered = policies.filter(p => p.division === activeDivision);

  return (
    <main
      id={`panel-${activeDivision}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeDivision}`}
      className={styles.panel}
    >
      {/* Hero strip */}
      <div className={styles.hero}>
        <p className={styles.greeting}>Welcome back</p>
        <h1 className={styles.heading}>
          {DIVISION_NAMES[activeDivision]}
          <span>{activeDivision}</span>
        </h1>
      </div>

      <div className={styles.content}>
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
      </div>
    </main>
  );
}
