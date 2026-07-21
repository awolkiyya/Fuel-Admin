import { LucideIcon } from "lucide-react";

export function InfoCell({ icon: Icon, label, value, valueClassName }: {
    icon: LucideIcon; label: string; value: string; valueClassName?: string;
  }) {
    return (
      <div className="rounded-lg border px-3.5 py-3 bg-muted/20">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
          <Icon className="h-3 w-3 shrink-0" />
          {label}
        </div>
        <p className={`text-sm font-semibold break-words leading-snug ${valueClassName ?? ""}`}>{value}</p>
      </div>
    );
  }