import type { Category, Transaction } from "../../types";
import {
  currentMonthValue,
  filterTransactions,
  formatDayLabel,
  getMonthOptions,
  getMonthRange,
  groupByDay,
  parseMonthValue,
  todayInputValue,
} from "./transactionUtils";

const transaction = (id: string, date: string): Transaction => ({
  id,
  accountId: "a",
  categoryId: "c",
  amount: 100,
  date,
  note: "",
  createdAt: date,
});

describe("getMonthRange", () => {
  it("returns the first day of the month and of the next month", () => {
    expect(getMonthRange(2026, 10)).toEqual({
      from: "2026-11-01",
      to: "2026-12-01",
    });
  });

  it("rolls over to the next year in December", () => {
    expect(getMonthRange(2026, 11)).toEqual({
      from: "2026-12-01",
      to: "2027-01-01",
    });
  });
});

describe("todayInputValue", () => {
  it("uses the local calendar day, even late in the evening", () => {
    expect(todayInputValue(new Date(2026, 10, 24, 23, 59))).toBe("2026-11-24");
  });

  it("pads single digit months and days", () => {
    expect(todayInputValue(new Date(2026, 0, 5, 12))).toBe("2026-01-05");
  });
});

describe("formatDayLabel", () => {
  it.each([
    ["2026-11-24", "2026-11-24", "Today"],
    ["2026-11-23", "2026-11-24", "Yesterday"],
    ["2026-11-30", "2026-12-01", "Yesterday"],
    ["2026-11-03", "2026-11-24", "Nov 3"],
    ["2025-11-03", "2026-11-24", "Nov 3, 2025"],
  ])("labels %s (today is %s) as %s", (day, today, label) => {
    expect(formatDayLabel(day, today)).toBe(label);
  });
});

describe("groupByDay", () => {
  it("groups consecutive transactions of the same day and keeps the order", () => {
    const groups = groupByDay(
      [
        transaction("1", "2026-11-24T00:00:00.000Z"),
        transaction("2", "2026-11-24T00:00:00.000Z"),
        transaction("3", "2026-11-23T00:00:00.000Z"),
      ],
      "2026-11-24",
    );

    expect(groups.map((g) => [g.label, g.items.map((t) => t.id)])).toEqual([
      ["Today", ["1", "2"]],
      ["Yesterday", ["3"]],
    ]);
  });

  it("returns no groups for an empty list", () => {
    expect(groupByDay([], "2026-11-24")).toEqual([]);
  });
});

describe("month helpers", () => {
  it("builds the current month value from the local date", () => {
    expect(currentMonthValue(new Date(2026, 10, 30, 23, 30))).toBe("2026-11");
  });

  it("parses a month value into a year and a zero based month", () => {
    expect(parseMonthValue("2026-11")).toEqual({ year: 2026, month: 10 });
  });

  it("lists the current and previous months, crossing the year boundary", () => {
    const options = getMonthOptions(new Date(2026, 0, 15), 3);

    expect(options.map((o) => o.value)).toEqual([
      "2026-01",
      "2025-12",
      "2025-11",
    ]);
    expect(options[0].label).toBe("Jan 2026");
  });
});

describe("filterTransactions", () => {
  const categories: Category[] = [
    { id: "food", name: "Food", icon: "", color: "", type: "expense" },
    { id: "pay", name: "Salary", icon: "", color: "", type: "income" },
  ];
  const tx = (
    id: string,
    accountId: string,
    categoryId: string,
    date: string,
  ): Transaction => ({
    ...transaction(id, date),
    accountId,
    categoryId,
  });
  const all = [
    tx("1", "a1", "food", "2026-11-24T00:00:00.000Z"),
    tx("2", "a2", "pay", "2026-11-23T00:00:00.000Z"),
    tx("3", "a1", "food", "2026-10-31T00:00:00.000Z"),
  ];
  const none = {
    month: "2026-11",
    accountId: "",
    categoryId: "",
    type: "all",
  } as const;
  const ids = (filters: Parameters<typeof filterTransactions>[2]) =>
    filterTransactions(all, categories, filters).map((t) => t.id);

  it("keeps only the selected month", () => {
    expect(ids(none)).toEqual(["1", "2"]);
  });

  it("filters by account", () => {
    expect(ids({ ...none, accountId: "a2" })).toEqual(["2"]);
  });

  it("filters by category", () => {
    expect(ids({ ...none, categoryId: "food" })).toEqual(["1"]);
  });

  it("filters by type through the category", () => {
    expect(ids({ ...none, type: "income" })).toEqual(["2"]);
    expect(ids({ ...none, type: "expense" })).toEqual(["1"]);
  });

  it("combines the filters", () => {
    expect(ids({ ...none, accountId: "a1", type: "income" })).toEqual([]);
  });
});
