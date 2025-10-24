'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  ArrowRight,
  FileText,
  Sparkles,
  CreditCard,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { getContactInfo, getDebtDetails, getTotalDebtAmount, getCreditorCount } from '@/lib/storage/public-onboarding';
import { formatCurrency } from '@/lib/calculations/fee';
import type { DebtDetails } from '@/lib/types/flow';

export default function DashboardPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<DebtDetails[]>([]);
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [planSelectionStarted, setPlanSelectionStarted] = useState(false);

  useEffect(() => {
    // Load data from public onboarding
    const contact = getContactInfo();
    if (contact) {
      setUserName(contact.first_name);
    }

    const debtList = getDebtDetails();
    setDebts(debtList);

    // Check if first visit
    const hasSeenWelcome = localStorage.getItem('debtfly_dashboard_welcome_seen');
    setShowWelcome(!hasSeenWelcome);

    // Check if plan selection already started
    const planStarted = localStorage.getItem('debtfly_plan_selection_started');
    setPlanSelectionStarted(!!planStarted);
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem('debtfly_dashboard_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const handleSelectPlan = () => {
    localStorage.setItem('debtfly_plan_selection_started', 'true');
    router.push('/plan/step-1-fee');
  };

  const totalDebt = getTotalDebtAmount();
  const creditorCount = getCreditorCount();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your debt resolution progress
        </p>
      </div>

      {/* Welcome Banner */}
      {showWelcome && (
        <Alert className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <Sparkles className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Your account is set up! Here&apos;s what happens next:
                </p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Select your payment plan below</li>
                  <li>• Complete a quick affordability assessment</li>
                  <li>• Sign the agreement and upload ID</li>
                  <li>• We&apos;ll start requesting documents from your creditors</li>
                </ul>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissWelcome}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Select Your Plan CTA - Only show if not started */}
      {!planSelectionStarted && (
        <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-primary">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
                <p className="text-muted-foreground">
                  Select your payment plan to activate your case and begin the investigation process
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleSelectPlan}
                className="gap-2 min-w-[200px]"
              >
                Select Your Plan
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection In Progress */}
      {planSelectionStarted && (
        <Alert>
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Plan Selection In Progress</p>
                <p className="text-sm mt-1">
                  Complete your plan selection to activate your case
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSelectPlan}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Creditors</p>
                <p className="text-2xl font-bold">{creditorCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Case Status</p>
                <Badge variant="secondary" className="mt-1">
                  {planSelectionStarted ? 'Plan Selection' : 'Setup Complete'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Debts</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/debt-details')}
            >
              Edit Debts
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          {debts.length > 0 ? (
            <div className="space-y-3">
              {debts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{debt.creditor_name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">
                        {formatCurrency(debt.approximate_amount)}
                      </Badge>
                      <Badge variant="outline">
                        {debt.debt_status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {debt.account_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    {debt.account_number && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Ref: {debt.account_number}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Debts Added</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first debt to get started
                </p>
              <Button onClick={() => router.push('/creditors')}>
                Add Debts
                  </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      {!planSelectionStarted && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Select Your Payment Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Choose how you&apos;d like to pay for our services
                  </p>
                  <Progress value={0} className="mt-2 h-2" />
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Affordability Assessment</p>
                  <p className="text-sm text-muted-foreground">
                    Quick questions about your income and expenses
                  </p>
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
        </div>
        <div>
                  <p className="font-medium">Sign Agreement & Upload ID</p>
                  <p className="text-sm text-muted-foreground">
                    Final steps to activate your case
                  </p>
                </div>
        </div>
      </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
