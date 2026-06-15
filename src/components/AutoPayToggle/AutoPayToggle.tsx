import { useAppDispatch } from '../../store/hooks';
import { toggleAutoPay } from '../../store/policiesSlice';
import styles from './AutoPayToggle.module.scss';

interface Props {
  policyId: string;
  checked: boolean;
}

export function AutoPayToggle({ policyId, checked }: Props) {
  const dispatch = useAppDispatch();
  const id = `autopay-${policyId}`;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={id}>
        AutoPay
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={styles.track}
        onClick={() => dispatch(toggleAutoPay(policyId))}
        aria-label={`AutoPay is ${checked ? 'enabled' : 'disabled'}`}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
