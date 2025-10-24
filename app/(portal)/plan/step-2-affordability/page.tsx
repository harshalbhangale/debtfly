'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, Info, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/fee';
import { toast } from 'sonner';

interface AffordabilityData {
  // Income
  employment_income: number;
  benefits_income: number;
  other_income: number;
  
  // Expenses
  housing_costs: number;
  utilities: number;
  food_shopping: number;
  transport: number;
  insurance: number;
  other_expenses: number;
  existing_debt_payments: number;
}

export default function Step2AffordabilityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AffordabilityData>({
    employment_income: 0,
    benefits_income: 0,
    other_income: 0,
    housing_costs: 0,
    utilities: 0,
    food_shopping: 0,
    transport: 0,
    insurance: 0,
    other_expenses: 0,
    existing_debt_payments: 0,
  });

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [disposableIncome, setDisposableIncome] = useState(0);
  const [pathway, setPathway] = useState<'12_in_12' | 'regulated_credit' | 'fee_relief' | null>(null);

  useEffect(() => {
    // Load saved data
    const saved = localStorage.getItem('debtfly_affordability');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Calculate totals
  useEffect(() => {
    const income = formData.employment_income + formData.benefits_income + formData.other_income;
    const expenses = 
      formData.housing_costs +
      formData.utilities +
      formData.food_shopping +
      formData.transport +
      formData.insurance +
      formData.other_expenses +
      formData.existing_debt_payments;
    
    const disposable = income - expenses;
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setDisposableIncome(disposable);

    // Determine pathway
    const feeData = localStorage.getItem('debtfly_fee_acknowledged');
    if (feeData) {
      const fee = JSON.parse(feeData);
      const affordablePayment = Math.max(disposable * 0.3, 0); // Max 30% of disposable income
      
      // Can pay in 12 months or less with <=12 instalments?
      if (affordablePayment * 12 >= fee.final_fee) {
        setPathway('12_in_12');
      } else if (disposable > 0) {
        setPathway('regulated_credit');
      } else {
        setPathway('fee_relief');
      }
    }
  }, [formData]);

  const handleChange = (field: keyof AffordabilityData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleContinue = () => {
    if (totalIncome === 0) {
      toast.error('Please enter your income');
      return;
    }

    if (totalExpenses === 0) {
      toast.error('Please enter your expenses');
      return;
    }

    // Save affordability data
    const affordabilityAssessment = {
      ...formData,
      total_monthly_income: totalIncome,
      total_monthly_expenses: totalExpenses,
      disposable_income: disposableIncome,
      pathway,
      assessed_at: new Date().toISOString(),
    };

    localStorage.setItem('debtfly_affordability', JSON.stringify(affordabilityAssessment));

    // Route based on pathway
    if (pathway === '12_in_12') {
      toast.success('12-month payment plan available');
      router.push('/plan/step-3-agreements');
    } else if (pathway === 'regulated_credit') {
      toast.info('Additional information required for regulated credit');
      router.push('/plan/step-2a-detailed-ie');
    } else {
      toast.warning('Fee relief options available');
      router.push('/plan/step-3-agreements'); // In production, would show fee relief options
    }
  };

  const handleBack = () => {
    router.push('/plan/step-1-fee');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 2 of 6</span>
            <span>33% complete</span>
          </div>
          <Progress value={33} className="h-2" />
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
            Affordability Assessment
          </h1>
          <p className="text-lg text-muted-foreground">
            Help us understand your financial situation
          </p>
          <Badge variant="secondary" className="text-xs">
            Document: AFF-GATE-001
          </Badge>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  We need this information to ensure any payment plan is affordable for you.
                  This is a regulatory requirement and helps us provide the best service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Section */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
            <CardDescription>All income you receive each month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employment_income">Employment Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="employment_income"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.employment_income || ''}
                  onChange={(e) => handleChange('employment_income', e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits_income">Benefits / Universal Credit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="benefits_income"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.benefits_income || ''}
                  onChange={(e) => handleChange('benefits_income', e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_income">Other Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="other_income"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.other_income || ''}
                  onChange={(e) => handleChange('other_income', e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Monthly Income</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>All your regular monthly outgoings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'housing_costs', label: 'Housing (Rent/Mortgage)' },
              { id: 'utilities', label: 'Utilities (Gas/Electric/Water)' },
              { id: 'food_shopping', label: 'Food & Shopping' },
              { id: 'transport', label: 'Transport (Car/Public Transport)' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'existing_debt_payments', label: 'Existing Debt Payments' },
              { id: 'other_expenses', label: 'Other Expenses' },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    id={field.id}
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData[field.id as keyof AffordabilityData] || ''}
                    onChange={(e) => handleChange(field.id as keyof AffordabilityData, e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Monthly Expenses</span>
                <span className="text-xl font-bold">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className={
          disposableIncome > 0 
            ? 'bg-green-50 border-green-200' 
            : disposableIncome < 0 
              ? 'bg-red-50 border-red-200'
              : ''
        }>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Disposable Income</span>
              <span className={`text-3xl font-bold ${disposableIncome > 0 ? 'text-green-600' : disposableIncome < 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(Math.abs(disposableIncome))}
              </span>
            </div>

            {pathway === '12_in_12' && (
              <div className="flex items-start gap-2 p-3 bg-green-100 border border-green-200 rounded-lg">
                <Calculator className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">12-Month Payment Plan Available</p>
                  <p>Based on your income and expenses, you can pay the service fee in 12 monthly instalments or less.</p>
                </div>
              </div>
            )}

            {pathway === 'regulated_credit' && (
              <div className="flex items-start gap-2 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-1">Additional Information Required</p>
                  <p>We&apos;ll need more detailed information about your finances to offer a longer payment plan.</p>
                </div>
              </div>
            )}

            {pathway === 'fee_relief' && (
              <div className="flex items-start gap-2 p-3 bg-red-100 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">
                  <p className="font-semibold mb-1">Fee Relief Options Available</p>
                  <p>Based on your current situation, you may be eligible for reduced fees or alternative payment arrangements.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={totalIncome === 0 || !pathway}
            className="gap-2"
          >
            Continue
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

