import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  className?: string;
}

export function NextButton({
  onClick,
  disabled = false,
  loading = false,
  label = 'Next step',
  className,
}: NextButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full h-12 text-base font-semibold rounded-full',
        className
      )}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
}



