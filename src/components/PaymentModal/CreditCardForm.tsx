import { useState } from 'react';
import { FormField, Input, Button } from '../UI';

export interface CCFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export function CreditCardForm({ onSubmit, disabled }: { onSubmit: (v: CCFormValues) => void; disabled?: boolean }) {
  const [v, setV] = useState<CCFormValues>({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
  const [e, setE] = useState<Partial<CCFormValues>>({});

  const set = (f: keyof CCFormValues, val: string) => setV(p => ({ ...p, [f]: val }));

  const validate = () => {
    const err: Partial<CCFormValues> = {};
    if (!v.cardholderName.trim()) err.cardholderName = 'Required';
    if (v.cardNumber.replace(/\s/g, '').length < 16) err.cardNumber = 'Enter 16-digit card number';
    const [mm, yy] = (v.expiry || '').split('/');
    if (!mm || !yy || +mm < 1 || +mm > 12 || yy.length < 2) err.expiry = 'Enter valid MM/YY';
    if (v.cvv.length < 3) err.cvv = 'Enter 3-digit CVV';
    setE(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSubmit(v);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormField label="Name on Card" required error={e.cardholderName}>
        <Input placeholder="JOHN SMITH" maxLength={60}
          value={v.cardholderName} error={!!e.cardholderName}
          onChange={ev => set('cardholderName', ev.target.value)} />
      </FormField>

      <FormField label="Card Number" required error={e.cardNumber}>
        <Input placeholder="•••• •••• •••• ••••" inputMode="numeric" mono error={!!e.cardNumber}
          value={v.cardNumber}
          onChange={ev => set('cardNumber', formatCardNumber(ev.target.value))} />
      </FormField>

      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="Expiry (MM/YY)" required error={e.expiry}>
          <Input placeholder="MM/YY" inputMode="numeric" maxLength={5} mono error={!!e.expiry}
            value={v.expiry} onChange={ev => set('expiry', formatExpiry(ev.target.value))} />
        </FormField>
        <FormField label="CVV" required error={e.cvv}>
          <Input type="password" inputMode="numeric" placeholder="•••" maxLength={4} mono error={!!e.cvv}
            value={v.cvv} onChange={ev => set('cvv', ev.target.value.replace(/\D/g, '').slice(0, 4))} />
        </FormField>
      </div>

      <Button type="submit" full disabled={disabled}>Pay Now</Button>
    </form>
  );
}
