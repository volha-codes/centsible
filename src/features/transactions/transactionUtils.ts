import type { Transaction } from "../../types";

export interface DayGroup {
  day: string;
  label: string;
  items: Transaction[];
}

const pad = (value: number) => String(value).padStart(2, "0");

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
