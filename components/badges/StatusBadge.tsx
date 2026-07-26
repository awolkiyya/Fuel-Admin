import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export type BusinessLicenseStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "EXPIRED";

export function StatusBadge({
  status,
}: {
  status: BusinessLicenseStatus;
}) {
  const variantMap: Record<
    BusinessLicenseStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "secondary",
    ACTIVE: "default",
    REJECTED: "destructive",
    EXPIRED: "outline",
  };

  const iconMap: Record<
    BusinessLicenseStatus,
    React.ReactNode
  > = {
    PENDING: <Clock className="h-3 w-3" />,
    ACTIVE: <CheckCircle className="h-3 w-3" />,
    REJECTED: <XCircle className="h-3 w-3" />,
    EXPIRED: <AlertTriangle className="h-3 w-3" />,
  };

  return (
    <Badge
      variant={variantMap[status]}
      className="flex w-fit items-center gap-1"
    >
      {iconMap[status]}
      {status}
    </Badge>
  );
}