'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { 
  getCreditorSelection, 
  getAddressHistory, 
  saveDebtDetails, 
  getDebtDetails 
} from '@/lib/storage/public-onboarding';
import { getCreditorById } from '@/lib/mock-data/creditors';
import type { DebtDetails } from '@/lib/types/flow';
import { toast } from 'sonner';

export default function DebtDetailsPage() {
  const router = useRouter();
  const [currentCreditorIndex, setCurrentCreditorIndex] = useState(0);
  const [creditorNames, setCreditorNames] = useState<Array<{ id: string, name: string }>>([]);
  const [debtData, setDebtData] = useState<Record<string, DebtDetails>>({});
  const [currentDebt, setCurrentDebt] = useState<Partial<DebtDetails>>({
    account_number: '',
    approximate_amount: 0,
    debt_status: 'active',
    account_type: 'credit_card',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load creditors and saved debt data
  useEffect(() => {
    const addresses = getAddressHistory();
    if (!addresses) {
      router.push('/address');
      return;
    }

    const selection = getCreditorSelection();
    if (!selection) {
      router.push('/creditors');
      return;
    }

    // Build list of creditors
    const creditors: Array<{ id: string, name: string }> = [];
    
    // Add database creditors
    selection.selected_creditor_ids.forEach(id => {
      const creditor = getCreditorById(id);
      if (creditor) {
        creditors.push({ id: creditor.id, name: creditor.name });
      }
    });

    // Add manually entered creditors
    if (selection.other_creditors) {
      selection.other_creditors.forEach((name, index) => {
        creditors.push({ id: `other-${index}`, name });
      });
    }

    setCreditorNames(creditors);

    // Load existing debt details
    const savedDebts = getDebtDetails();
    const debtMap: Record<string, DebtDetails> = {};
    savedDebts.forEach(debt => {
      debtMap[debt.creditor_id] = debt;
    });
    setDebtData(debtMap);

    // Load current creditor data if exists
    if (creditors.length > 0) {
      const currentCreditorId = creditors[0].id;
      if (debtMap[currentCreditorId]) {
        setCurrentDebt(debtMap[currentCreditorId]);
      } else {
        setCurrentDebt({
          account_number: '',
          approximate_amount: 0,
          debt_status: 'active',
          account_type: 'credit_card',
        });
      }
    }
  }, [router]);

  useEffect(() => {
    // Load debt data for current creditor
    if (creditorNames.length > 0) {
      const currentCreditorId = creditorNames[currentCreditorIndex].id;
      if (debtData[currentCreditorId]) {
        setCurrentDebt(debtData[currentCreditorId]);
      } else {
        setCurrentDebt({
          account_number: '',
          approximate_amount: 0,
          debt_status: 'active',
          account_type: 'credit_card',
        });
      }
    }
  }, [currentCreditorIndex, creditorNames, debtData]);

  const validateCurrentDebt = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentDebt.approximate_amount || currentDebt.approximate_amount <= 0) {
      newErrors.amount = 'Please enter the amount owed';
    }

    if (!currentDebt.debt_status) {
      newErrors.status = 'Please select the debt status';
    }

    if (!currentDebt.account_type) {
      newErrors.type = 'Please select the account type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentDebt()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Save current debt
    const currentCreditorId = creditorNames[currentCreditorIndex].id;
    const debt: DebtDetails = {
      id: `debt-${currentCreditorId}`,
      creditor_id: currentCreditorId,
      creditor_name: creditorNames[currentCreditorIndex].name,
      account_number: currentDebt.account_number || undefined,
      approximate_amount: currentDebt.approximate_amount!,
      debt_status: currentDebt.debt_status!,
      account_type: currentDebt.account_type!,
    };

    setDebtData(prev => ({ ...prev, [currentCreditorId]: debt }));

    // Move to next creditor or finish
    if (currentCreditorIndex < creditorNames.length - 1) {
      setCurrentCreditorIndex(prev => prev + 1);
      setErrors({});
    } else {
      // All creditors done, save and move to review
      const allDebts = Object.values({ ...debtData, [currentCreditorId]: debt });
      saveDebtDetails(allDebts);
      toast.success('All debt details saved');
      router.push('/review');
    }
  };

  const handleBack = () => {
    if (currentCreditorIndex > 0) {
      setCurrentCreditorIndex(prev => prev - 1);
      setErrors({});
    } else {
      router.push('/address');
    }
  };

  if (creditorNames.length === 0) {
    return null;
  }

  const currentCreditor = creditorNames[currentCreditorIndex];
  const progress = ((currentCreditorIndex + 1) / creditorNames.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step 6 of 8</span>
            <span>75% complete</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        {/* Creditor Progress */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Debt {currentCreditorIndex + 1} of {creditorNames.length}
              </span>
              <Progress value={progress} className="w-32 h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {currentCreditor.name}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base">
              Tell us about this debt
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Number (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="account_number">
                Account or Reference Number (optional)
              </Label>
              <Input
                id="account_number"
                value={currentDebt.account_number || ''}
                onChange={(e) => {
                  setCurrentDebt(prev => ({ ...prev, account_number: e.target.value }));
                }}
                placeholder="e.g., ****1234"
              />
              <p className="text-xs text-muted-foreground">
                This helps us identify your account with the creditor
              </p>
            </div>

            {/* Amount Owed */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Approximate Amount Owed <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  £
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentDebt.approximate_amount || ''}
                  onChange={(e) => {
                    setCurrentDebt(prev => ({ ...prev, approximate_amount: parseFloat(e.target.value) || 0 }));
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  className={`pl-7 ${errors.amount ? 'border-destructive' : ''}`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            {/* Debt Status */}
            <div className="space-y-3">
              <Label>
                Debt Status <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={currentDebt.debt_status}
                onValueChange={(value) => {
                  setCurrentDebt(prev => ({ ...prev, debt_status: value as DebtDetails['debt_status'] }));
                  if (errors.status) setErrors(prev => ({ ...prev, status: '' }));
                }}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="flex-1 cursor-pointer">
                    Active (making payments)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="in_default" id="status-default" />
                  <Label htmlFor="status-default" className="flex-1 cursor-pointer">
                    In default (missed payments)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="ccj_issued" id="status-ccj" />
                  <Label htmlFor="status-ccj" className="flex-1 cursor-pointer">
                    CCJ issued
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="other" id="status-other" />
                  <Label htmlFor="status-other" className="flex-1 cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="account_type">
                Account Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={currentDebt.account_type}
                onValueChange={(value) => {
                  setCurrentDebt(prev => ({ ...prev, account_type: value as DebtDetails['account_type'] }));
                  if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
                }}
              >
                <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="overdraft">Overdraft</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="store_card">Store Card</SelectItem>
                  <SelectItem value="payday_loan">Payday Loan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleNext}
              size="lg"
              className="w-full"
            >
              {currentCreditorIndex < creditorNames.length - 1 ? 'Next Debt' : 'Continue to Review'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

