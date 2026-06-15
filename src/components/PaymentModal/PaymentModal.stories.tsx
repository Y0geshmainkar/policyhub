import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { openModal, setSuccess, setError } from '../../store/paymentSlice';
import { PaymentModal } from './PaymentModal';

// Decorator that opens the modal on mount
const withOpenModal = (policyId: string) => (Story: React.ComponentType) => {
  const Wrapper = () => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(openModal(policyId)); }, []);
    return <Story />;
  };
  return <Wrapper />;
};

const meta: Meta<typeof PaymentModal> = {
  title: 'Components/PaymentModal',
  component: PaymentModal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof PaymentModal>;

export const CreditCard: Story = {
  decorators: [withOpenModal('00A327584')],
};

export const BankDraft: Story = {
  decorators: [
    withOpenModal('00A327584'),
    Story => {
      const dispatch = useAppDispatch();
      useEffect(() => { dispatch({ type: 'payment/setPaymentType', payload: 'Bank' }); }, []);
      return <Story />;
    },
  ],
};

export const SuccessState: Story = {
  decorators: [
    Story => {
      const dispatch = useAppDispatch();
      useEffect(() => {
        dispatch(openModal('00A327584'));
        dispatch(setSuccess({ token: 'tok_demo123', last4: '4242', confirmationNo: 'CONF-DEMO-001' }));
      }, []);
      return <Story />;
    },
  ],
};

export const ErrorState: Story = {
  decorators: [
    Story => {
      const dispatch = useAppDispatch();
      useEffect(() => {
        dispatch(openModal('00A327584'));
        dispatch(setError('Payment declined. Please try a different card.'));
      }, []);
      return <Story />;
    },
  ],
};
