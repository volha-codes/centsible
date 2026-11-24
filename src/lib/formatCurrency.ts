const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  PLN: "zł",
};

const SYMBOL_AFTER = new Set(["PLN"]);

export function formatCurrency(amount: number, currency: string): string {
  const number = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const sign = amount < 0 ? "-" : "";

  return SYMBOL_AFTER.has(currency)
    ? `${sign}${number} ${symbol}`
    : `${sign}${symbol}${number}`;
}
