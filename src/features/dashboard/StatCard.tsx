import { cn } from "../../lib/cn";
import { formatPercent } from "./dashboardUtils";

const StatCard = ({
  label,
  value,
  valueClassName,
  change,
  goodWhen,
  highlighted = false,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  change: number | null;
  goodWhen: "up" | "down";
  highlighted?: boolean;
}) => {
  const isGood = change !== null && (goodWhen === "up") === change >= 0;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1.5 rounded-2xl border p-5",
        highlighted
          ? "border-primary/40 bg-linear-to-br from-primary/25 to-surface"
          : "border-border bg-surface",
      )}
    >
      <span className="text-xs text-muted">{label}</span>
      <span
        className={cn(
          "truncate text-2xl font-semibold tabular-nums md:text-3xl",
          valueClassName,
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted">
        {change === null ? (
          "No data for last month"
        ) : (
          <>
            <span className={isGood ? "text-income" : "text-expense"}>
              {formatPercent(change)}
            </span>{" "}
            vs last month
          </>
        )}
      </span>
    </div>
  );
};

export default StatCard;
