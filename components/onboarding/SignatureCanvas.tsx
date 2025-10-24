'use client';

import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string | null) => void;
  initialSignature?: string;
}

export function SignatureCanvas({ onSignatureChange, initialSignature }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    
    if (!parent) return;

    // Set canvas size
    canvas.width = parent.offsetWidth;
    canvas.height = 200;

    const pad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(1, 64, 52)', // Dark teal from our design tokens
    });

    // Load initial signature if provided
    if (initialSignature) {
      try {
        pad.fromDataURL(initialSignature);
        setIsEmpty(false);
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    }

    // Listen to signature changes
    pad.addEventListener('endStroke', () => {
      setIsEmpty(pad.isEmpty());
      onSignatureChange(pad.toDataURL());
    });

    setSignaturePad(pad);

    // Cleanup
    return () => {
      pad.off();
    };
  }, [initialSignature, onSignatureChange]);

  const handleClear = () => {
    if (signaturePad) {
      signaturePad.clear();
      setIsEmpty(true);
      onSignatureChange(null);
    }
  };

  return (
    <div className="space-y-3">
      <Card className={cn(
        'relative overflow-hidden',
        isEmpty && 'border-dashed'
      )}>
        {/* Instructions Overlay */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <p className="text-muted-foreground text-sm">
              Sign here with your mouse or finger
            </p>
          </div>
        )}

        {/* Signature Indicator */}
        {!isEmpty && (
          <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Signed
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
        />
      </Card>

      {/* Clear Button */}
      {!isEmpty && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Signature
        </Button>
      )}
    </div>
  );
}



