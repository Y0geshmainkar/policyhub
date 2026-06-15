import { useState } from 'react';
import { FormField, Input, Select, Button } from '../UI';

const ROUTING_MAP: Record<string, string> = {
  '021000021': 'JPMorgan Chase Bank',
  '021202337': 'Bank of America',
  '121042882': 'Wells Fargo Bank',
  '044000037': 'JPMorgan Chase Bank',
  '322271627': 'Wells Fargo Bank',
};

export interface BankFormValues {
  accountType: string;
  firstName: string;
  lastName: string;
  routingNumber: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

export function BankDraftForm({ onSubmit, disabled }: { onSubmit: (v: BankFormValues) => void; disabled?: boolean }) {
  const [v, setV] = useState<BankFormValues>({
    accountType: '', firstName: '', lastName: '',
    routingNumber: '', bankName: '', accountNumber: '', confirmAccountNumber: '',
  });
  const [e, setE] = useState<Partial<BankFormValues>>({});

  const set = (f: keyof BankFormValues, val: string) => setV(p => ({ ...p, [f]: val }));

  const handleRouting = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 9);
    setV(p => ({ ...p, routingNumber: digits, bankName: digits.length === 9 ? (ROUTING_MAP[digits] ?? 'Unknown Bank') : '' }));
  };

  const validate = () => {
    const err: Partial<BankFormValues> = {};
    if (!v.accountType)              err.accountType = 'Required';
    if (!v.firstName.trim())         err.firstName = 'Required';
    if (!v.lastName.trim())          err.lastName = 'Required';
    if (v.routingNumber.length !== 9) err.routingNumber = 'Must be 9 digits';
    if (!v.bankName)                 err.bankName = 'Enter valid routing number';
    if (v.accountNumber.length < 4)  err.accountNumber = 'Required';
    if (v.confirmAccountNumber !== v.accountNumber) err.confirmAccountNumber = 'Account numbers do not match';
    setE(err);
    return Object.keys(err).length === 0;
  };

  return (
    <form onSubmit={ev => { ev.preventDefault(); if (validate()) onSubmit(v); }} noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <FormField label="Account Type" required error={e.accountType}>
        <Select error={!!e.accountType} value={v.accountType}
          placeholder="Select account type"
          options={[{ value: 'checking', label: 'Checking' }, { value: 'savings', label: 'Savings' }]}
          onChange={ev => set('accountType', ev.target.value)} />
      </FormField>

      <div style={{ display: 'flex', gap: 12 }}>
        <FormField label="First Name" required error={e.firstName}>
          <Input placeholder="First" maxLength={30} value={v.firstName} error={!!e.firstName}
            onChange={ev => set('firstName', ev.target.value)} />
        </FormField>
        <FormField label="Last Name" required error={e.lastName}>
          <Input placeholder="Last" maxLength={30} value={v.lastName} error={!!e.lastName}
            onChange={ev => set('lastName', ev.target.value)} />
        </FormField>
      </div>

      <FormField label="Routing Number" required error={e.routingNumber}>
        <Input placeholder="9-digit routing number" inputMode="numeric" maxLength={9} mono
          value={v.routingNumber} error={!!e.routingNumber}
          onChange={ev => handleRouting(ev.target.value)} />
      </FormField>

      <FormField label="Bank Name" error={e.bankName}>
        <Input value={v.bankName} disabled placeholder="Auto-filled from routing number" />
      </FormField>

      <FormField label="Account Number" required error={e.accountNumber}>
        <Input type="password" inputMode="numeric" maxLength={17} mono
          value={v.accountNumber} error={!!e.accountNumber}
          onChange={ev => set('accountNumber', ev.target.value.replace(/\D/g, ''))} />
      </FormField>

      <FormField label="Confirm Account Number" required error={e.confirmAccountNumber}>
        <Input inputMode="numeric" maxLength={17} mono placeholder="Re-enter account number"
          value={v.confirmAccountNumber} error={!!e.confirmAccountNumber}
          onChange={ev => set('confirmAccountNumber', ev.target.value.replace(/\D/g, ''))} />
      </FormField>

      <Button type="submit" full disabled={disabled}>Pay Now</Button>
    </form>
  );
}
