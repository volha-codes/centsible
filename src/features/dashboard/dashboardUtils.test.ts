import type { Category } from "../../types";
import {
  categoryShares,
  formatPercent,
  percentChange,
  totalsOfType,
} from "./dashboardUtils";

const categories: Category[] = [
  { id: "rent", name: "Rent", icon: "house", color: "teal", type: "expense" },
  { id: "food", name: "Food", icon: "coffee", color: "red", type: "expense" },
  { id: "fun", name: "Fun", icon: "gift", color: "pink", type: "expense" },
];

describe("percentChange", () => {
  it("compares with the previous value", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
  });

  it("has nothing to compare with when the previous value is zero", () => {
    expect(percentChange(100, 0)).toBeNull();
  });

  it("measures a negative balance against its size", () => {
    expect(percentChange(-50, -100)).toBe(50);
  });
});

describe("formatPercent", () => {
  it("shows one decimal and an explicit plus", () => {
    expect(formatPercent(4.24)).toBe("+4.2%");
    expect(formatPercent(-12)).toBe("-12.0%");
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("totalsOfType", () => {
  it("keeps only the categories of one type", () => {
    const withIncome: Category[] = [
      ...categories,
      { id: "pay", name: "Pay", icon: "", color: "lime", type: "income" },
    ];
    const totals = [
      { categoryId: "pay", amount: 900 },
      { categoryId: "rent", amount: 600 },
    ];

    expect(totalsOfType(totals, withIncome, "income")).toEqual([
      { categoryId: "pay", amount: 900 },
    ]);
    expect(totalsOfType(totals, withIncome, "expense")).toEqual([
      { categoryId: "rent", amount: 600 },
    ]);
  });
});

describe("categoryShares", () => {
  const totals = [
    { categoryId: "rent", amount: 600 },
    { categoryId: "food", amount: 300 },
    { categoryId: "fun", amount: 100 },
  ];

  it("returns nothing when there is no spending", () => {
    expect(categoryShares([], categories)).toEqual([]);
  });

  it("adds names and shares of the total", () => {
    const [first] = categoryShares(totals, categories);

    expect(first).toMatchObject({ name: "Rent", icon: "house", share: 60 });
  });

  it("groups everything past the limit into Other", () => {
    const shares = categoryShares(totals, categories, 2);

    expect(shares.map((s) => s.name)).toEqual(["Rent", "Food", "Other"]);
    expect(shares[2]).toMatchObject({ categoryId: null, amount: 100 });
  });
});
