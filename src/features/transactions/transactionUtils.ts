import type { Category, CategoryType, Transaction } from "../../types";

export interface DayGroup {
  day: string;
  label: string;
  items: Transaction[];
}

export interface TransactionFilters {
  month: string;
  accountId: string;
  categoryId: string;
  type: "all" | CategoryType;
}

const pad = (value: number) => String(value).padStart(2, "0");

export function currentMonthValue(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

export function parseMonthValue(value: string) {
  return {
    year: Number(value.slice(0, 4)),
    month: Number(value.slice(5, 7)) - 1,
  };
}

export function getMonthOptions(now: Date = new Date(), count = 12) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);

    return { value, label };
  });
}

export function filterTransactions(
  transactions: Transaction[],
  categories: Category[],
  filters: TransactionFilters,
): Transaction[] {
  const typeById = new Map(categories.map((c) => [c.id, c.type]));

  return transactions.filter((t) => {
    if (!dayOf(t.date).startsWith(filters.month)) return false;
    if (filters.accountId && t.accountId !== filters.accountId) return false;
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;

    if (filters.type !== "all" && typeById.get(t.categoryId) !== filters.type) {
      return false;
    }

    return true;
  });
}

export function todayInputValue(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function getMonthRange(year: number, month: number) {
  const from = new Date(Date.UTC(year, month, 1));
  const to = new Date(Date.UTC(year, month + 1, 1));

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function dayOf(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function shiftDay(day: string, delta: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + delta);

  return date.toISOString().slice(0, 10);
}

export function formatDayLabel(day: string, today: string): string {
  if (day === today) return "Today";
  if (day === shiftDay(today, -1)) return "Yesterday";

  const sameYear = day.slice(0, 4) === today.slice(0, 4);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
    timeZone: "UTC",
  }).format(new Date(`${day}T00:00:00Z`));
}

export function groupByDay(
  transactions: Transaction[],
  today: string,
): DayGroup[] {
  const groups: DayGroup[] = [];

  for (const transaction of transactions) {
    const day = dayOf(transaction.date);
    const last = groups[groups.length - 1];

    if (last && last.day === day) {
      last.items.push(transaction);
    } else {
      groups.push({
        day,
        label: formatDayLabel(day, today),
        items: [transaction],
      });
    }
  }

  return groups;
}
