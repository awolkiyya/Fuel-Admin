import { CheckCircle2, Copy, LucideIcon } from "lucide-react";

export function ContactRow({ icon: Icon, label, onCopy, copied }: {
    icon: LucideIcon; label: string; onCopy: () => void; copied: boolean;
  }) {
    return (
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground min-w-0">
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <button onClick={onCopy} className="p-1 rounded hover:bg-muted transition-colors shrink-0" aria-label="Copy">
          {copied
            ? <CheckCircle2 className="h-3 w-3 text-green-500" />
            : <Copy className="h-3 w-3 text-muted-foreground" />}
        </button>
      </div>
    );
  }