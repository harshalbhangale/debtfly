'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calculator, CheckCircle2, Phone, Info } from 'lucide-react';
import { getTotalDebtAmount } from '@/lib/storage/public-onboarding';
import { calculateFee, formatCurrency } from '@/lib/calculations/fee';
import { toast } from 'sonner';

export default function Step1FeePage() {
  const router = useRouter();
  const [totalDebt, setTotalDebt] = useState(0);
  const [feeCalc, setFeeCalc] = useState({
    total_debt: 0,
    fee_percentage: 20,
    calculated_fee: 0,
    final_fee: 0,
    min_capped: false,
    max_capped: false,
  });
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const debt = getTotalDebtAmount();
    setTotalDebt(debt);
    
    const calc = calculateFee(debt);
    setFeeCalc({
      total_debt: debt,
      fee_percentage: 20,
      calculated_fee: calc.finalFee,
      final_fee: calc.finalFee,
      min_capped: calc.minCapped,
      max_capped: calc.maxCapped,
    });

    // Check if already acknowledged
    const saved = localStorage.getItem('debtfly_fee_acknowledged');
    if (saved) {
      setAcknowledged(true);
    }
  }, []);

  const handleContinue = () => {
    if (!acknowledged) {
      toast.error('Please acknowledge the fee summary to continue');
      return;
    }

    // Save fee acknowledgement
    localStorage.setItem('debtfly_fee_acknowledged', JSON.stringify({
      ...feeCalc,
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
    }));

    toast.success('Fee summary acknowledged');
    router.push('/plan/step-2-affordability');
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 1 of 6</span>
            <span>17% complete</span>
          </div>
          <Progress value={17} className="h-2" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Service Fee Summary
          </h1>
          <p className="text-lg text-muted-foreground">
            Transparent pricing for our debt resolution services
          </p>
          <Badge variant="secondary" className="text-xs">
            Document: FEE-SUM-001
          </Badge>
        </div>

        {/* Fee Breakdown Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Your Service Fee</CardTitle>
                <CardDescription>Based on your total debt amount</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Calculation */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Debt Amount</span>
                <span className="text-xl font-semibold">{formatCurrency(totalDebt)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Fee Rate</span>
                <span className="text-xl font-semibold">20%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Calculated Fee</span>
                <span className="text-xl font-semibold">{formatCurrency(feeCalc.calculated_fee)}</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Your Total Service Fee</span>
                <span className="text-3xl font-bold text-primary">{formatCurrency(feeCalc.final_fee)}</span>
              </div>

              {feeCalc.min_capped && (
                <p className="text-sm text-muted-foreground">
                  * Minimum fee of {formatCurrency(500)} applied
                </p>
              )}
              {feeCalc.max_capped && (
                <p className="text-sm text-muted-foreground">
                  * Maximum fee of {formatCurrency(5000)} applied
                </p>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Affordable monthly payments</p>
                  <p className="text-sm text-muted-foreground">
                    This fee is payable in affordable monthly instalments.
                    You&apos;ll choose your payment plan in the next step.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <ServiceItem
                icon={CheckCircle2}
                title="Document Requests"
                description="We request all agreements and documentation from your creditors"
              />
              <ServiceItem
                icon={CheckCircle2}
                title="Compliance Review"
                description="Expert analysis of all documents for regulatory breaches"
              />
              <ServiceItem
                icon={CheckCircle2}
                title="Legal Assessment"
                description="Identification of unenforceable debts and compliance issues"
              />
              <ServiceItem
                icon={CheckCircle2}
                title="Negotiation Support"
                description="We negotiate with creditors on your behalf for best outcomes"
              />
              <ServiceItem
                icon={CheckCircle2}
                title="Case Management"
                description="Dedicated case manager and regular progress updates"
              />
              <ServiceItem
                icon={CheckCircle2}
                title="Ongoing Support"
                description="Email and phone support throughout your case"
              />
            </div>
          </CardContent>
        </Card>

        {/* What's NOT Included */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-amber-900">What&apos;s NOT Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-amber-900">
              <li>• Debt repayment to creditors (you remain responsible for your debts)</li>
              <li>• Legal representation in court proceedings</li>
              <li>• Guaranteed write-offs (outcomes depend on individual circumstances)</li>
              <li>• Financial advice (we are not FCA regulated advisors)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acknowledgement */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="fee-ack"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="fee-ack" className="cursor-pointer font-medium">
                  I have read and understood the fee summary
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  I understand that this fee is for debt resolution services and does not include
                  debt repayment. I acknowledge that outcomes vary by case and are not guaranteed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => {
              toast.info('Callback request feature coming soon');
            }}
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            Request a Callback
          </Button>
          
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!acknowledged}
            className="gap-2"
          >
            Continue to Affordability
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-green-600" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

