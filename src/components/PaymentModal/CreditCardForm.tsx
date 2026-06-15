import { useState } from 'react';
import styles from './PaymentForm.module.scss';

export interface CCFormValues {
  cardholderName: string;
  cardNumber: string;  // formatted display only — last4 extracted for storage
  expiry: string;
  cvv: string;
}

interface Props {
  onSubmit: (values: CCFormValues) => void;
  disabled?: boolean;
}

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function CreditCardForm({ onSubmit, disabled }: Props) {
  const [values, setValues] = useState<CCFormValues>({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Partial<CCFormValues>>({});

  const set = (field: keyof CCFormValues, val: string) =>
    setValues(prev => ({ ...prev, [field]: val }));

  const validate = (): boolean => {
    const e: Partial<CCFormValues> = {};
    if (!values.cardholderName.trim()) e.cardholderName = 'Required';
    if (values.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter 16-digit card number';
    const [mm, yy] = (values.expiry || '').split('/');
    if (!mm || !yy || +mm < 1 || +mm > 12 || yy.length < 2) e.expiry = 'Enter valid MM/YY';
    if (values.cvv.length < 3) e.cvv = 'Enter 3-digit CVV';
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
        <label className={styles.label}>Name on Card</label>
        <input className={`${styles.input} ${errors.cardholderName ? styles.error : ''}`}
          type="text" placeholder="JOHN SMITH" maxLength={60}
          value={values.cardholderName}
          onChange={e => set('cardholderName', e.target.value)} />
        {errors.cardholderName && <span className={styles.errorMsg}>{errors.cardholderName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Card Number</label>
        <input className={`${styles.input} ${styles.mono} ${errors.cardNumber ? styles.error : ''}`}
          type="text" inputMode="numeric" placeholder="•••• •••• •••• ••••"
          value={values.cardNumber}
          onChange={e => set('cardNumber', formatCardNumber(e.target.value))} />
        {errors.cardNumber && <span className={styles.errorMsg}>{errors.cardNumber}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Expiry (MM/YY)</label>
          <input className={`${styles.input} ${styles.mono} ${errors.expiry ? styles.error : ''}`}
            type="text" inputMode="numeric" placeholder="MM/YY" maxLength={5}
            value={values.expiry}
            onChange={e => set('expiry', formatExpiry(e.target.value))} />
          {errors.expiry && <span className={styles.errorMsg}>{errors.expiry}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>CVV</label>
          <input className={`${styles.input} ${styles.mono} ${errors.cvv ? styles.error : ''}`}
            type="password" inputMode="numeric" placeholder="•••" maxLength={4}
            value={values.cvv}
            onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} />
          {errors.cvv && <span className={styles.errorMsg}>{errors.cvv}</span>}
        </div>
      </div>

      <button type="submit" disabled={disabled} className={styles.submitBtn}>
        Pay Now
      </button>
    </form>
  );
}
