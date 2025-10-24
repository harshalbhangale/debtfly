'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Mail, Loader2, Sparkles } from 'lucide-react';
import { 
  markPublicOnboardingComplete,
  getContactInfo,
  getTotalDebtAmount,
  getCreditorCount,
  getPublicOnboardingData
} from '@/lib/storage/public-onboarding';
import { sendMagicLinkEmail } from '@/lib/auth/magic-link';

export default function CompletePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'creating' | 'sending' | 'complete'>('creating');
  const [email, setEmail] = useState('');
  const [magicLink, setMagicLink] = useState('');

  useEffect(() => {
    const contactInfo = getContactInfo();
    if (!contactInfo) {
      router.push('/contact');
      return;
    }

    setEmail(contactInfo.email);

    // Simulate account creation and magic link sending
    const processCompletion = async () => {
      // Step 1: Creating account
      setStatus('creating');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mark public onboarding as complete
      markPublicOnboardingComplete();

      // Step 2: Sending magic link
      setStatus('sending');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send magic link
      try {
        const result = await sendMagicLinkEmail(contactInfo.email);
        if (result.success && result.magicLink) {
          setMagicLink(result.magicLink);
          console.log('🔗 Magic Link for testing:', result.magicLink);
        }
      } catch (error) {
        console.error('Error sending magic link:', error);
      }

      // Step 3: Complete
      setStatus('complete');
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 5000);
    };

    processCompletion();
  }, [router]);

  const totalDebt = getTotalDebtAmount();
  const creditorCount = getCreditorCount();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {status === 'creating' && (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Creating your portal account...</h2>
                  <p className="text-muted-foreground">
                    Setting up your secure case dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'sending' && (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Mail className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sending login details...</h2>
                  <p className="text-muted-foreground">
                    Emailing access link to <strong>{email}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {status === 'complete' && (
          <div className="space-y-6">
            {/* Success Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-3xl font-bold">All set!</h2>
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Your portal account has been created
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Sent Card */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Check your email</h3>
                    <p className="text-muted-foreground mb-3">
                      We&apos;ve sent a secure login link to:
                    </p>
                    <p className="font-mono text-sm bg-muted px-3 py-2 rounded border">
                      {email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Click the link in the email to access your portal.
                      <br />
                      The link is valid for 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Summary */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <h3 className="font-semibold text-lg mb-4">Your Case Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Creditors</span>
                    <span className="font-semibold">{creditorCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Total Debt</span>
                    <span className="font-semibold">
                      £{totalDebt.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardContent className="pt-6 pb-6">
                <h3 className="font-semibold text-lg mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Check your email</p>
                      <p className="text-sm text-muted-foreground">
                        Click the secure link to access your portal
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Select your plan</p>
                      <p className="text-sm text-muted-foreground">
                        Choose how you&apos;d like to pay for our services
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                      3
                    </div>
                    <div>
                      <p className="font-medium">We&apos;ll get to work</p>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll request documents from your creditors and begin investigation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testing Note */}
            {magicLink && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-amber-900">
                    <strong>For testing:</strong> Check the browser console for the magic link,
                    or you&apos;ll be redirected automatically in 5 seconds.
                  </p>
                </CardContent>
              </Card>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Redirecting to dashboard in a few seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

