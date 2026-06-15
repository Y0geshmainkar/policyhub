import { useState } from 'react';
import styles from './PaymentForm.module.scss';

// Simplified routing → bank name lookup (real ESC calls /System/BankInfo)
const ROUTING_MAP: Record<string, string> = {
  '021000021': 'JPMorgan Chase Bank',
  '021202337': 'Bank of America',
  '121042882': 'Wells Fargo Bank',
  '044000037': 'JPMorgan Chase Bank',
  '322271627': 'Wells Fargo Bank',
};

export interface BankFormValues {
  accountType: string;
  firstName: string;
  lastName: string;
  routingNumber: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

interface Props {
  onSubmit: (values: BankFormValues) => void;
  disabled?: boolean;
}

export function BankDraftForm({ onSubmit, disabled }: Props) {
  const [values, setValues] = useState<BankFormValues>({
    accountType: '', firstName: '', lastName: '',
    routingNumber: '', bankName: '', accountNumber: '', confirmAccountNumber: '',
  });
  const [errors, setErrors] = useState<Partial<BankFormValues>>({});

  const set = (field: keyof BankFormValues, val: string) =>
    setValues(prev => ({ ...prev, [field]: val }));

  const handleRouting = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 9);
    const bank = digits.length === 9 ? (ROUTING_MAP[digits] ?? 'Unknown Bank') : '';
    setValues(prev => ({ ...prev, routingNumber: digits, bankName: bank }));
  };

  const validate = (): boolean => {
    const e: Partial<BankFormValues> = {};
    if (!values.accountType) e.accountType = 'Required';
    if (!values.firstName.trim()) e.firstName = 'Required';
    if (!values.lastName.trim()) e.lastName = 'Required';
    if (values.routingNumber.length !== 9) e.routingNumber = 'Must be 9 digits';
    if (!values.bankName) e.bankName = 'Enter valid routing number';
    if (values.accountNumber.length < 4) e.accountNumber = 'Required';
    if (values.confirmAccountNumber !== values.accountNumber) e.confirmAccountNumber = 'Account numbers do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label}>Account Type</label>
        <select className={`${styles.select} ${errors.accountType ? styles.error : ''}`}
          value={values.accountType} onChange={e => set('accountType', e.target.value)}>
          <option value="">Select account type</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
        </select>
        {errors.accountType && <span className={styles.errorMsg}>{errors.accountType}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>First Name</label>
          <input className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
            type="text" placeholder="First" maxLength={30}
            value={values.firstName} onChange={e => set('firstName', e.target.value)} />
          {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Last Name</label>
          <input className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
            type="text" placeholder="Last" maxLength={30}
            value={values.lastName} onChange={e => set('lastName', e.target.value)} />
          {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Routing Number</label>
        <input className={`${styles.input} ${styles.mono} ${errors.routingNumber ? styles.error : ''}`}
          type="text" inputMode="numeric" placeholder="9-digit routing number" maxLength={9}
          value={values.routingNumber} onChange={e => handleRouting(e.target.value)} />
        {errors.routingNumber && <span className={styles.errorMsg}>{errors.routingNumber}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Bank Name</label>
        <input className={styles.input} type="text" placeholder="Auto-filled from routing number"
          value={values.bankName} disabled />
        {errors.bankName && <span className={styles.errorMsg}>{errors.bankName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Account Number</label>
        <input className={`${styles.input} ${styles.mono} ${errors.accountNumber ? styles.error : ''}`}
          type="password" inputMode="numeric" placeholder="Account number" maxLength={17}
          value={values.accountNumber} onChange={e => set('accountNumber', e.target.value.replace(/\D/g, ''))} />
        {errors.accountNumber && <span className={styles.errorMsg}>{errors.accountNumber}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Confirm Account Number</label>
        <input className={`${styles.input} ${styles.mono} ${errors.confirmAccountNumber ? styles.error : ''}`}
          type="text" inputMode="numeric" placeholder="Re-enter account number" maxLength={17}
          value={values.confirmAccountNumber} onChange={e => set('confirmAccountNumber', e.target.value.replace(/\D/g, ''))} />
        {errors.confirmAccountNumber && <span className={styles.errorMsg}>{errors.confirmAccountNumber}</span>}
      </div>

      <button type="submit" disabled={disabled} className={styles.submitBtn}>
        Pay Now
      </button>
    </form>
  );
}
