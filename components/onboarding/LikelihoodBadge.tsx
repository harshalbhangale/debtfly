import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { LikelihoodBand } from '@/lib/mock-data/types';

interface LikelihoodBadgeProps {
  likelihood: LikelihoodBand;
}

const likelihoodConfig = {
  low: {
    label: 'Low',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'This debt appears to have strong documentation and may be more difficult to challenge.',
  },
  medium: {
    label: 'Medium',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'This debt may have some gaps in documentation. Further review needed.',
  },
  high: {
    label: 'High',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'This debt may have significant documentation gaps and could be challenged successfully.',
  },
};

export function LikelihoodBadge({ likelihood }: LikelihoodBadgeProps) {
  const config = likelihoodConfig[likelihood];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} cursor-help`}>
            {config.label} Likelihood
            <HelpCircle className="w-3 h-3 ml-1" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{config.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Note:</strong> This is an indicative assessment only and not a guarantee of outcome.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}



