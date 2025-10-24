import { Badge } from "@/components/ui/badge";
import { stageColors } from "@/lib/design-tokens";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Archive,
  User,
} from "lucide-react";

type DebtStage =
  | "awaiting_signup"
  | "disclosure_requested"
  | "temporarily_unenforceable"
  | "under_review"
  | "enforceable"
  | "permanently_unenforceable"
  | "written_off";

interface StatusBadgeProps {
  stage: DebtStage;
  showIcon?: boolean;
  className?: string;
}

const stageIcons: Record<DebtStage, React.ComponentType<{ className?: string }>> = {
  awaiting_signup: User,
  disclosure_requested: FileText,
  temporarily_unenforceable: Clock,
  under_review: AlertTriangle,
  enforceable: XCircle,
  permanently_unenforceable: CheckCircle2,
  written_off: Archive,
};

export function StatusBadge({ stage, showIcon = true, className }: StatusBadgeProps) {
  const colors = stageColors[stage];
  const Icon = stageIcons[stage];

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        borderWidth: "1px",
      }}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {colors.label}
    </Badge>
  );
}



