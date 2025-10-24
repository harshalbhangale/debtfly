'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, Mail, FileText, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { getTotalDebtAmount, getCreditorCount } from '@/lib/storage/public-onboarding';
import { formatCurrency } from '@/lib/calculations/fee';

export default function Step6CompletePage() {
  const router = useRouter();
  const [caseRef, setCaseRef] = useState('');

  useEffect(() => {
    // Generate case reference
    const ref = `DF-${Date.now().toString().slice(-8)}`;
    setCaseRef(ref);

    // Mark plan selection as complete
    localStorage.setItem('debtfly_plan_complete', 'true');
    localStorage.setItem('debtfly_case_reference', ref);
    localStorage.setItem('debtfly_case_status', 'active');

    // Send confirmation email (in production)
    console.log('📧 Sending case activation email...');
  }, []);

  const totalDebt = getTotalDebtAmount();
  const creditorCount = getCreditorCount();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Animation */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                All Complete!
              </h1>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-muted-foreground">
              Your case is now active and we&apos;re ready to start working
            </p>
          </div>
        </div>

        {/* Case Reference */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Your Case Reference</p>
              <p className="text-3xl md:text-4xl font-mono font-bold text-primary tracking-wider">
                {caseRef}
              </p>
              <p className="text-xs text-muted-foreground">
                Please quote this reference in all correspondence
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Case Summary */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Case Summary</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Creditors</span>
                <span className="font-bold text-xl">{creditorCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Total Debt</span>
                <span className="font-bold text-xl">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Case Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">Stage</span>
                <Badge variant="secondary">Requesting Documents</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-6">What Happens Next?</h3>
            <div className="space-y-6">
              <TimelineItem
                icon={Mail}
                title="Document Requests Sent"
                description="We&apos;ll send formal requests to your creditors asking for copies of all agreements and documentation"
                status="in_progress"
              />
              <TimelineItem
                icon={FileText}
                title="Document Review"
                description="Once received, our team will conduct a thorough compliance review of all documents (typically 8-12 weeks)"
                status="pending"
              />
              <TimelineItem
                icon={CreditCard}
                title="First Payment"
                description="Your first monthly payment will be collected on the date agreed in your payment schedule"
                status="pending"
              />
              <TimelineItem
                icon={Shield}
                title="Regular Updates"
                description="You&apos;ll receive regular progress updates via email and your portal dashboard"
                status="pending"
              />
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-amber-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-sm text-amber-900">
              <li>• <strong>Continue paying your debts:</strong> You remain responsible for your existing debts while we investigate</li>
              <li>• <strong>Creditor contact:</strong> Your creditors may still contact you directly during this process</li>
              <li>• <strong>Timeline:</strong> Document requests typically take 8-12 weeks depending on creditor response times</li>
              <li>• <strong>No guarantees:</strong> Outcomes vary by case and we cannot guarantee specific results</li>
            </ul>
          </CardContent>
        </Card>

        {/* Confirmation Email */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Confirmation Email Sent</h4>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a confirmation email with your case reference, payment schedule,
                  and next steps. Please check your inbox (and spam folder just in case).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center py-8">
          <p className="text-lg font-semibold mb-2">Thank you for choosing Debtfly</p>
          <p className="text-muted-foreground">
            We&apos;re committed to helping you resolve your debt situation
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  description,
  status,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'in_progress' | 'pending' | 'complete';
}) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === 'in_progress' 
          ? 'bg-primary text-primary-foreground' 
          : status === 'complete'
            ? 'bg-green-100 text-green-600'
            : 'bg-muted text-muted-foreground'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 pb-6 border-l-2 border-dashed border-border pl-4 ml-5">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        {status === 'in_progress' && (
          <Badge variant="default" className="mt-2 text-xs">
            In Progress
          </Badge>
        )}
      </div>
    </div>
  );
}

