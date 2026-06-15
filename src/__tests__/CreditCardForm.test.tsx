import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardForm } from '../components/PaymentModal/CreditCardForm';

const fillAndSubmit = async (overrides: Record<string, string> = {}) => {
  const values = {
    name: 'JOHN SMITH',
    card: '4111111111111111',
    expiry: '12/28',
    cvv: '123',
    ...overrides,
  };
  if (values.name) await userEvent.type(screen.getByPlaceholderText('JOHN SMITH'), values.name);
  if (values.card) await userEvent.type(screen.getByPlaceholderText(/•••• •••• •••• ••••/), values.card);
  if (values.expiry) await userEvent.type(screen.getByPlaceholderText('MM/YY'), values.expiry);
  if (values.cvv) await userEvent.type(screen.getByPlaceholderText('•••'), values.cvv);
  fireEvent.click(screen.getByRole('button', { name: /pay now/i }));
};

describe('CreditCardForm', () => {
  it('renders all fields', () => {
    render(<CreditCardForm onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText('JOHN SMITH')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/•••• •••• •••• ••••/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('•••')).toBeInTheDocument();
  });

  it('calls onSubmit with values when form is valid', async () => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} />);
    await fillAndSubmit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const call = onSubmit.mock.calls[0][0];
    expect(call.cardholderName).toBe('JOHN SMITH');
    expect(call.expiry).toBe('12/28');
  });

  it('does not submit when name is empty', async () => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} />);
    await fillAndSubmit({ name: '' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('does not submit when card number is short', async () => {
    const onSubmit = jest.fn();
    render(<CreditCardForm onSubmit={onSubmit} />);
    await fillAndSubmit({ card: '1234' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/16-digit/)).toBeInTheDocument();
  });

  it('formats card number with spaces as user types', async () => {
    render(<CreditCardForm onSubmit={jest.fn()} />);
    const input = screen.getByPlaceholderText(/•••• •••• •••• ••••/) as HTMLInputElement;
    await userEvent.type(input, '4111111111111111');
    expect(input.value).toBe('4111 1111 1111 1111');
  });

  it('formats expiry with slash as user types', async () => {
    render(<CreditCardForm onSubmit={jest.fn()} />);
    const input = screen.getByPlaceholderText('MM/YY') as HTMLInputElement;
    await userEvent.type(input, '1228');
    expect(input.value).toBe('12/28');
  });

  it('is disabled when disabled prop is true', () => {
    render(<CreditCardForm onSubmit={jest.fn()} disabled />);
    expect(screen.getByRole('button', { name: /pay now/i })).toBeDisabled();
  });
});
