import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import type { CurrencySummary } from "./summary";

const Value = ({
  cents,
  currency,
  className,
}: {
  cents: number;
  currency: string;
  className: string;
}) => {
  return (
    <div
      className={cn(
        "text-sm font-semibold whitespace-nowrap tabular-nums md:text-base",
        cents === 0 ? "text-muted" : className,
      )}
    >
      {formatMoney(cents, currency)}
    </div>
  );
};

const MonthSummary = ({
  monthLabel,
  summaries,
}: {
  monthLabel: string;
  summaries: CurrencySummary[];
}) => {
  const showCurrency = summaries.length > 1;

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface px-4 py-4 md:px-5">
      <div className="text-xs font-medium text-muted">{monthLabel}</div>

      {summaries.length === 0 ? (
        <div className="text-sm text-muted">No activity this month.</div>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div
            className={cn(
              "grid w-max min-w-full items-center gap-x-5 gap-y-1.5",
              showCurrency
                ? "grid-cols-[auto_repeat(3,minmax(max-content,1fr))]"
                : "grid-cols-[repeat(3,minmax(max-content,1fr))]",
            )}
          >
            {showCurrency && <span />}
            <span className="text-xs text-muted">Income</span>
            <span className="text-xs text-muted">Expenses</span>
            <span className="text-xs text-muted">Net</span>

            {summaries.map((summary) => (
              <div key={summary.currency} className="contents">
                {showCurrency && (
                  <span className="w-fit rounded-md bg-surface-elevated px-2 py-0.5 text-xs font-medium text-muted">
                    {summary.currency}
                  </span>
                )}
                <Value
                  cents={summary.income}
                  currency={summary.currency}
                  className="text-income"
                />
                <Value
                  cents={-summary.expense}
                  currency={summary.currency}
                  className="text-expense"
                />
                <Value
                  cents={summary.net}
                  currency={summary.currency}
                  className={summary.net < 0 ? "text-expense" : "text-income"}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthSummary;
