'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { SignatureCanvas } from '@/components/onboarding/SignatureCanvas';
import { saveOnboardingStep, getOnboardingStep } from '@/lib/storage/onboarding';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SignaturePage() {
  const router = useRouter();
  
  const [signature, setSignature] = useState<string | null>(null);
  const [consentCRA, setConsentCRA] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = getOnboardingStep('signature');
    if (saved) {
      setSignature(saved.dataUrl || null);
      setConsentCRA(saved.consentCRA || false);
      setConsentTerms(saved.consentTerms || false);
    }
  }, []);

  const handleNext = () => {
    if (!signature) {
      toast.error('Please provide your signature');
      return;
    }

    if (!consentCRA || !consentTerms) {
      toast.error('Please accept all required consents');
      return;
    }

    const data = {
      dataUrl: signature,
      consentCRA,
      consentTerms,
      signedAt: new Date(),
    };

    saveOnboardingStep('signature', data);
    toast.success('Signature saved successfully');
    router.push('/debts');
  };

  const documents = [
    {
      id: 'privacy',
      title: 'Privacy Notice',
      content: `We collect and process your personal information to provide debt resolution services. Your data is securely stored and never shared without your explicit consent. You have the right to access, modify, or delete your information at any time.

Key Points:
• Data is encrypted and securely stored
• We never sell your information
• You can request data deletion anytime
• Full compliance with GDPR regulations`,
    },
    {
      id: 'scope',
      title: 'Engagement & Scope Summary',
      content: `This agreement outlines the services we'll provide:

Services Included:
• Credit file analysis and debt identification
• Communication with creditors on your behalf
• Request and review of credit agreements
• Assessment of debt enforceability
• Negotiation and resolution services

What We Don't Do:
• Provide regulated debt advice
• Guarantee specific outcomes
• Handle bankruptcy proceedings`,
    },
    {
      id: 'fees',
      title: 'Fee Summary',
      content: `Our fee structure is transparent and fixed:

• Service fee: 20% of total debt
• Minimum fee: £500
• Maximum fee: £5,000
• Payment plans available (12-60 months)
• No hidden charges
• No success-based fees

Payment is spread over agreed period with flexible options.`,
    },
  ];

  return (
    <OnboardingGuard currentStep="signature">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background py-12">
        <div className="w-full max-w-2xl space-y-6">
          <ProgressBar currentStep={3} totalSteps={7} />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Sign your agreement</CardTitle>
              <CardDescription className="text-base">
                Review the documents below and provide your signature to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Documents */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Important Documents</Label>
                {documents.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                      {expandedDoc === doc.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    <div className={cn(
                      'border-t overflow-hidden transition-all',
                      expandedDoc === doc.id ? 'max-h-96' : 'max-h-0'
                    )}>
                      <div className="p-4 bg-muted/30 overflow-y-auto max-h-80">
                        <p className="text-sm text-foreground whitespace-pre-line">
                          {doc.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Consents */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <Label className="text-base font-semibold">Required Consents</Label>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent-cra"
                    checked={consentCRA}
                    onCheckedChange={(checked) => setConsentCRA(checked as boolean)}
                  />
                  <label
                    htmlFor="consent-cra"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I consent to Debtfly conducting a soft credit search to identify my debts. 
                    This will not affect my credit score.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent-terms"
                    checked={consentTerms}
                    onCheckedChange={(checked) => setConsentTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="consent-terms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I have read and agree to the Privacy Notice, Terms & Conditions, and Fee Summary. 
                    I authorize Debtfly to act on my behalf to resolve my debts.
                  </label>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Your Signature *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Please sign below to confirm your agreement
                </p>
                <SignatureCanvas
                  onSignatureChange={setSignature}
                  initialSignature={signature || undefined}
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Cooling-off period:</strong> You have 14 days from signing to cancel 
                  this agreement without penalty. Your signature confirms your understanding 
                  and acceptance of our services.
                </p>
              </div>

              <NextButton 
                onClick={handleNext}
                disabled={!signature || !consentCRA || !consentTerms}
                label="Sign and Continue"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}



