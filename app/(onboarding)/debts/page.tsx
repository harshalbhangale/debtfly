'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { CRASearchAnimation } from '@/components/onboarding/CRASearchAnimation';
import { DebtCard } from '@/components/onboarding/DebtCard';
import { ManualDebtForm } from '@/components/onboarding/ManualDebtForm';
import { saveOnboardingStep, getOnboardingStep } from '@/lib/storage/onboarding';
import { getUser } from '@/lib/storage/user';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import { generateMockCRAResults } from '@/lib/mock-data/debts';
import type { Debt } from '@/lib/mock-data/types';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DebtsPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'searching' | 'results' | 'manual'>('searching');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);

  // Load saved debts or start CRA search
  useEffect(() => {
    const saved = getOnboardingStep('debts');
    if (saved && saved.length > 0) {
      setDebts(saved);
      setStage('results');
    } else {
      // Start automatic CRA search
      setStage('searching');
    }
  }, []);

  const handleSearchComplete = () => {
    // Generate mock CRA results
    const user = getUser();
    const clientId = user?.id || 'temp-client-id';
    const mockDebts = generateMockCRAResults(clientId, 3);
    
    setDebts(mockDebts);
    setStage('results');
    toast.success(`Found ${mockDebts.length} debts on your credit file`);
  };

  const handleAddDebt = (debt: Debt) => {
    const updated = [...debts, debt];
    setDebts(updated);
    setShowManualForm(false);
    saveOnboardingStep('debts', updated);
  };

  const handleEditDebt = () => {
    toast.info('Edit functionality would open a modal to edit debt details');
    // TODO: Implement edit modal
  };

  const handleDeleteDebt = (debt: Debt) => {
    const updated = debts.filter(d => d.id !== debt.id);
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
    router.push('/debts/display');
  };

  const handleSkip = () => {
    // Allow skipping with empty debts array
    saveOnboardingStep('debts', []);
    router.push('/debts/display');
  };

  // Show CRA search animation
  if (stage === 'searching') {
    return (
      <OnboardingGuard currentStep="debts">
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="w-full max-w-2xl space-y-6">
            <ProgressBar currentStep={4} totalSteps={7} />
            <CRASearchAnimation onComplete={handleSearchComplete} duration={3000} />
          </div>
        </div>
      </OnboardingGuard>
    );
  }

  // Show results and manual add
  return (
    <OnboardingGuard currentStep="debts">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
        <div className="w-full max-w-3xl space-y-6">
          <ProgressBar currentStep={4} totalSteps={7} />

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-2xl md:text-3xl">Your Debts</CardTitle>
                  <CardDescription className="text-base">
                    {debts.length > 0 ? (
                      <>We found {debts.length} debt{debts.length > 1 ? 's' : ''} on your credit file</>
                    ) : (
                      <>No debts found automatically. Add them manually below.</>
                    )}
                  </CardDescription>
                </div>
                {debts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip →
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Found Debts */}
              {debts.length > 0 ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900 mb-1">
                        Credit file search complete
                      </p>
                      <p className="text-sm text-green-800">
                        We&apos;ve found {debts.length} agreement{debts.length > 1 ? 's' : ''} that may be eligible for resolution.
                        Review them below and add any missing debts.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {debts.map((debt) => (
                      <DebtCard
                        key={debt.id}
                        debt={debt}
                        onEdit={handleEditDebt}
                        onDelete={handleDeleteDebt}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 mb-1">
                      No debts found automatically
                    </p>
                    <p className="text-sm text-amber-800">
                      We couldn&apos;t find any eligible debts on your credit file. 
                      This might be because they&apos;re older or not reported. 
                      Please add them manually below.
                    </p>
                  </div>
                </div>
              )}

              {/* Manual Add Section */}
              {!showManualForm ? (
                <div className="border-t pt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowManualForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Debt Manually
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Can&apos;t find a debt? Add it here
                  </p>
                </div>
              ) : (
                <ManualDebtForm
                  clientId={getUser()?.id || 'temp-client-id'}
                  onAdd={handleAddDebt}
                  onCancel={() => setShowManualForm(false)}
                />
              )}

              {/* Navigation */}
              {debts.length > 0 && !showManualForm && (
                <div className="pt-4">
                  <NextButton onClick={handleNext} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}

