'use client';

interface OnboardingGuardProps {
  children: React.ReactNode;
  currentStep: string;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  // Guard disabled - pass through all children without checks
  return <>{children}</>;
}



