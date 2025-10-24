'use client';

import { Header } from '@/components/dashboard/Header';
import { AuthGuard } from '@/components/guards/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}



