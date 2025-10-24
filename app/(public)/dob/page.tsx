'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar } from 'lucide-react';
import { saveDateOfBirth, getDateOfBirth, getContactInfo } from '@/lib/storage/public-onboarding';
import type { DateOfBirth } from '@/lib/types/flow';
import { toast } from 'sonner';

export default function DOBPage() {
  const router = useRouter();
  const [dob, setDob] = useState<DateOfBirth>({
    day: '',
    month: '',
    year: '',
  });
  const [error, setError] = useState('');

  // Refs for auto-focus
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Check if previous steps completed
  useEffect(() => {
    const contact = getContactInfo();
    if (!contact) {
      router.push('/contact');
      return;
    }

    // Load saved data
    const saved = getDateOfBirth();
    if (saved) {
      setDob(saved);
    }
  }, [router]);

  const isValidDate = (day: string, month: string, year: string): boolean => {
    if (!day || !month || !year) return false;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    if (y < 1900 || y > new Date().getFullYear()) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    
    // Check if date exists
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  };

  const isAtLeast18 = (day: string, month: string, year: string): boolean => {
    if (!isValidDate(day, month, year)) return false;
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const validateDOB = (): boolean => {
    if (!dob.day || !dob.month || !dob.year) {
      setError('Please enter your complete date of birth');
      return false;
    }

    if (!isValidDate(dob.day, dob.month, dob.year)) {
      setError('Please enter a valid date');
      return false;
    }

    if (!isAtLeast18(dob.day, dob.month, dob.year)) {
      setError('You must be at least 18 years old to use this service');
      return false;
    }

    return true;
  };

  const handleDobChange = (field: keyof DateOfBirth, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const maxLength = field === 'year' ? 4 : 2;
    const trimmedValue = numericValue.slice(0, maxLength);

    setDob(prev => ({ ...prev, [field]: trimmedValue }));
    if (error) setError('');

    // Auto-focus logic
    if (field === 'day' && trimmedValue.length === 2) {
      monthRef.current?.focus();
    } else if (field === 'month' && trimmedValue.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof DateOfBirth) => {
    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement;
      if (target.value === '') {
        if (field === 'month') dayRef.current?.focus();
        if (field === 'year') monthRef.current?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDOB()) {
      toast.error(error || 'Please check your date of birth');
      return;
    }

    // Save and continue
    saveDateOfBirth(dob);
    toast.success('Date of birth saved');
    router.push('/address');
  };

  const handleBack = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step 4 of 8</span>
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

        {/* Form Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  What&apos;s your date of birth?
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base">
              We need this to verify your identity and ensure you&apos;re eligible for our services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DOB Inputs */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Input
                      ref={dayRef}
                      placeholder="DD"
                      value={dob.day}
                      onChange={(e) => handleDobChange('day', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'day')}
                      maxLength={2}
                      inputMode="numeric"
                      className={`text-center text-lg ${error ? 'border-destructive' : ''}`}
                    />
                    <p className="text-xs text-center text-muted-foreground">Day</p>
                  </div>

                  <div className="space-y-2">
                    <Input
                      ref={monthRef}
                      placeholder="MM"
                      value={dob.month}
                      onChange={(e) => handleDobChange('month', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'month')}
                      maxLength={2}
                      inputMode="numeric"
                      className={`text-center text-lg ${error ? 'border-destructive' : ''}`}
                    />
                    <p className="text-xs text-center text-muted-foreground">Month</p>
                  </div>

                  <div className="space-y-2">
                    <Input
                      ref={yearRef}
                      placeholder="YYYY"
                      value={dob.year}
                      onChange={(e) => handleDobChange('year', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'year')}
                      maxLength={4}
                      inputMode="numeric"
                      className={`text-center text-lg ${error ? 'border-destructive' : ''}`}
                    />
                    <p className="text-xs text-center text-muted-foreground">Year</p>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-muted/50 border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Why we need this:</strong> We need to verify you&apos;re over 18 and
                  match your identity with creditor records. Your personal information is
                  protected and handled securely.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

