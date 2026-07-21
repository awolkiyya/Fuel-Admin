
export function StatCard({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
    return (
      <div className="bg-muted/40 border rounded-xl px-4 py-3.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-xl font-bold ${danger ? "text-red-600" : ""}`}>{value}</p>
      </div>
    );
  }