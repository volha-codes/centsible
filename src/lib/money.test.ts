import { formatMoney, fromCents, toCents } from "./money";

describe("toCents", () => {
  it.each([
    ["12.5", 1250],
    ["12.50", 1250],
    ["0.1", 10],
    ["0.05", 5],
    ["1234.56", 123456],
    ["3200", 320000],
    ["-5", -500],
    ["0", 0],
  ])("converts %s to %i", (input, cents) => {
    expect(toCents(input)).toBe(cents);
  });

  it("avoids the floating point error of 1.15 * 100", () => {
    expect(1.15 * 100).not.toBe(115);
    expect(toCents("1.15")).toBe(115);
  });
});

describe("fromCents", () => {
  it.each([
    [1250, "12.50"],
    [5, "0.05"],
    [0, "0.00"],
    [123456, "1234.56"],
    [-1250, "-12.50"],
  ])("converts %i cents to %s", (cents, text) => {
    expect(fromCents(cents)).toBe(text);
  });

  it("round-trips with toCents", () => {
    for (let cents = -5000; cents <= 5000; cents++) {
      expect(toCents(fromCents(cents))).toBe(cents);
    }
  });
});

describe("formatMoney", () => {
  it.each([
    [1250, "PLN", "12.50 zł"],
    [123456, "USD", "$1,234.56"],
    [-4300, "EUR", "-€43.00"],
  ])("formats %i %s as %s", (cents, currency, text) => {
    expect(formatMoney(cents, currency)).toBe(text);
  });
});
