"use client";

import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  value?: number;
  placeholder?: string;
  min?: number;

  onChange: (value: number | undefined) => void;
};

export const OptionalNumberInput = ({
  label,
  value,
  placeholder,
  min = 0,
  onChange,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <Input
        type="number"
        min={min}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;

          onChange(
            val === "" ? undefined : Math.max(min, Number(val))
          );
        }}
      />
    </div>
  );
};