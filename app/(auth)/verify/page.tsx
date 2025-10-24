'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyMagicLinkToken } from '@/lib/auth/magic-link';
import { saveUser } from '@/lib/storage/user';
import { isOnboardingComplete } from '@/lib/storage/onboarding';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('No verification token provided');
      return;
    }

    // Verify the magic link token
    const result = verifyMagicLinkToken(token);

    if (result.valid && result.email) {
      // Create a mock user
      const mockUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: result.email,
        first_name: result.email.split('@')[0],
        last_name: '',
        phone: '',
        onboarding_complete: isOnboardingComplete(),
        is_verified: true,
        tasks_complete: {
          uploadId: false,
          addressVerified: false,
          signatureComplete: false,
        },
        created_at: new Date(),
        updated_at: new Date(),
      };

      saveUser(mockUser);
      setStatus('success');

      // Redirect after 2 seconds
      setTimeout(() => {
        if (mockUser.onboarding_complete) {
          router.push('/dashboard');
        } else {
          router.push('/qualifying');
        }
      }, 2000);
    } else {
      setStatus('error');
      setError(result.error || 'Invalid or expired token');
    }
  }, [searchParams, router]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verifying your link</CardTitle>
            <CardDescription>Please wait a moment...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Success!</CardTitle>
            <CardDescription>
              You&apos;ve been successfully signed in.
              <br />
              Redirecting...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
          <CardDescription className="text-base mt-2">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

