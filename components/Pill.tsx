
export function Pill({ label, cls }: { label: string; cls: string }) {
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${cls}`}>
        {label}
      </span>
    );
  }