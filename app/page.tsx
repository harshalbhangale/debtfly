'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/storage/user';
import { isPublicOnboardingComplete } from '@/lib/storage/public-onboarding';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authenticated = isAuthenticated();
    const publicComplete = isPublicOnboardingComplete();

    if (authenticated && publicComplete) {
      // Authenticated users who completed public onboarding → portal dashboard
      router.push('/dashboard');
    } else {
      // Everyone else → start public onboarding (Page 1: Creditor Selection)
      router.push('/creditors');
    }
  }, [router]);

  // Show nothing while redirecting
  return null;
}
