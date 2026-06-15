import { screen } from '@testing-library/react';
import { PolicyCard } from '../components/PolicyCard/PolicyCard';
import { StatusBadge } from '../components/StatusBadge/StatusBadge';
import { renderWithProviders } from './testUtils';
import type { Policy } from '../types/policy';

const basePolicy: Policy = {
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

// ── PolicyCard ────────────────────────────────────────────────────────────

describe('PolicyCard', () => {
  it('renders policy number', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByText('00A327584')).toBeInTheDocument();
  });

  it('renders insured name', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByText('NOVOKUS, ISABELLE')).toBeInTheDocument();
  });

  it('renders plan type', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByText('Group Term To 100')).toBeInTheDocument();
  });

  it('renders premium amount', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByText(/\$24\.00/)).toBeInTheDocument();
  });

  it('shows AutoPay ON badge when autoPay is true', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByText(/AutoPay ON/)).toBeInTheDocument();
  });

  it('does not show AutoPay ON badge when autoPay is false', () => {
    renderWithProviders(<PolicyCard policy={{ ...basePolicy, autoPay: false }} />);
    expect(screen.queryByText(/AutoPay ON/)).not.toBeInTheDocument();
  });

  it('links to the policy detail page', () => {
    renderWithProviders(<PolicyCard policy={basePolicy} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/policy/00A327584');
  });
});

// ── StatusBadge ───────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  it('renders "Active" for active status', () => {
    renderWithProviders(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders "Payment Due" for due status', () => {
    renderWithProviders(<StatusBadge status="due" />);
    expect(screen.getByText('Payment Due')).toBeInTheDocument();
  });

  it('renders "Lapsed" for lapsed status', () => {
    renderWithProviders(<StatusBadge status="lapsed" />);
    expect(screen.getByText('Lapsed')).toBeInTheDocument();
  });

  it('has aria-label with status text', () => {
    renderWithProviders(<StatusBadge status="active" />);
    expect(screen.getByLabelText(/Status: Active/i)).toBeInTheDocument();
  });
});
