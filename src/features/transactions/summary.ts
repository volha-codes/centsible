import type { Account, Category, Transaction } from "../../types";

export interface CurrencySummary {
  currency: string;
  income: number;
  expense: number;
  net: number;
}

export function summarizeByCurrency(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[],
): CurrencySummary[] {
  const typeByCategory = new Map(categories.map((c) => [c.id, c.type]));
  const currencyByAccount = new Map(accounts.map((a) => [a.id, a.currency]));
  const totals = new Map<string, { income: number; expense: number }>();

  for (const transaction of transactions) {
    const type = typeByCategory.get(transaction.categoryId);
    const currency = currencyByAccount.get(transaction.accountId);
    if (!type || !currency) continue;

    const total = totals.get(currency) ?? { income: 0, expense: 0 };

    if (type === "income") {
      total.income += transaction.amount;
    } else {
      total.expense += transaction.amount;
    }

    totals.set(currency, total);
  }

  return [...totals.entries()]
    .map(([currency, { income, expense }]) => ({
      currency,
      income,
      expense,
      net: income - expense,
    }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
}
