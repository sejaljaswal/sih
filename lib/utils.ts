import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CLAUDE.md rule #1: money is always BIGINT paise. Format only at the edge.
const paiseFormatters = new Map<string, Intl.NumberFormat>();

export function formatPaise(paise: number, locale: string = "en-IN") {
  let formatter = paiseFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    paiseFormatters.set(locale, formatter);
  }
  return formatter.format(paise / 100);
}
