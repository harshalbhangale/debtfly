'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { createManualDebt } from '@/lib/mock-data/debts';
import type { Debt } from '@/lib/mock-data/types';
import { toast } from 'sonner';

interface ManualDebtFormProps {
  clientId: string;
  onAdd: (debt: Debt) => void;
  onCancel: () => void;
}

export function ManualDebtForm({ clientId, onAdd, onCancel }: ManualDebtFormProps) {
  const [creditorName, setCreditorName] = useState('');
  const [accountRef, setAccountRef] = useState('');
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState<'active' | 'default' | 'settled'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!creditorName.trim()) newErrors.creditorName = 'Creditor name is required';
    if (!accountRef.trim()) newErrors.accountRef = 'Account reference is required';
    if (!balance || parseFloat(balance) <= 0) newErrors.balance = 'Please enter a valid amount';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const debt = createManualDebt(
      clientId,
      creditorName.trim(),
      accountRef.trim(),
      parseFloat(balance),
      status
    );

    onAdd(debt);
    toast.success('Debt added successfully');

    // Reset form
    setCreditorName('');
    setAccountRef('');
    setBalance('');
    setStatus('active');
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Debt Manually</CardTitle>
        <CardDescription>
          Enter the details of a debt we couldn&apos;t find automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creditorName">Creditor Name *</Label>
            <Input
              id="creditorName"
              placeholder="e.g., Barclaycard"
              value={creditorName}
              onChange={(e) => {
                setCreditorName(e.target.value);
                if (errors.creditorName) setErrors(prev => ({ ...prev, creditorName: '' }));
              }}
              className={errors.creditorName ? 'border-red-500' : ''}
            />
            {errors.creditorName && (
              <p className="text-sm text-red-500">{errors.creditorName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountRef">Account Reference *</Label>
            <Input
              id="accountRef"
              placeholder="e.g. 1234567890"
              value={accountRef}
              onChange={(e) => {
                setAccountRef(e.target.value);
                if (errors.accountRef) setErrors(prev => ({ ...prev, accountRef: '' }));
              }}
              className={errors.accountRef ? 'border-red-500' : ''}
            />
            {errors.accountRef && (
              <p className="text-sm text-red-500">{errors.accountRef}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                £
              </span>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => {
                  setBalance(e.target.value);
                  if (errors.balance) setErrors(prev => ({ ...prev, balance: '' }));
                }}
                className={`pl-7 ${errors.balance ? 'border-red-500' : ''}`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.balance && (
              <p className="text-sm text-red-500">{errors.balance}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'active' | 'default' | 'settled')}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="default">In Default</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Debt
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

