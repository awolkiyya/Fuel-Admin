import { formatEthiopianDate } from "@/lib/utils";
import { gregorianToEth, ETH_MONTHS } from "./ethiopianCalendar"

export function formatEth(date: Date) {
  const { year, month, day } = gregorianToEth(date)
  return `${day} ${ETH_MONTHS[month - 1]} ${year}`
}
// ✅ Helpers
export const parseDate = (value?: string) => (value ? new Date(value) : undefined);

// safer for backend (date-only apps)
export const toDateOnlyISO = (date: Date) =>
  date.toISOString().split("T")[0];

export function formatErrorDateMessage(message: string) {
    // Example: match dates like 2026-05-09 00:00:00
    return message.replace(
      /\d{4}-\d{2}-\d{2}/g,
      (match) => formatEthiopianDate(match) // convert each date to Ethiopian
    );
  }

 export const toDateOnly = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };