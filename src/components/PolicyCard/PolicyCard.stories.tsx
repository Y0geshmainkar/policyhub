import type { Meta, StoryObj } from '@storybook/react';
import { PolicyCard } from './PolicyCard';
import type { Policy } from '../../types/policy';

const base: Policy = {
  id: '00A327584',
  division: 'GL',
  divisionName: 'Group Life',
  type: 'Group Term To 100',
  status: 'active',
  premium: 24.00,
  dueDate: '2026-07-16T00:00:00',
  autoPay: true,
  sourceSystem: 'CFO',
  insuredName: 'NOVOKUS, ISABELLE',
  paymentHistory: [],
};

const meta: Meta<typeof PolicyCard> = {
  title: 'Components/PolicyCard',
  component: PolicyCard,
  parameters: { layout: 'centered' },
  decorators: [Story => <div style={{ width: 300 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof PolicyCard>;

export const Active: Story = {
  args: { policy: { ...base, status: 'active', autoPay: true } },
};

export const PaymentDue: Story = {
  args: { policy: { ...base, status: 'due', autoPay: false } },
};

export const Lapsed: Story = {
  args: { policy: { ...base, status: 'lapsed', autoPay: false, insuredName: 'WAITE, JANET C' } },
};
