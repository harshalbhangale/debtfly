'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Shield, FileText } from 'lucide-react';
import { getCreditorSelection, getCreditorCount, setCurrentPublicStep } from '@/lib/storage/public-onboarding';
import { getCreditorById } from '@/lib/mock-data/creditors';

export default function InfoPage() {
  const router = useRouter();
  const [creditorNames, setCreditorNames] = useState<string[]>([]);
  const [creditorCount, setCreditorCount] = useState(0);

  useEffect(() => {
    const selection = getCreditorSelection();
    if (!selection) {
      // No selection, go back to creditors page
      router.push('/creditors');
      return;
    }

    // Get creditor names
    const names: string[] = [];
    
    // Add selected creditors from database
    selection.selected_creditor_ids.forEach(id => {
      const creditor = getCreditorById(id);
      if (creditor) names.push(creditor.name);
    });

    // Add manually entered creditors
    if (selection.other_creditors) {
      names.push(...selection.other_creditors);
    }

    setCreditorNames(names);
    setCreditorCount(getCreditorCount());
  }, [router]);

  const handleContinue = () => {
    setCurrentPublicStep('contact');
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Great! We&apos;ll help you with these debts
          </h1>
          <p className="text-lg text-muted-foreground">
            You&apos;ve selected {creditorCount} creditor{creditorCount > 1 ? 's' : ''}
          </p>
        </div>

        {/* Creditor List */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Your selected creditors:</h3>
            <div className="space-y-2">
              {creditorNames.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-lg">What happens next</h3>
            <div className="space-y-4">
              <InfoItem
                icon={FileText}
                title="We&apos;ll collect your information"
                description="We need some details about you and your debts to get started"
              />
              <InfoItem
                icon={Shield}
                title="We&apos;ll request documentation"
                description="We'll send requests to your creditors for copies of your agreements"
              />
              <InfoItem
                icon={CheckCircle2}
                title="We&apos;ll review everything"
                description="Our team will analyze the documents for compliance issues"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Estimate */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Estimated time</h4>
                <p className="text-sm text-muted-foreground">
                  This process takes about <strong>5-10 minutes</strong> to complete.
                  <br />
                  You can save your progress and come back anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleContinue}
            className="min-w-[200px]"
          >
            Let&apos;s Start
          </Button>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/creditors')}
          >
            ← Change creditors
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

