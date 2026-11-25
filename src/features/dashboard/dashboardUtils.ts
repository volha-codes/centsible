import type { Category, CategoryTotal, CategoryType } from "../../types";

export interface CategoryShare {
  categoryId: string | null;
  name: string;
  icon: string;
  color: string;
  amount: number;
  share: number;
}

export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return null;

  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;

  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)}%`;
}

export function totalsOfType(
  totals: CategoryTotal[],
  categories: Category[],
  type: CategoryType,
): CategoryTotal[] {
  const ids = new Set(
    categories.filter((c) => c.type === type).map((c) => c.id),
  );

  return totals.filter((t) => ids.has(t.categoryId));
}

export function categoryShares(
  totals: CategoryTotal[],
  categories: Category[],
  limit = 5,
): CategoryShare[] {
  const sum = totals.reduce((acc, t) => acc + t.amount, 0);
  if (sum === 0) return [];

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const share = (amount: number) => (amount / sum) * 100;

  const top: CategoryShare[] = totals
    .slice(0, limit)
    .map(({ categoryId, amount }) => {
      const category = categoryById.get(categoryId);

      return {
        categoryId,
        name: category?.name ?? "Unknown",
        icon: category?.icon ?? "",
        color: category?.color ?? "",
        amount,
        share: share(amount),
      };
    });

  const rest = totals.slice(limit).reduce((acc, t) => acc + t.amount, 0);

  if (rest > 0) {
    top.push({
      categoryId: null,
      name: "Other",
      icon: "",
      color: "",
      amount: rest,
      share: share(rest),
    });
  }

  return top;
}
