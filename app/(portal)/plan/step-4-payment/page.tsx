'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CreditCard, Building2, Banknote, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/fee';
import { toast } from 'sonner';

type PaymentMethod = 'direct_debit' | 'bank_transfer' | 'debit_card';

export default function Step4PaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('direct_debit');
  const [mandateSigned, setMandateSigned] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  
  // Direct Debit fields
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Calculate monthly amount from fee
    const feeData = localStorage.getItem('debtfly_fee_acknowledged');
    const affordability = localStorage.getItem('debtfly_affordability');
    
    if (feeData && affordability) {
      const fee = JSON.parse(feeData);
      const afford = JSON.parse(affordability);
      
      if (afford.pathway === '12_in_12') {
        setMonthlyAmount(Math.ceil(fee.final_fee / 12));
      } else {
        // Calculate based on affordable amount (example: 24 months)
        setMonthlyAmount(Math.ceil(fee.final_fee / 24));
      }
    }

    // Load saved data
    const saved = localStorage.getItem('debtfly_payment_method');
    if (saved) {
      const data = JSON.parse(saved);
      setPaymentMethod(data.method);
      setSortCode(data.sort_code || '');
      setAccountNumber(data.account_number || '');
      setAccountHolder(data.account_holder_name || '');
      setMandateSigned(data.mandate_signed || false);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'direct_debit') {
      if (!sortCode || sortCode.length !== 6) {
        newErrors.sortCode = 'Please enter a valid 6-digit sort code';
      }
      if (!accountNumber || accountNumber.length < 8) {
        newErrors.accountNumber = 'Please enter a valid account number';
      }
      if (!accountHolder.trim()) {
        newErrors.accountHolder = 'Please enter the account holder name';
      }
    }

    if (!mandateSigned) {
      newErrors.mandate = 'Please confirm the payment mandate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error('Please complete all required fields');
      return;
    }

    // Save payment method
    const paymentData = {
      method: paymentMethod,
      sort_code: paymentMethod === 'direct_debit' ? sortCode : undefined,
      account_number: paymentMethod === 'direct_debit' ? accountNumber : undefined,
      account_holder_name: paymentMethod === 'direct_debit' ? accountHolder : undefined,
      mandate_signed: mandateSigned,
      mandate_signed_at: new Date().toISOString(),
    };

    localStorage.setItem('debtfly_payment_method', JSON.stringify(paymentData));
    toast.success('Payment method saved');
    router.push('/plan/step-5-id-verification');
  };

  const handleBack = () => {
    router.push('/plan/step-3-agreements');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 4 of 6</span>
            <span>67% complete</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Payment Method Setup
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you&apos;d like to make your monthly payments
          </p>
        </div>

        {/* Monthly Amount Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your monthly payment</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(monthlyAmount)}</p>
              <p className="text-xs text-muted-foreground mt-2">per month</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'direct_debit' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
              }`}>
                <RadioGroupItem value="direct_debit" id="direct_debit" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-primary" />
                    <Label htmlFor="direct_debit" className="text-base font-semibold cursor-pointer">
                      Direct Debit (Recommended)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatic monthly payments from your bank account. Most convenient option.
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
              }`}>
                <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-5 h-5 text-primary" />
                    <Label htmlFor="bank_transfer" className="text-base font-semibold cursor-pointer">
                      Bank Transfer (Standing Order)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set up a standing order through your online banking. You control the payments.
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'debit_card' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/30'
              }`}>
                <RadioGroupItem value="debit_card" id="debit_card" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <Label htmlFor="debit_card" className="text-base font-semibold cursor-pointer">
                      Debit Card
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manual payment each month. You&apos;ll receive a reminder email.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Direct Debit Details */}
        {paymentMethod === 'direct_debit' && (
          <Card>
            <CardHeader>
              <CardTitle>Direct Debit Details</CardTitle>
              <CardDescription>Enter your bank account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p><strong>Direct Debit Guarantee:</strong> Your payments are protected by the Direct Debit Guarantee. We will notify you in advance of any changes to the amount or date.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_holder">Account Holder Name *</Label>
                <Input
                  id="account_holder"
                  value={accountHolder}
                  onChange={(e) => {
                    setAccountHolder(e.target.value);
                    if (errors.accountHolder) setErrors(prev => ({ ...prev, accountHolder: '' }));
                  }}
                  className={errors.accountHolder ? 'border-destructive' : ''}
                  placeholder="John Smith"
                />
                {errors.accountHolder && (
                  <p className="text-sm text-destructive">{errors.accountHolder}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_code">Sort Code *</Label>
                  <Input
                    id="sort_code"
                    value={sortCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setSortCode(value);
                      if (errors.sortCode) setErrors(prev => ({ ...prev, sortCode: '' }));
                    }}
                    className={errors.sortCode ? 'border-destructive' : ''}
                    placeholder="12-34-56"
                    maxLength={8}
                  />
                  {errors.sortCode && (
                    <p className="text-sm text-destructive">{errors.sortCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number *</Label>
                  <Input
                    id="account_number"
                    value={accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setAccountNumber(value);
                      if (errors.accountNumber) setErrors(prev => ({ ...prev, accountNumber: '' }));
                    }}
                    className={errors.accountNumber ? 'border-destructive' : ''}
                    placeholder="12345678"
                    maxLength={8}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-destructive">{errors.accountNumber}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mandate Confirmation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="mandate"
                checked={mandateSigned}
                onCheckedChange={(checked) => {
                  setMandateSigned(checked as boolean);
                  if (errors.mandate) setErrors(prev => ({ ...prev, mandate: '' }));
                }}
              />
              <div className="flex-1">
                <Label htmlFor="mandate" className="cursor-pointer font-medium">
                  I authorize Debtfly to collect payments via {paymentMethod.replace('_', ' ')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  I confirm that I am the account holder and have the authority to set up this payment method.
                  {paymentMethod === 'direct_debit' && ' Payments are protected by the Direct Debit Guarantee.'}
                  {paymentMethod === 'debit_card' && ' No Continuous Payment Authority (CPA) will be stored.'}
                </p>
                {errors.mandate && (
                  <p className="text-sm text-destructive mt-1">{errors.mandate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            className="gap-2 min-w-[200px]"
          >
            Continue to ID Verification
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

