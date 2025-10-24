'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { saveOnboardingStep, getOnboardingStep } from '@/lib/storage/onboarding';
import { formatCurrency } from '@/lib/calculations/fee';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';

export default function QualifyingPage() {
  const router = useRouter();
  
  const [totalDebt, setTotalDebt] = useState(10000);
  const [monthlyPayments, setMonthlyPayments] = useState(200);
  const [currentlyPaying, setCurrentlyPaying] = useState<'yes' | 'no' | 'some'>('some');
  const [anyInDefault, setAnyInDefault] = useState<'yes' | 'no' | 'not_sure'>('not_sure');

  // Load saved data on mount
  useEffect(() => {
    const saved = getOnboardingStep('qualifying');
    if (saved) {
      setTotalDebt(saved.totalDebt);
      setMonthlyPayments(saved.monthlyPayments);
      setCurrentlyPaying(saved.currentlyPaying);
      setAnyInDefault(saved.anyInDefault);
    }
  }, []);

  const handleNext = () => {
    const data = {
      totalDebt,
      monthlyPayments,
      currentlyPaying,
      anyInDefault,
    };

    saveOnboardingStep('qualifying', data);
    router.push('/identity');
  };

  return (
    <OnboardingGuard currentStep="qualifying">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-2xl space-y-6">
          <ProgressBar currentStep={1} totalSteps={7} />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Let&apos;s understand your situation</CardTitle>
              <CardDescription className="text-base">
                Answer a few quick questions so we can help you better
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Total Debt */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  How much do you owe in total across all your debts?
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">£1,000</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(totalDebt)}
                    </span>
                    <span className="text-sm text-muted-foreground">£50,000</span>
                  </div>
                  <Slider
                    value={[totalDebt]}
                    onValueChange={(value) => setTotalDebt(value[0])}
                    min={1000}
                    max={50000}
                    step={500}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Monthly Payments */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  How much are you currently paying per month?
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">£0</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(monthlyPayments)}
                    </span>
                    <span className="text-sm text-muted-foreground">£2,000</span>
                  </div>
                  <Slider
                    value={[monthlyPayments]}
                    onValueChange={(value) => setMonthlyPayments(value[0])}
                    min={0}
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Currently Paying */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Are you currently paying these debts?
                </Label>
                <RadioGroup
                  value={currentlyPaying}
                  onValueChange={(value) => setCurrentlyPaying(value as typeof currentlyPaying)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="yes" id="paying-yes" />
                    <Label htmlFor="paying-yes" className="flex-1 cursor-pointer">
                      Yes, I&apos;m paying all of them
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="some" id="paying-some" />
                    <Label htmlFor="paying-some" className="flex-1 cursor-pointer">
                      I&apos;m paying some of them
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="no" id="paying-no" />
                    <Label htmlFor="paying-no" className="flex-1 cursor-pointer">
                      No, I&apos;m not paying any
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* In Default */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Do you have any debts in default?
                </Label>
                <RadioGroup
                  value={anyInDefault}
                  onValueChange={(value) => setAnyInDefault(value as typeof anyInDefault)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="yes" id="default-yes" />
                    <Label htmlFor="default-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="no" id="default-no" />
                    <Label htmlFor="default-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="not_sure" id="default-not-sure" />
                    <Label htmlFor="default-not-sure" className="flex-1 cursor-pointer">
                      Not sure
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <NextButton onClick={handleNext} />
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}

