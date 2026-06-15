import { PolicyStatus } from '../../types/policy';
import { GreenCheck, RedDot, GreyDot } from '../icons/Icons';
import styles from './StatusBadge.module.scss';

const CONFIG: Record<PolicyStatus, { label: string; icon: JSX.Element; cls: string }> = {
  active:  { label: 'Active',       icon: <GreenCheck />, cls: 'active' },
  due:     { label: 'Payment Due',  icon: <RedDot />,     cls: 'due' },
  lapsed:  { label: 'Lapsed',       icon: <GreyDot />,    cls: 'lapsed' },
};

export function StatusBadge({ status }: { status: PolicyStatus }) {
  const { label, icon, cls } = CONFIG[status];
  return (
    <span className={`${styles.badge} ${styles[cls]}`} aria-label={`Status: ${label}`}>
      {icon}
      {label}
    </span>
  );
}
