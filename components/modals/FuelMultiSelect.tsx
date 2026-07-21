"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, Search, ChevronDown } from "lucide-react";
import { FuelOption } from "./VehicleTypeModal";

type ValueType = string | FuelOption;

type Props = {
  value: ValueType[]; // accepts both (defensive)
  onChange: (val: string[]) => void; // always returns string[]
  options: FuelOption[];
  loading?: boolean;
};

export const FuelMultiSelect = ({
  value,
  onChange,
  options,
  loading,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ---------------- NORMALIZE VALUE ---------------- */
  const normalizedValue = useMemo<string[]>(() => {
    return value.map((v) =>
      typeof v === "string" ? v : v?.id
    ).filter(Boolean);
  }, [value]);

  /* ---------------- OPTION MAP ---------------- */
  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((o) => map.set(o.id, o.label));
    return map;
  }, [options]);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    if (!search) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  /* ---------------- TOGGLE ---------------- */
  const toggle = (id: string) => {
    const exists = normalizedValue.includes(id);

    const updated = exists
      ? normalizedValue.filter((v) => v !== id)
      : [...normalizedValue, id];

    onChange(updated);
  };

  /* ---------------- CLEAN INVALID VALUES ---------------- */
  useEffect(() => {
    if (!options.length) return;

    const validIds = new Set(options.map((o) => o.id));
    const cleaned = normalizedValue.filter((v) => validIds.has(v));

    if (cleaned.length !== normalizedValue.length) {
      onChange(cleaned);
    }
  }, [options]);

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DISPLAY ---------------- */
  const visibleValues = normalizedValue.slice(0, 2);
  const hiddenCount = normalizedValue.length - visibleValues.length;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* ---------------- TRIGGER ---------------- */}
      <div
        onClick={() => setOpen((v) => !v)}
        className="border rounded-md p-2 flex justify-between items-center cursor-pointer bg-white"
      >
        <div className="flex flex-wrap gap-1">
          {normalizedValue.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              Select fuel types...
            </span>
          ) : (
            <>
              {visibleValues.map((id) => {
                const label = optionMap.get(id) ?? id;

                return (
                  <span
                    key={id} // ✅ always string now
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                  >
                    {label}
                  </span>
                );
              })}

              {hiddenCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  +{hiddenCount} more
                </span>
              )}
            </>
          )}
        </div>

        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* ---------------- DROPDOWN ---------------- */}
      {open && (
        <div className="absolute z-50 mt-2 w-full border rounded-md bg-white shadow-lg p-2 space-y-2">
          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
            <Input
              placeholder="Search fuel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-xs text-muted-foreground">
              Loading fuel types...
            </p>
          )}

          {/* OPTIONS */}
          <div className="max-h-48 overflow-auto space-y-1">
            {filtered.map((fuel) => {
              const selected = normalizedValue.includes(fuel.id);

              return (
                <div
                  key={fuel.id}
                  onClick={() => toggle(fuel.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selected ? "bg-orange-50" : ""
                  }`}
                >
                  <span className="text-sm">{fuel.label}</span>

                  {selected && (
                    <Check className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground p-2">
                No results found
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between pt-2 border-t">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-black"
              onClick={() => onChange([])}
            >
              Clear
            </button>

            <button
              type="button"
              className="text-xs text-orange-500"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};