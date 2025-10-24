'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface SignatureInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function SignatureInput({
  value,
  onChange,
  label = 'Full Name (Signature)',
  error,
  placeholder = 'Type your full name',
  required = true,
}: SignatureInputProps) {
  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-base font-semibold">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="space-y-2">
        {/* Regular input */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={error ? 'border-destructive' : ''}
        />

        {/* Styled signature preview */}
        {value && (
          <div className="border-2 border-primary/20 rounded-lg p-6 bg-muted/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Signature preview:</p>
              <p 
                className="text-4xl font-signature text-primary"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {value}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          By typing your name above, you are providing a legal electronic signature equivalent to a handwritten signature.
        </p>
      </div>
    </div>
  );
}

// Add this to your globals.css:
// @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

