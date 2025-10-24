// Public layout - No authentication required
// Used for Pages 1-8 of the onboarding flow

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

