'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { LikelihoodBadge } from '@/components/onboarding/LikelihoodBadge';
import { ManualDebtForm } from '@/components/onboarding/ManualDebtForm';
import { getOnboardingStep, saveOnboardingStep } from '@/lib/storage/onboarding';
import { getUser } from '@/lib/storage/user';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import { calculateTotalDebt } from '@/lib/mock-data/debts';
import { formatCurrency } from '@/lib/calculations/fee';
import type { Debt } from '@/lib/mock-data/types';
import { Building2, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DisplayDebtsPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    const saved = getOnboardingStep('debts');
    if (saved) {
      setDebts(saved);
    }
  }, []);

  const handleAddDebt = (debt: Debt) => {
    const updated = [...debts, debt];
    setDebts(updated);
    setShowManualForm(false);
    saveOnboardingStep('debts', updated);
  };

  const handleRemoveDebt = (debtId: string) => {
    const updated = debts.filter(d => d.id !== debtId);
    setDebts(updated);
    saveOnboardingStep('debts', updated);
    toast.success('Debt removed');
  };

  const handleNext = () => {
    if (debts.length === 0) {
      toast.error('Please add at least one debt to continue');
      return;
    }

    saveOnboardingStep('debts', debts);
    router.push('/plan');
  };

  const totalDebt = calculateTotalDebt(debts);
  const debtCount = debts.length;

  return (
    <OnboardingGuard currentStep="debts">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
        <div className="w-full max-w-3xl space-y-6">
          <ProgressBar currentStep={5} totalSteps={7} />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Review Your Debts</CardTitle>
              <CardDescription className="text-base">
                {debtCount > 0 ? (
                  <>Review the debts below and add any we may have missed</>
                ) : (
                  <>Add your debts to continue</>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Summary */}
              {debtCount > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Debts</p>
                    <p className="text-2xl font-bold">{debtCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(totalDebt)}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Average Balance</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalDebt / debtCount)}
                    </p>
                  </div>
                </div>
              )}

              {/* Debts List */}
              {debts.length > 0 && (
                <div className="space-y-4">
                  {debts.map((debt) => (
                    <Card key={debt.id} className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-7 h-7 text-primary" />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-bold text-xl">{debt.creditor_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ref: {debt.account_ref}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="capitalize">
                                {debt.status}
                              </Badge>
                              <LikelihoodBadge likelihood={debt.likelihood} />
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-foreground">
                                {formatCurrency(debt.current_balance)}
                              </span>
                              {debt.original_balance !== debt.current_balance && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatCurrency(debt.original_balance)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDebt(debt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Disclaimer */}
              {debtCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Important Notice</p>
                    <p>
                      Likelihood assessments are indicative only and based on preliminary analysis. 
                      Actual outcomes depend on full documentation review and creditor responses. 
                      We do not guarantee specific results.
                    </p>
                  </div>
                </div>
              )}

              {/* Manual Add Form */}
              {showManualForm ? (
                <ManualDebtForm
                  clientId={getUser()?.id || 'temp-client-id'}
                  onAdd={handleAddDebt}
                  onCancel={() => setShowManualForm(false)}
                />
              ) : (
                debtCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowManualForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Debt
                  </Button>
                )
              )}

              {/* Navigation */}
              {!showManualForm && debtCount > 0 && (
                <div className="pt-4">
                  <NextButton onClick={handleNext} label="Continue to Payment Plan" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}

