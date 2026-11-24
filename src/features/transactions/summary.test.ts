import type { Account, Category, Transaction } from "../../types";
import { summarizeByCurrency } from "./summary";

const accounts: Account[] = [
  { id: "pln", name: "Main", currency: "PLN", startingBalance: 0, balance: 0 },
  { id: "usd", name: "Cash", currency: "USD", startingBalance: 0, balance: 0 },
];
const categories: Category[] = [
  { id: "food", name: "Food", icon: "", color: "", type: "expense" },
  { id: "pay", name: "Salary", icon: "", color: "", type: "income" },
];
const tx = (
  accountId: string,
  categoryId: string,
  amount: number,
): Transaction => ({
  id: `${accountId}-${categoryId}-${amount}`,
  accountId,
  categoryId,
  amount,
  date: "2026-11-24T00:00:00.000Z",
  note: "",
  createdAt: "2026-11-24T00:00:00.000Z",
});

describe("summarizeByCurrency", () => {
  it("adds up income and expenses, and gives the net result", () => {
    const result = summarizeByCurrency(
      [
        tx("pln", "pay", 620000),
        tx("pln", "food", 8400),
        tx("pln", "food", 1400),
      ],
      categories,
      accounts,
    );

    expect(result).toEqual([
      { currency: "PLN", income: 620000, expense: 9800, net: 610200 },
    ]);
  });

  it("keeps currencies apart instead of mixing them", () => {
    const result = summarizeByCurrency(
      [tx("pln", "food", 1000), tx("usd", "food", 500), tx("usd", "pay", 2000)],
      categories,
      accounts,
    );

    expect(result).toEqual([
      { currency: "PLN", income: 0, expense: 1000, net: -1000 },
      { currency: "USD", income: 2000, expense: 500, net: 1500 },
    ]);
  });

  it("gives a negative net when expenses are larger", () => {
    const [summary] = summarizeByCurrency(
      [tx("pln", "pay", 1000), tx("pln", "food", 4000)],
      categories,
      accounts,
    );

    expect(summary.net).toBe(-3000);
  });

  it("skips transactions whose account or category is unknown", () => {
    expect(
      summarizeByCurrency(
        [tx("gone", "food", 100), tx("pln", "gone", 100)],
        categories,
        accounts,
      ),
    ).toEqual([]);
  });

  it("returns nothing for an empty list", () => {
    expect(summarizeByCurrency([], categories, accounts)).toEqual([]);
  });
});
