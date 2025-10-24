'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { getOnboardingStep, saveOnboardingStep } from '@/lib/storage/onboarding';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import { calculateFee, calculatePaymentOptions, formatCurrency } from '@/lib/calculations/fee';
import { calculateTotalDebt } from '@/lib/mock-data/debts';
import { CheckCircle2, Shield, TrendingUp, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FeeCalculation {
  finalFee: number;
  minCapped: boolean;
  maxCapped: boolean;
  totalDebt: number;
}

export default function PlanPage() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(12);
  const [totalDebt, setTotalDebt] = useState(0);
  const [feeCalc, setFeeCalc] = useState<FeeCalculation | null>(null);

  useEffect(() => {
    const debts = getOnboardingStep('debts');
    if (debts && debts.length > 0) {
      const total = calculateTotalDebt(debts);
      setTotalDebt(total);
      setFeeCalc(calculateFee(total));
    } else {
      // No debts, redirect back
      router.push('/debts/display');
    }

    // Load saved plan
    const savedPlan = getOnboardingStep('plan');
    if (savedPlan) {
      setSelectedDuration(savedPlan.selectedDuration);
    }
  }, [router]);

  const handleNext = () => {
    if (!feeCalc) return;

    const monthlyAmount = Math.ceil(feeCalc.finalFee / selectedDuration);

    const planData = {
      totalFee: feeCalc.finalFee,
      selectedDuration,
      monthlyAmount,
    };

    saveOnboardingStep('plan', planData);
    toast.success('Payment plan selected');
    router.push('/payment');
  };

  if (!feeCalc) {
    return null;
  }

  const paymentOptions = calculatePaymentOptions(feeCalc.finalFee);
  const selectedOption = paymentOptions.find(opt => opt.duration === selectedDuration);

  const potentialOutcomes = [
    { icon: Shield, label: 'Debt made unenforceable', description: 'Missing documentation can render debts legally unenforceable' },
    { icon: TrendingUp, label: 'Reduced settlements', description: 'Negotiate lower balances due to compliance issues' },
    { icon: CheckCircle2, label: 'Write-offs possible', description: 'Some creditors may write off debts lacking proper documentation' },
  ];

  return (
    <OnboardingGuard currentStep="plan">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
        <div className="w-full max-w-4xl space-y-6">
          <ProgressBar currentStep={6} totalSteps={7} />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">Your Payment Plan</CardTitle>
                  <CardDescription className="text-base">
                    Choose a payment plan that works for you
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Fee Breakdown */}
                  <div className="bg-muted/50 rounded-lg p-5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Total Debt</span>
                      <span className="text-lg font-semibold">{formatCurrency(totalDebt)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Service Fee (20%)</span>
                      <span className="text-lg font-semibold">{formatCurrency(feeCalc.finalFee)}</span>
                    </div>
                    {feeCalc.minCapped && (
                      <p className="text-xs text-muted-foreground">
                        * Minimum fee of {formatCurrency(500)} applied
                      </p>
                    )}
                    {feeCalc.maxCapped && (
                      <p className="text-xs text-muted-foreground">
                        * Maximum fee of {formatCurrency(5000)} applied
                      </p>
                    )}
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Payment Duration</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.duration}
                          onClick={() => setSelectedDuration(option.duration)}
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50',
                            selectedDuration === option.duration
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-muted/30'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{option.label}</span>
                                {option.duration === 12 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {option.duration} monthly payments
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(option.monthlyAmount)}
                              </p>
                              <p className="text-xs text-muted-foreground">per month</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Plan Summary */}
                  {selectedOption && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-green-900 mb-2">Selected Plan</p>
                          <div className="space-y-1 text-sm text-green-800">
                            <p>
                              <strong>{selectedOption.duration} payments</strong> of{' '}
                              <strong>{formatCurrency(selectedOption.monthlyAmount)}</strong>
                            </p>
                            <p className="text-xs text-green-700">
                              First payment starts after agreement is signed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <NextButton onClick={handleNext} label="Continue to Payment" />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Potential Outcomes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Potential Outcomes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {potentialOutcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <outcome.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{outcome.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {outcome.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground italic">
                      Outcomes vary by case and are not guaranteed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Need to discuss?</p>
                      <p className="text-xs text-muted-foreground">
                        Book a callback to speak with our team
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toast.info('Callback request feature coming soon')}
                    >
                      Request Callback
                    </Button>
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

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

