import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  closeModal, setPaymentType, setProcessing, setSuccess, setError,
} from '../../store/paymentSlice';
import { updatePolicyStatus } from '../../store/policiesSlice';
import { schedulePaymentCC, schedulePaymentBank } from '../../api/apiClient';
import { CreditCardForm, type CCFormValues } from './CreditCardForm';
import { BankDraftForm, type BankFormValues } from './BankDraftForm';
import styles from './PaymentModal.module.scss';

/** Mock tokenizer — mirrors Cybersource: only last4 extracted, full number discarded */
const mockTokenize = (cardNumber: string): { token: string; last4: string } => ({
  token: `tok_${Math.random().toString(36).slice(2, 12)}`,
  last4: cardNumber.replace(/\s/g, '').slice(-4),
});

export function PaymentModal() {
  const dispatch = useAppDispatch();
  const { modalOpen, policyId, paymentType, status, last4, confirmationNo, errorMessage } = useAppSelector(s => s.payment);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Trap focus back to close button when modal opens
  useEffect(() => {
    if (modalOpen) closeRef.current?.focus();
  }, [modalOpen]);

  if (!modalOpen) return null;

  const policy = policyId;

  const handleCC = async (values: CCFormValues) => {
    dispatch(setProcessing());
    const { token, last4 } = mockTokenize(values.cardNumber);
    try {
      const res: any = await schedulePaymentCC({ token, last4, policyId: policy });
      const data = res.data?.data;
      if (data) {
        dispatch(setSuccess({ token, last4, confirmationNo: data.paymentConfirmationNo }));
        if (policy) dispatch(updatePolicyStatus({ id: policy, status: 'active' }));
        sessionStorage.setItem('paymentToken', token);
      } else {
        dispatch(setError('Payment failed. Please try again.'));
      }
    } catch {
      dispatch(setError('Network error. Please try again.'));
    }
  };

  const handleBank = async (values: BankFormValues) => {
    dispatch(setProcessing());
    const last4 = values.accountNumber.slice(-4);
    const token = `tok_bank_${Math.random().toString(36).slice(2, 10)}`;
    try {
      const res: any = await schedulePaymentBank({ ...values, policyId: policy });
      const data = res.data?.data;
      if (data) {
        dispatch(setSuccess({ token, last4, confirmationNo: data.paymentConfirmationNo }));
        if (policy) dispatch(updatePolicyStatus({ id: policy, status: 'active' }));
        sessionStorage.setItem('paymentToken', token);
      } else {
        dispatch(setError('Payment failed. Please try again.'));
      }
    } catch {
      dispatch(setError('Network error. Please try again.'));
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={e => { if (e.target === e.currentTarget) dispatch(closeModal()); }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>Make a Payment</h2>
          <button ref={closeRef} className={styles.close} onClick={() => dispatch(closeModal())}
            aria-label="Close payment modal">✕</button>
        </div>

        {status === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <div className={styles.successTitle}>Payment Successful</div>
            <div className={styles.confirmNo}>Confirmation: {confirmationNo}</div>
            <div className={styles.tokenDisplay}>Card/Account ending in ••••{last4}</div>
            <button className={styles.doneBtn} onClick={() => dispatch(closeModal())}>Done</button>
          </div>
        ) : (
          <>
            <div className={styles.tabs} role="tablist">
              {(['CC', 'Bank'] as const).map(t => (
                <button key={t} role="tab" aria-selected={paymentType === t}
                  className={`${styles.tab} ${paymentType === t ? styles.active : ''}`}
                  onClick={() => dispatch(setPaymentType(t))}>
                  {t === 'CC' ? '💳 Credit / Debit' : '🏦 Bank Draft'}
                </button>
              ))}
            </div>

            <div className={styles.body} role="tabpanel">
              {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}
              {paymentType === 'CC'
                ? <CreditCardForm onSubmit={handleCC} disabled={status === 'processing'} />
                : <BankDraftForm onSubmit={handleBank} disabled={status === 'processing'} />
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
