'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { getOnboardingStep, saveOnboardingStep, markOnboardingComplete } from '@/lib/storage/onboarding';
import { saveUser, getUser } from '@/lib/storage/user';
import { saveDebts } from '@/lib/storage/debts';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import { formatCurrency } from '@/lib/calculations/fee';
import { CreditCard, Landmark, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PlanData {
  totalFee: number;
  selectedDuration: number;
  monthlyAmount: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'direct_debit' | 'card'>('direct_debit');
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  
  // Direct Debit fields
  const [accountName, setAccountName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  useEffect(() => {
    const saved = getOnboardingStep('plan');
    if (!saved) {
      router.push('/plan');
      return;
    }
    setPlanData(saved);
  }, [router]);

  const handleComplete = async () => {
    // Validate payment details
    if (paymentMethod === 'direct_debit') {
      if (!accountName || !sortCode || !accountNumber) {
        toast.error('Please fill in all Direct Debit details');
        return;
      }
    } else {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    setLoading(true);

    // Simulate payment setup
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Save payment details (mock)
      const accountDetails: Record<string, string> = paymentMethod === 'direct_debit'
        ? { accountName, sortCode, accountNumber }
        : { lastFour: cardNumber.slice(-4), expiry: cardExpiry };

      const paymentData = {
        method: paymentMethod,
        accountDetails,
      };

      saveOnboardingStep('payment', paymentData);

      // Mark onboarding as complete
      markOnboardingComplete();

      // Update user
      const user = getUser();
      if (user) {
        saveUser({
          ...user,
          onboarding_complete: true,
          signed_at: new Date(),
        });
      }

      // Transfer debts from onboarding to main storage
      const debts = getOnboardingStep('debts');
      if (debts) {
        saveDebts(debts);
      }

      toast.success('🎉 Setup complete! Welcome to Debtfly');

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error completing payment setup:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!planData) return null;

  return (
    <OnboardingGuard currentStep="payment">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
        <div className="w-full max-w-3xl space-y-6">
          <ProgressBar currentStep={7} totalSteps={7} />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">Payment Setup</CardTitle>
                  <CardDescription className="text-base">
                    Set up your payment method for monthly plan payments
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div
                        className={cn(
                          'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                          paymentMethod === 'direct_debit'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/30'
                        )}
                      >
                        <RadioGroupItem value="direct_debit" id="dd" className="sr-only" />
                        <label htmlFor="dd" className="cursor-pointer space-y-2">
                          <div className="flex items-center gap-3">
                            <Landmark className="w-6 h-6 text-primary" />
                            <span className="font-semibold">Direct Debit</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Automatic monthly payments from your bank account
                          </p>
                        </label>
                      </div>

                      <div
                        className={cn(
                          'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                          paymentMethod === 'card'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/30'
                        )}
                      >
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <label htmlFor="card" className="cursor-pointer space-y-2">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-primary" />
                            <span className="font-semibold">Debit/Credit Card</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Pay with your debit or credit card
                          </p>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Direct Debit Form */}
                  {paymentMethod === 'direct_debit' && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Holder Name *</Label>
                        <Input
                          id="accountName"
                          placeholder="John Smith"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sortCode">Sort Code *</Label>
                          <Input
                            id="sortCode"
                            placeholder="12-34-56"
                            value={sortCode}
                            onChange={(e) => setSortCode(e.target.value)}
                            maxLength={8}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number *</Label>
                          <Input
                            id="accountNumber"
                            placeholder="12345678"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            maxLength={8}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Protected by the Direct Debit Guarantee
                      </p>
                    </div>
                  )}

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date *</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCVV">CVV *</Label>
                          <Input
                            id="cardCVV"
                            placeholder="123"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <NextButton 
                    onClick={handleComplete}
                    loading={loading}
                    label="Complete Setup"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Plan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-semibold">{formatCurrency(planData.totalFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{planData.selectedDuration} months</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Monthly Payment</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(planData.monthlyAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">14-Day Cooling Off</p>
                      <p className="text-xs">
                        You can cancel within 14 days with no penalty
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Secure Payment</p>
                      <p className="text-xs">
                        All payment details are encrypted and secure
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}

