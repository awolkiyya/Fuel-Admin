 export function TimelineItem({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
    return (
      <li className={`flex gap-3 ${!isLast ? "pb-4" : ""}`}>
        <div className="flex flex-col items-center pt-1">
          <div className="h-2 w-2 rounded-full bg-border ring-2 ring-background shrink-0" />
          {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
        </div>
        <div className="pb-1 min-w-0">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
          <p className="text-xs font-semibold">{value}</p>
        </div>
      </li>
    );
  }