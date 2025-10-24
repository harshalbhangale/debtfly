import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/lib/calculations/fee';
import type { Debt } from '@/lib/mock-data/types';
import { Building2, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DebtTileProps {
  debt: Debt;
}

export function DebtTile({ debt }: DebtTileProps) {
  // Calculate progress based on stage
  const stageProgress: Record<string, number> = {
    awaiting_signup: 10,
    disclosure_requested: 30,
    temporarily_unenforceable: 50,
    under_review: 70,
    enforceable: 85,
    permanently_unenforceable: 100,
    written_off: 100,
  };

  const progress = stageProgress[debt.stage] || 0;
  const hasDeadline = debt.sla_due_date && new Date(debt.sla_due_date) > new Date();

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">{debt.creditor_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Ref: {debt.account_ref}
                </p>
              </div>
            </div>
            <StatusBadge stage={debt.stage} showIcon={false} />
          </div>

          {/* Balance */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(debt.current_balance)}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Deadline Warning */}
          {hasDeadline && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-amber-900">
                  Action required by {debt.sla_due_date ? format(new Date(debt.sla_due_date), 'dd MMM yyyy') : 'TBD'}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link href={`/debts/${debt.id}`}>
            <Button variant="outline" className="w-full group">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

