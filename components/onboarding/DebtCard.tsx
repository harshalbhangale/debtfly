import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/fee';
import type { Debt } from '@/lib/mock-data/types';
import { cn } from '@/lib/utils';

interface DebtCardProps {
  debt: Debt;
  onEdit?: (debt: Debt) => void;
  onDelete?: (debt: Debt) => void;
  showActions?: boolean;
}

export function DebtCard({ debt, onEdit, onDelete, showActions = true }: DebtCardProps) {
  const statusColors = {
    active: 'bg-blue-100 text-blue-800 border-blue-300',
    default: 'bg-red-100 text-red-800 border-red-300',
    settled: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Creditor Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{debt.creditor_name}</h3>
            <p className="text-sm text-muted-foreground">
              Account: {debt.account_ref}
            </p>
            <p className="text-2xl font-bold text-primary mt-2">
              {formatCurrency(debt.current_balance)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn('capitalize', statusColors[debt.status])}
        >
          {debt.status}
        </Badge>
      </div>

      {/* Additional Info */}
      {debt.date_opened && (
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          Opened: {new Date(debt.date_opened).toLocaleDateString('en-GB')}
        </div>
      )}

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(debt)}
              className="flex-1"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(debt)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}



