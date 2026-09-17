import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("puts the symbol before the number for USD", () => {
    expect(formatCurrency(3240, "USD")).toBe("$3,240.00");
  });

  it("puts the symbol after the number for PLN", () => {
    expect(formatCurrency(3240, "PLN")).toBe("3,240.00 zł");
  });

  it("puts the symbol before the number for EUR", () => {
    expect(formatCurrency(3240, "EUR")).toBe("€3,240.00");
  });

  it("falls back to the currency code when the symbol is unknown", () => {
    expect(formatCurrency(100, "GBP")).toBe("GBP100.00");
  });

  it("keeps the minus sign for negative amounts", () => {
    expect(formatCurrency(-3240, "EUR")).toBe("€-3,240.00");
  });
});
