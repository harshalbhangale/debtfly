'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertCircle, Info, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/fee';
import { toast } from 'sonner';

interface DetailedIE {
  // Employment
  employment_status: string;
  employer_name: string;
  job_title: string;
  employment_length: string;
  
  // Household
  household_size: number;
  num_dependents: number;
  housing_type: string;
  
  // Detailed expenses
  council_tax: number;
  water: number;
  electricity: number;
  gas: number;
  phone_internet: number;
  tv_license: number;
  childcare_costs: number;
  school_costs: number;
  clothing: number;
  health_prescriptions: number;
  pet_costs: number;
  
  // Other
  other_income_sources: string;
  benefits_breakdown: string;
  
  // Existing commitments
  existing_commitments: Array<{
    creditor: string;
    monthly_payment: number;
    balance: number;
    payment_current: boolean;
  }>;
  
  // Stress testing
  income_loss_impact: string;
  expense_increase_impact: string;
  emergency_fund: boolean;
  
  // Verification
  information_accurate: boolean;
}

export default function Step2ADetailedIEPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DetailedIE>({
    employment_status: '',
    employer_name: '',
    job_title: '',
    employment_length: '',
    household_size: 1,
    num_dependents: 0,
    housing_type: '',
    council_tax: 0,
    water: 0,
    electricity: 0,
    gas: 0,
    phone_internet: 0,
    tv_license: 0,
    childcare_costs: 0,
    school_costs: 0,
    clothing: 0,
    health_prescriptions: 0,
    pet_costs: 0,
    other_income_sources: '',
    benefits_breakdown: '',
    existing_commitments: [],
    income_loss_impact: '',
    expense_increase_impact: '',
    emergency_fund: false,
    information_accurate: false,
  });

  const [totalDetailedExpenses, setTotalDetailedExpenses] = useState(0);

  useEffect(() => {
    // Load saved data
    const saved = localStorage.getItem('debtfly_detailed_ie');
    if (saved) {
      setFormData(JSON.parse(saved));
    }

    // Load basic affordability
    const basic = localStorage.getItem('debtfly_affordability');
    if (!basic) {
      router.push('/plan/step-2-affordability');
    }
  }, [router]);

  // Calculate total detailed expenses
  useEffect(() => {
    const total = 
      formData.council_tax +
      formData.water +
      formData.electricity +
      formData.gas +
      formData.phone_internet +
      formData.tv_license +
      formData.childcare_costs +
      formData.school_costs +
      formData.clothing +
      formData.health_prescriptions +
      formData.pet_costs;
    
    setTotalDetailedExpenses(total);
  }, [formData]);

  const handleChange = (field: keyof DetailedIE, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.employment_status) {
      toast.error('Please select your employment status');
      return;
    }

    if (!formData.housing_type) {
      toast.error('Please select your housing type');
      return;
    }

    if (!formData.information_accurate) {
      toast.error('Please confirm that your information is accurate');
      return;
    }

    // Merge with basic affordability
    const basic = JSON.parse(localStorage.getItem('debtfly_affordability') || '{}');
    const detailed = {
      ...basic,
      detailed_ie: formData,
      assessment_type: 'detailed',
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('debtfly_affordability', JSON.stringify(detailed));
    localStorage.setItem('debtfly_detailed_ie', JSON.stringify(formData));
    
    toast.success('Detailed affordability assessment complete');
    router.push('/plan/step-3-agreements');
  };

  const handleBack = () => {
    router.push('/plan/step-2-affordability');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 2A of 6</span>
            <span>42% complete</span>
          </div>
          <Progress value={42} className="h-2" />
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
            Detailed Income & Expenditure
          </h1>
          <p className="text-lg text-muted-foreground">
            Additional information required for regulated credit
          </p>
          <Badge variant="secondary" className="text-xs">
            Document: AFF-GATE-001 (Full Version)
          </Badge>
        </div>

        {/* Regulatory Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Regulatory Requirement (CONC 5.2A)</p>
                <p className="text-sm text-muted-foreground">
                  For payment plans exceeding 12 months or 12 instalments, we must conduct a full
                  creditworthiness assessment. This information helps us ensure the agreement is
                  affordable and suitable for your circumstances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>Details about your current employment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employment_status">Employment Status *</Label>
              <Select
                value={formData.employment_status}
                onValueChange={(value) => handleChange('employment_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed (Full-time)</SelectItem>
                  <SelectItem value="employed_part_time">Employed (Part-time)</SelectItem>
                  <SelectItem value="self_employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="carer">Carer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.employment_status === 'employed' || formData.employment_status === 'employed_part_time' || formData.employment_status === 'self_employed') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employer_name">Employer Name / Business Name</Label>
                  <Input
                    id="employer_name"
                    value={formData.employer_name}
                    onChange={(e) => handleChange('employer_name', e.target.value)}
                    placeholder="Company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title / Role</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) => handleChange('job_title', e.target.value)}
                    placeholder="Your role"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment_length">How long in this role?</Label>
                  <Select
                    value={formData.employment_length}
                    onValueChange={(value) => handleChange('employment_length', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less_than_3_months">Less than 3 months</SelectItem>
                      <SelectItem value="3_to_6_months">3-6 months</SelectItem>
                      <SelectItem value="6_to_12_months">6-12 months</SelectItem>
                      <SelectItem value="1_to_2_years">1-2 years</SelectItem>
                      <SelectItem value="2_to_5_years">2-5 years</SelectItem>
                      <SelectItem value="over_5_years">Over 5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="benefits_breakdown">Benefits Received (if any)</Label>
              <Textarea
                id="benefits_breakdown"
                value={formData.benefits_breakdown}
                onChange={(e) => handleChange('benefits_breakdown', e.target.value)}
                placeholder="e.g., Universal Credit, Child Benefit, PIP"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_income_sources">Other Income Sources (if any)</Label>
              <Textarea
                id="other_income_sources"
                value={formData.other_income_sources}
                onChange={(e) => handleChange('other_income_sources', e.target.value)}
                placeholder="e.g., Rental income, pension, maintenance"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Household Details */}
        <Card>
          <CardHeader>
            <CardTitle>Household Information</CardTitle>
            <CardDescription>About your living situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="household_size">Household Size *</Label>
                <Input
                  id="household_size"
                  type="number"
                  min="1"
                  value={formData.household_size}
                  onChange={(e) => handleChange('household_size', parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">Total number of people living with you</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_dependents">Number of Dependents</Label>
                <Input
                  id="num_dependents"
                  type="number"
                  min="0"
                  value={formData.num_dependents}
                  onChange={(e) => handleChange('num_dependents', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Children or adults you financially support</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing_type">Housing Type *</Label>
              <Select
                value={formData.housing_type}
                onValueChange={(value) => handleChange('housing_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select housing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Renting (Private)</SelectItem>
                  <SelectItem value="rent_social">Renting (Social Housing)</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="owned">Owned Outright</SelectItem>
                  <SelectItem value="living_with_family">Living with Family/Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Monthly Expenses</CardTitle>
            <CardDescription>Break down of all your regular monthly costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'council_tax', label: 'Council Tax' },
              { id: 'water', label: 'Water' },
              { id: 'electricity', label: 'Electricity' },
              { id: 'gas', label: 'Gas' },
              { id: 'phone_internet', label: 'Phone & Internet' },
              { id: 'tv_license', label: 'TV License' },
              { id: 'childcare_costs', label: 'Childcare Costs' },
              { id: 'school_costs', label: 'School Costs (uniforms, trips, etc.)' },
              { id: 'clothing', label: 'Clothing' },
              { id: 'health_prescriptions', label: 'Health & Prescriptions' },
              { id: 'pet_costs', label: 'Pet Costs' },
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
                    value={formData[field.id as keyof DetailedIE] as number || ''}
                    onChange={(e) => handleChange(field.id as keyof DetailedIE, parseFloat(e.target.value) || 0)}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <Separator />

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Detailed Expenses</span>
                <span className="text-xl font-bold">{formatCurrency(totalDetailedExpenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Resilience</CardTitle>
            <CardDescription>Understanding your ability to handle changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income_loss_impact">
                What would happen if your income reduced or stopped temporarily?
              </Label>
              <Textarea
                id="income_loss_impact"
                value={formData.income_loss_impact}
                onChange={(e) => handleChange('income_loss_impact', e.target.value)}
                placeholder="e.g., I have savings to cover 3 months, or I would struggle immediately"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_increase_impact">
                How would you cope if an unexpected expense arose (e.g., car repair, boiler breakdown)?
              </Label>
              <Textarea
                id="expense_increase_impact"
                value={formData.expense_increase_impact}
                onChange={(e) => handleChange('expense_increase_impact', e.target.value)}
                placeholder="e.g., I have an emergency fund, or I would need to borrow"
                rows={2}
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="emergency_fund"
                checked={formData.emergency_fund}
                onCheckedChange={(checked) => handleChange('emergency_fund', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="emergency_fund" className="cursor-pointer font-medium">
                  I have an emergency fund or savings
                </Label>
                <p className="text-sm text-muted-foreground">
                  At least 1 month's expenses saved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Confirmation */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="information_accurate"
                checked={formData.information_accurate}
                onCheckedChange={(checked) => handleChange('information_accurate', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="information_accurate" className="cursor-pointer font-semibold text-base">
                  I confirm that all information provided is accurate and complete
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  This information will be used to assess whether the credit agreement is affordable
                  for you. Providing false or misleading information may result in an unsuitable
                  agreement and potential financial difficulty.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Why we need this detail</p>
                <p>
                  For credit agreements exceeding 12 months, FCA regulations (CONC 5.2A) require us to
                  conduct a thorough assessment of your creditworthiness. This ensures we only provide
                  credit that is affordable and sustainable for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!formData.employment_status || !formData.housing_type || !formData.information_accurate}
            className="gap-2 min-w-[200px]"
          >
            Continue to Agreements
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

