'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, Eye } from 'lucide-react';
import { SignatureInput } from '@/components/portal/SignatureInput';
import { getContactInfo } from '@/lib/storage/public-onboarding';
import { toast } from 'sonner';

export default function Step3AgreementsPage() {
  const router = useRouter();
  const [cclSignature, setCclSignature] = useState('');
  const [creditSignature, setCreditSignature] = useState('');
  const [fullName, setFullName] = useState('');
  const [pathway, setPathway] = useState<'12_in_12' | 'regulated_credit' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load user info
    const contact = getContactInfo();
    if (contact) {
      setFullName(`${contact.first_name} ${contact.last_name}`);
    }

    // Load pathway
    const affordability = localStorage.getItem('debtfly_affordability');
    if (affordability) {
      const data = JSON.parse(affordability);
      setPathway(data.pathway);
    }

    // Load saved signatures
    const saved = localStorage.getItem('debtfly_signatures');
    if (saved) {
      const data = JSON.parse(saved);
      setCclSignature(data.ccl_signature || '');
      setCreditSignature(data.credit_signature || '');
    }
  }, []);

  const validateSignatures = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cclSignature.trim()) {
      newErrors.ccl = 'Client Care Letter signature is required';
    }

    if (!creditSignature.trim()) {
      newErrors.credit = 'Credit Agreement signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateSignatures()) {
      toast.error('Please sign all required documents');
      return;
    }

    // Save signatures
    const signatures = {
      ccl_signature: cclSignature,
      credit_signature: creditSignature,
      pathway,
      signed_at: new Date().toISOString(),
      ip_address: 'localhost', // In production, capture real IP
      user_agent: navigator.userAgent,
    };

    localStorage.setItem('debtfly_signatures', JSON.stringify(signatures));
    toast.success('Agreements signed successfully');
    router.push('/plan/step-4-payment');
  };

  const handleBack = () => {
    if (pathway === 'regulated_credit') {
      router.push('/plan/step-2a-detailed-ie');
    } else {
      router.push('/plan/step-2-affordability');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 3 of 6</span>
            <span>50% complete</span>
          </div>
          <Progress value={50} className="h-2" />
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
            Terms & Agreement
          </h1>
          <p className="text-lg text-muted-foreground">
            Please review and sign the following documents
          </p>
        </div>

        {/* Document 1: Client Care Letter */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Client Care Letter & Terms of Business</CardTitle>
                  <CardDescription>Our service agreement and terms</CardDescription>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Document: CCL-TOB-001
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => toast.info('Document viewer coming soon')}
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Document summary */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>This document covers:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Services we provide</li>
                <li>Your costs and payment terms</li>
                <li>Our complaints procedure</li>
                <li>How we handle client money</li>
                <li>Data protection and privacy</li>
                <li>Our regulatory status</li>
              </ul>
            </div>

            <Separator />

            {/* Signature */}
            <SignatureInput
              value={cclSignature}
              onChange={(value) => {
                setCclSignature(value);
                if (errors.ccl) setErrors(prev => ({ ...prev, ccl: '' }));
              }}
              label="Sign Client Care Letter"
              error={errors.ccl}
              placeholder={fullName || 'Type your full name'}
            />
          </CardContent>
        </Card>

        {/* Document 2: Credit Agreement */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>
                    {pathway === '12_in_12' ? '12-in-12 Instalment Agreement' : 'Regulated Credit Agreement'}
                  </CardTitle>
                  <CardDescription>
                    {pathway === '12_in_12' 
                      ? 'Payment plan terms (12 months or less)'
                      : 'Extended payment plan terms (regulated credit)'
                    }
                  </CardDescription>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Document: {pathway === '12_in_12' ? 'AGR-12x12-001' : 'AGR-RC-001'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => toast.info('Document viewer coming soon')}
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Document summary */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>This agreement includes:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Total service fee amount</li>
                <li>Number and amount of monthly instalments</li>
                <li>Payment schedule and dates</li>
                <li>Interest rate (0% APR)</li>
                {pathway === 'regulated_credit' && (
                  <>
                    <li>Pre-contract credit information (SECCI)</li>
                    <li>Adequate explanations summary</li>
                    <li>14-day withdrawal rights</li>
                  </>
                )}
                <li>Consequences of missed payments</li>
                <li>Your cancellation rights</li>
              </ul>
            </div>

            {pathway === 'regulated_credit' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                <p><strong>Regulated Credit Agreement:</strong></p>
                <p className="mt-1">
                  This is a regulated consumer credit agreement. You have a 14-day withdrawal period
                  after signing. Additional pre-contract documents (PCI-RC-001 and COB-AX-SCRIPT-001)
                  are included in the full agreement.
                </p>
              </div>
            )}

            <Separator />

            {/* Signature */}
            <SignatureInput
              value={creditSignature}
              onChange={(value) => {
                setCreditSignature(value);
                if (errors.credit) setErrors(prev => ({ ...prev, credit: '' }));
              }}
              label={`Sign ${pathway === '12_in_12' ? '12-in-12 Agreement' : 'Regulated Credit Agreement'}`}
              error={errors.credit}
              placeholder={fullName || 'Type your full name'}
            />
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              <strong>Legal Notice:</strong> By signing above, you confirm that you have read,
              understood, and agree to be bound by the terms of these agreements. Your typed
              signature is legally binding and equivalent to a handwritten signature.
            </p>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            className="gap-2 min-w-[200px]"
          >
            Continue to Payment
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

