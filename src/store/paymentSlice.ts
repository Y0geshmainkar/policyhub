import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaymentType = 'CC' | 'Bank';
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface PaymentState {
  modalOpen: boolean;
  policyId: string | null;
  paymentType: PaymentType;
  status: PaymentStatus;
  /** tok_ + random — safe to store, not the card number */
  paymentToken: string | null;
  last4: string | null;
  confirmationNo: string | null;
  errorMessage: string | null;
}

const initialState: PaymentState = {
  modalOpen: false,
  policyId: null,
  paymentType: 'CC',
  status: 'idle',
  paymentToken: null,
  last4: null,
  confirmationNo: null,
  errorMessage: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.modalOpen = true;
      state.policyId = action.payload;
      state.status = 'idle';
      state.paymentToken = null;
      state.last4 = null;
      state.confirmationNo = null;
      state.errorMessage = null;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.policyId = null;
      state.status = 'idle';
    },
    setPaymentType(state, action: PayloadAction<PaymentType>) {
      state.paymentType = action.payload;
    },
    setProcessing(state) {
      state.status = 'processing';
    },
    setSuccess(state, action: PayloadAction<{ token: string; last4: string; confirmationNo: string }>) {
      state.status = 'success';
      state.paymentToken = action.payload.token;
      state.last4 = action.payload.last4;
      state.confirmationNo = action.payload.confirmationNo;
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.errorMessage = action.payload;
    },
  },
});

export const { openModal, closeModal, setPaymentType, setProcessing, setSuccess, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
