'use client';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Guard disabled - pass through all children without checks
  return <>{children}</>;
}



