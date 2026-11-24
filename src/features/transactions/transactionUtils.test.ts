import type { Transaction } from "../../types";
import {
  formatDayLabel,
  getMonthRange,
  groupByDay,
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
