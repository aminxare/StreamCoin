import { Coin } from "@/type";

export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (compact && value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (compact && value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;

  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (compact && value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (compact && value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return new Intl.NumberFormat("en-US").format(value);
}
