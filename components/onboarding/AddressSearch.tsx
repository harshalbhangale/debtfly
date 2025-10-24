'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { fetchAddressesByPostcode, isValidUKPostcode, type MockAddress } from '@/lib/mock-data/addresses';
import { ChevronDown, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddressSearchProps {
  onAddressSelected: (address: MockAddress) => void;
  initialPostcode?: string;
  initialAddress?: MockAddress;
}

export function AddressSearch({ onAddressSelected, initialPostcode, initialAddress }: AddressSearchProps) {
  const [postcode, setPostcode] = useState(initialPostcode || '');
  const [addresses, setAddresses] = useState<MockAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<MockAddress | null>(initialAddress || null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const postcodeRef = useRef<HTMLInputElement>(null);

  const handleFind = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      postcodeRef.current?.focus();
      return;
    }

    if (!isValidUKPostcode(postcode)) {
      setError('Please enter a valid UK postcode');
      postcodeRef.current?.focus();
      return;
    }

    setError('');
    setLoading(true);

    try {
      const results = await fetchAddressesByPostcode(postcode);
      setAddresses(results);
      
      if (results.length === 0) {
        toast.error('No addresses found for this postcode');
      } else {
        setIsOpen(true);
        toast.success(`Found ${results.length} address${results.length > 1 ? 'es' : ''}`);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      toast.error('Failed to fetch addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (address: MockAddress) => {
    setSelectedAddress(address);
    setIsOpen(false);
    onAddressSelected(address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFind();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="postcode" className="text-base font-semibold">
          What&apos;s your current address?
        </Label>
        <p className="text-sm text-muted-foreground">
          Enter your postcode and we&apos;ll find your address
        </p>
      </div>

      {/* Postcode Input + Find Button */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            ref={postcodeRef}
            id="postcode"
            placeholder="e.g. SW1A 1AA"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className={cn(
              'h-12 text-base',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        
        <Button
          onClick={handleFind}
          disabled={loading || !postcode}
          className="h-12 px-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finding...
            </>
          ) : (
            <>
              Find
            </>
          )}
        </Button>
      </div>

      {/* Address Dropdown */}
      {addresses.length > 0 && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium">
              {selectedAddress ? selectedAddress.formatted : 'Select an address'}
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>

          {isOpen && (
            <div className="border-t max-h-60 overflow-y-auto">
              {addresses.map((address, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(address)}
                  className={cn(
                    'w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0',
                    selectedAddress?.formatted === address.formatted && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{address.formatted}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Selected Address Preview */}
      {selectedAddress && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900 mb-1">
                Selected Address
              </p>
              <p className="text-sm text-green-800 whitespace-pre-line">
                {selectedAddress.formatted.replace(/, /g, '\n')}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

