import { LucideIcon } from "lucide-react";

export function Panel({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
    return (
      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b bg-muted/30">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        <div className="p-4">{children}</div>
      </div>
    );
  }