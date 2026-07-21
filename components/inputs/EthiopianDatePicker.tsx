"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDownIcon,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  ETH_MONTHS,
  gregorianToEth,
} from "@/utils/ethiopianCalendar";

import { generateEthCalendar } from "@/utils/generateEthCalendar";
import { formatEthiopianDate } from "@/lib/utils";

interface Props {
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  yearMode?: "FULL" | "LIMITED";
}

export function EthiopianDatePicker({
  value,
  onChange,
  error,
  placeholder = "ቀን ይምረጡ",
  disabled = false,
  searchable = false,
  yearMode = "FULL",
}: Props) {
  const today = new Date();
  const ethToday = gregorianToEth(today);

  const currentYear = ethToday.year;
  const previousYear = currentYear - 1;

  const isLimited = yearMode === "LIMITED";

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(ethToday.month);
  const [selected, setSelected] = useState<Date | undefined>(value);
  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | SYNC VALUE
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setSelected(value);

    if (value) {
      const eth = gregorianToEth(value);
      setYear(eth.year);
      setMonth(eth.month);
    }
  }, [value]);

  /*
  |--------------------------------------------------------------------------
  | TODAY CHECK (UI ONLY)
  |--------------------------------------------------------------------------
  */
  const isToday = (date: Date) =>
    date.toDateString() === today.toDateString();

  const isSameDay = (a?: Date, b?: Date) =>
    a && b && a.toDateString() === b.toDateString();

  /*
  |--------------------------------------------------------------------------
  | RULE ENGINE
  |--------------------------------------------------------------------------
  */
  const isYearAllowed = (y: number) => {
    if (!isLimited) return true;
    return y === currentYear || y === previousYear;
  };

  const isMonthAllowed = (y: number, m: number) => {
    if (!isLimited) return true;

    if (y === currentYear) return m >= 1 && m <= 10;
    if (y === previousYear) return m >= 11 && m <= 13;

    return false;
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */
  const nextMonth = () => {
    let nm = month + 1;
    let ny = year;

    if (nm > 13) {
      nm = 1;
      ny++;
    }

    if (!isYearAllowed(ny) || !isMonthAllowed(ny, nm)) return;

    setYear(ny);
    setMonth(nm);
  };

  const prevMonth = () => {
    let pm = month - 1;
    let py = year;

    if (pm < 1) {
      pm = 13;
      py--;
    }

    if (!isYearAllowed(py) || !isMonthAllowed(py, pm)) return;

    setYear(py);
    setMonth(pm);
  };

  /*
  |--------------------------------------------------------------------------
  | CALENDAR DATA
  |--------------------------------------------------------------------------
  */
  const days = useMemo(
    () => generateEthCalendar(year, month),
    [year, month]
  );

  const filteredDays = useMemo(() => {
    if (!searchable || !search.trim()) return days;

    const lower = search.toLowerCase();

    return days.filter(
      (d) =>
        d &&
        (d.day.toString().includes(lower) ||
          ETH_MONTHS[d.month - 1].toLowerCase().includes(lower) ||
          d.year.toString().includes(lower))
    );
  }, [days, search, searchable]);

  /*
  |--------------------------------------------------------------------------
  | SELECT DATE
  |--------------------------------------------------------------------------
  */
  const handleSelect = (date: Date) => {
    const eth = gregorianToEth(date);

    if (!isMonthAllowed(eth.year, eth.month)) return;

    setSelected(date);
    onChange?.(date);
    setOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | YEAR OPTIONS
  |--------------------------------------------------------------------------
  */
  const yearOptions = useMemo(() => {
    if (!isLimited) {
      return Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);
    }
    return [previousYear, currentYear];
  }, [isLimited, currentYear, previousYear]);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */
  return (
    <div className="w-full space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-between rounded-sm border px-4 text-left",
              error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className={cn(!selected && "text-muted-foreground")}>
                {selected
                  ? formatEthiopianDate(selected.toDateString())
                  : placeholder}
              </span>
            </div>

            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[340px] p-4 rounded-sm border bg-popover shadow-xl">
          {searchable && (
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3"
            />
          )}

          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft />
            </Button>

            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border rounded-sm px-2 py-1"
              >
                {ETH_MONTHS.map((m, i) => (
                  <option
                    key={i}
                    value={i + 1}
                    disabled={!isMonthAllowed(year, i + 1)}
                  >
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  if (!isYearAllowed(y)) return;
                  setYear(y);
                }}
                className="border rounded-sm px-2 py-1"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y} ዓ.ም
                  </option>
                ))}
              </select>
            </div>

            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight />
            </Button>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-1">
            {filteredDays.map((d, i) =>
              d ? (
                <button
                  key={i}
                  onClick={() => handleSelect(d.gregorian)}
                  disabled={!isMonthAllowed(d.year, d.month)}
                  className={cn(
                    "h-10 w-10 rounded-xl text-sm transition",
                    "hover:bg-accent",

                    isSameDay(selected, d.gregorian) &&
                      "bg-primary text-white",

                    isToday(d.gregorian) &&
                      "border border-primary",

                    !isMonthAllowed(d.year, d.month) &&
                      "opacity-30 pointer-events-none"
                  )}
                >
                  {d.day}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}