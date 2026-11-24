import { formatCurrency } from "./formatCurrency";

export function toCents(value: string): number {
  return Math.round(Number(value) * 100);
}

export function fromCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoney(cents: number, currency: string): string {
  return formatCurrency(cents / 100, currency);
}
