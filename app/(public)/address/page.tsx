'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Home, AlertCircle } from 'lucide-react';
import { AddressSearch } from '@/components/onboarding/AddressSearch';
import { saveAddressHistory, getAddressHistory, getDateOfBirth } from '@/lib/storage/public-onboarding';
import type { Address, AddressHistory } from '@/lib/types/flow';
import type { MockAddress } from '@/lib/mock-data/addresses';
import { toast } from 'sonner';

export default function AddressPage() {
  const router = useRouter();
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [lived3Years, setLived3Years] = useState(true);
  const [needsPreviousAddress, setNeedsPreviousAddress] = useState(false);
  const [previousAddress, setPreviousAddress] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if previous steps completed
  useEffect(() => {
    const dob = getDateOfBirth();
    if (!dob) {
      router.push('/dob');
      return;
    }

    // Load saved data
    const saved = getAddressHistory();
    if (saved) {
      setCurrentAddress(saved.current_address);
      setLived3Years(saved.current_address.lived_3_years);
      setNeedsPreviousAddress(!saved.current_address.lived_3_years);
      if (saved.previous_address) {
        setPreviousAddress(saved.previous_address);
      }
    }
  }, [router]);

  const handleCurrentAddressSelected = (address: MockAddress) => {
    const formattedAddress: Address = {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      postcode: address.postcode,
      lived_3_years: lived3Years,
    };
    setCurrentAddress(formattedAddress);
    if (errors.current) setErrors(prev => ({ ...prev, current: '' }));
  };

  const handlePreviousAddressSelected = (address: MockAddress) => {
    const formattedAddress: Address = {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      postcode: address.postcode,
      lived_3_years: true, // Assuming previous address was lived in
    };
    setPreviousAddress(formattedAddress);
    if (errors.previous) setErrors(prev => ({ ...prev, previous: '' }));
  };

  const handleLived3YearsChange = (checked: boolean) => {
    setLived3Years(checked);
    setNeedsPreviousAddress(!checked);
    
    // Update current address with new value
    if (currentAddress) {
      setCurrentAddress({
        ...currentAddress,
        lived_3_years: checked,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentAddress) {
      newErrors.current = 'Please select your current address';
    }

    if (needsPreviousAddress && !previousAddress) {
      newErrors.previous = 'Please select your previous address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please complete all required address information');
      return;
    }

    const addressHistory: AddressHistory = {
      current_address: currentAddress!,
      previous_address: needsPreviousAddress ? previousAddress! : undefined,
    };

    saveAddressHistory(addressHistory);
    toast.success('Address information saved');
    router.push('/debt-details');
  };

  const handleBack = () => {
    router.push('/dob');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step 5 of 8</span>
            <span>62% complete</span>
          </div>
          <Progress value={62} className="h-2" />
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

        {/* Current Address */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  What&apos;s your current address?
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base">
              We need your address to match records with your creditors
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Address Search */}
            <AddressSearch
              onAddressSelected={handleCurrentAddressSelected}
              initialPostcode={currentAddress?.postcode}
              initialAddress={currentAddress ? {
                line1: currentAddress.line1,
                line2: currentAddress.line2,
                city: currentAddress.city,
                postcode: currentAddress.postcode,
                formatted: `${currentAddress.line1}${currentAddress.line2 ? ', ' + currentAddress.line2 : ''}, ${currentAddress.city}, ${currentAddress.postcode}`,
              } : undefined}
            />
            {errors.current && (
              <p className="text-sm text-destructive">{errors.current}</p>
            )}

            {/* Lived 3 Years Checkbox */}
            {currentAddress && (
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox
                  id="lived_3_years"
                  checked={lived3Years}
                  onCheckedChange={handleLived3YearsChange}
                />
                <div className="flex-1">
                  <Label
                    htmlFor="lived_3_years"
                    className="cursor-pointer font-medium"
                  >
                    I&apos;ve lived at this address for 3 years or more
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    If you&apos;ve lived here for less than 3 years, we&apos;ll need your previous address
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Address (Conditional) */}
        {needsPreviousAddress && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Previous Address</CardTitle>
              <CardDescription>
                Please provide your previous address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm text-amber-900">
                  We need your address history for the past 3 years to verify your identity
                </div>
              </div>

              <AddressSearch
                onAddressSelected={handlePreviousAddressSelected}
                initialPostcode={previousAddress?.postcode}
                initialAddress={previousAddress ? {
                  line1: previousAddress.line1,
                  line2: previousAddress.line2,
                  city: previousAddress.city,
                  postcode: previousAddress.postcode,
                  formatted: `${previousAddress.line1}${previousAddress.line2 ? ', ' + previousAddress.line2 : ''}, ${previousAddress.city}, ${previousAddress.postcode}`,
                } : undefined}
              />
              {errors.previous && (
                <p className="text-sm text-destructive">{errors.previous}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="min-w-[200px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

