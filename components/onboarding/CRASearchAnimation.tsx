'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Search, FileSearch, CheckCircle2 } from 'lucide-react';

interface CRASearchAnimationProps {
  onComplete: () => void;
  duration?: number; // milliseconds
}

export function CRASearchAnimation({ onComplete, duration = 3000 }: CRASearchAnimationProps) {
  const [stage, setStage] = useState<'searching' | 'analyzing' | 'complete'>('searching');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentTime = 0;
    const interval = 50; // Update every 50ms
    
    const timer = setInterval(() => {
      currentTime += interval;
      const totalProgress = (currentTime / duration) * 100;
      setProgress(Math.min(totalProgress, 100));

      // Update stage based on progress
      if (totalProgress < 40) {
        setStage('searching');
      } else if (totalProgress < 80) {
        setStage('analyzing');
      } else {
        setStage('complete');
      }

      if (currentTime >= duration) {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  const stageConfig = {
    searching: {
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Accessing your credit file...',
    },
    analyzing: {
      icon: FileSearch,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      label: 'Analyzing your agreements...',
    },
    complete: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Search complete!',
    },
  };

  const current = stageConfig[stage];
  const Icon = current.icon;

  return (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Animated Icon */}
        <div className={`w-16 h-16 rounded-full ${current.bgColor} flex items-center justify-center relative`}>
          <Icon className={`w-8 h-8 ${current.color} ${stage !== 'complete' ? 'animate-pulse' : ''}`} />
          {stage !== 'complete' && (
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          )}
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{current.label}</h3>
          <p className="text-sm text-muted-foreground">
            {stage === 'searching' && 'Connecting to credit reference agencies...'}
            {stage === 'analyzing' && 'Identifying finance agreements...'}
            {stage === 'complete' && 'We found your debts!'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Loading Dots */}
        {stage !== 'complete' && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

