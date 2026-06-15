import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = { args: { status: 'active' } };
export const Due: Story    = { args: { status: 'due' } };
export const Lapsed: Story = { args: { status: 'lapsed' } };
