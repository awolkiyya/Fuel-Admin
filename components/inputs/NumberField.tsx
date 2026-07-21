"use client";

import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  value: number;
  placeholder?: string;

  min?: number;
  required?: boolean;

  onChange: (value: number) => void;
};

export const NumberField = ({
  label,
  value,
  placeholder,
  min = 0,
  required = false,
  onChange,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Input
        type="number"
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value;

          onChange(val === "" ? 0 : Math.max(min, Number(val)));
        }}
      />
    </div>
  );
};