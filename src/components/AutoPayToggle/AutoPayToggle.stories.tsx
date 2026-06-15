import type { Meta, StoryObj } from '@storybook/react';
import { AutoPayToggle } from './AutoPayToggle';

const meta: Meta<typeof AutoPayToggle> = {
  title: 'Components/AutoPayToggle',
  component: AutoPayToggle,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof AutoPayToggle>;

export const On: Story  = { args: { policyId: 'demo-001', checked: true } };
export const Off: Story = { args: { policyId: 'demo-001', checked: false } };
