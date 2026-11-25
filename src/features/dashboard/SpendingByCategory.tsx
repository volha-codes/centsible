import Card from "../../components/ui/Card";
import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import CategoryIcon from "../categories/CategoryIcon";
import { getCategoryColor } from "../categories/categoryOptions";
import type { CategoryShare } from "./dashboardUtils";

const SpendingByCategory = ({
  shares,
  currency,
  monthLabel,
}: {
  shares: CategoryShare[];
  currency: string;
  monthLabel: string;
}) => {
  return (
    <Card
      header={
        <div className="flex items-center justify-between gap-2">
          <span>Spending by Category</span>
          <span className="text-sm font-normal text-muted">{monthLabel}</span>
        </div>
      }
      className="min-w-0"
    >
      {shares.length === 0 ? (
        <div className="text-sm text-muted">No expenses this month.</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {shares.map((item) => (
            <li
              key={item.categoryId ?? "other"}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <CategoryIcon
                  icon={item.icon}
                  color={item.color}
                  className="h-8 w-8"
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {item.name}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(item.amount, currency)}
                </span>
                <span className="w-10 text-right text-xs text-muted tabular-nums">
                  {Math.round(item.share)}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className={cn(
                    "h-full rounded-full",
                    getCategoryColor(item.color).swatch,
                  )}
                  style={{ width: `${Math.max(item.share, 2)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default SpendingByCategory;
