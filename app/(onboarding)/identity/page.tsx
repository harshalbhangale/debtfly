'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { NextButton } from '@/components/onboarding/NextButton';
import { AddressSearch } from '@/components/onboarding/AddressSearch';
import { saveOnboardingStep, getOnboardingStep } from '@/lib/storage/onboarding';
import { OnboardingGuard } from '@/components/guards/OnboardingGuard';
import type { MockAddress } from '@/lib/mock-data/addresses';
import { toast } from 'sonner';

export default function IdentityPage() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [currentAddress, setCurrentAddress] = useState<MockAddress | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for DOB auto-focus
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = getOnboardingStep('identity');
    if (saved) {
      setFirstName(saved.firstName || '');
      setLastName(saved.lastName || '');
      setEmail(saved.email || '');
      setPhone(saved.phone || '');
      setDob(saved.dob || { day: '', month: '', year: '' });
      if (saved.currentAddress) {
        setCurrentAddress(saved.currentAddress);
      }
    }
  }, []);

  const isValidDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return false;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    if (y < 1900 || y > 2100) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  };

  const isAtLeast18 = (day: string, month: string, year: string) => {
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]{10,}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!dob.day || !dob.month || !dob.year) {
      newErrors.dob = 'Date of birth is required';
    } else if (!isValidDate(dob.day, dob.month, dob.year)) {
      newErrors.dob = 'Please enter a valid date';
    } else if (!isAtLeast18(dob.day, dob.month, dob.year)) {
      newErrors.dob = 'You must be at least 18 years old';
    }

    if (!currentAddress) {
      newErrors.address = 'Please select your address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob,
      currentAddress: currentAddress!,
    };

    saveOnboardingStep('identity', data);
    toast.success('Identity information saved');
    router.push('/signature');
  };

  const handleDobChange = (field: 'day' | 'month' | 'year', value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const maxLength = field === 'year' ? 4 : 2;
    const trimmedValue = numericValue.slice(0, maxLength);

    setDob(prev => ({ ...prev, [field]: trimmedValue }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));

    // Auto-focus logic
    if (field === 'day' && trimmedValue.length === 2) {
      monthRef.current?.focus();
    } else if (field === 'month' && trimmedValue.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'day' | 'month' | 'year') => {
    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement;
      if (target.value === '') {
        if (field === 'month') dayRef.current?.focus();
        if (field === 'year') monthRef.current?.focus();
      }
    }
  };

  return (
    <OnboardingGuard currentStep="identity">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-2xl space-y-6">
          <ProgressBar currentStep={2} totalSteps={7} />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Let&apos;s verify your identity</CardTitle>
              <CardDescription className="text-base">
                We need these details to find your finance agreements
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                    }}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Date of Birth *</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    ref={dayRef}
                    placeholder="DD"
                    value={dob.day}
                    onChange={(e) => handleDobChange('day', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'day')}
                    maxLength={2}
                    inputMode="numeric"
                    className={errors.dob ? 'border-red-500' : ''}
                  />
                  <Input
                    ref={monthRef}
                    placeholder="MM"
                    value={dob.month}
                    onChange={(e) => handleDobChange('month', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'month')}
                    maxLength={2}
                    inputMode="numeric"
                    className={errors.dob ? 'border-red-500' : ''}
                  />
                  <Input
                    ref={yearRef}
                    placeholder="YYYY"
                    value={dob.year}
                    onChange={(e) => handleDobChange('year', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'year')}
                    maxLength={4}
                    inputMode="numeric"
                    className={errors.dob ? 'border-red-500' : ''}
                  />
                </div>
                {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Address Search */}
              <div>
                <AddressSearch
                  onAddressSelected={(address) => {
                    setCurrentAddress(address);
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  initialPostcode={currentAddress?.postcode}
                  initialAddress={currentAddress || undefined}
                />
                {errors.address && <p className="text-sm text-red-500 mt-2">{errors.address}</p>}
              </div>

              <NextButton onClick={handleNext} />
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingGuard>
  );
}

