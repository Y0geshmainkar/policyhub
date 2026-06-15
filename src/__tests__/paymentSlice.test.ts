import reducer, {
  openModal, closeModal, setPaymentType, setProcessing, setSuccess, setError
} from '../store/paymentSlice';

const initial = {
  modalOpen: false, policyId: null, paymentType: 'CC' as const,
  status: 'idle' as const, paymentToken: null, last4: null,
  confirmationNo: null, errorMessage: null,
};

describe('paymentSlice', () => {
  test('openModal sets modalOpen and policyId', () => {
    const s = reducer(initial, openModal('00A327584'));
    expect(s.modalOpen).toBe(true);
    expect(s.policyId).toBe('00A327584');
    expect(s.status).toBe('idle');
  });

  test('openModal resets previous state', () => {
    const dirty = { ...initial, status: 'error' as const, errorMessage: 'prev error' };
    const s = reducer(dirty, openModal('NEW-ID'));
    expect(s.errorMessage).toBeNull();
    expect(s.status).toBe('idle');
  });

  test('closeModal closes and clears policyId', () => {
    const s = reducer({ ...initial, modalOpen: true, policyId: 'X' }, closeModal());
    expect(s.modalOpen).toBe(false);
    expect(s.policyId).toBeNull();
  });

  test('setPaymentType switches to Bank', () => {
    expect(reducer(initial, setPaymentType('Bank')).paymentType).toBe('Bank');
  });

  test('setProcessing sets status to processing', () => {
    expect(reducer(initial, setProcessing()).status).toBe('processing');
  });

  test('setSuccess sets all success fields', () => {
    const s = reducer(initial, setSuccess({ token: 'tok_abc', last4: '4242', confirmationNo: 'CONF-001' }));
    expect(s.status).toBe('success');
    expect(s.paymentToken).toBe('tok_abc');
    expect(s.last4).toBe('4242');
    expect(s.confirmationNo).toBe('CONF-001');
  });

  test('setError sets status and message', () => {
    const s = reducer(initial, setError('Payment failed'));
    expect(s.status).toBe('error');
    expect(s.errorMessage).toBe('Payment failed');
  });
});
