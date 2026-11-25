import { Link } from "react-router";

import Card from "../../components/ui/Card";
import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import type { Account, Category, Transaction } from "../../types";
import CategoryIcon from "../categories/CategoryIcon";

const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const RecentTransactions = ({
  transactions,
  categories,
  accounts,
  currency,
}: {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  currency: string;
}) => {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const accountById = new Map(accounts.map((a) => [a.id, a]));

  return (
    <Card
      header={
        <div className="flex items-center justify-between gap-2">
          <span>Recent Transactions</span>
          <Link
            to="/transactions"
            className="text-sm font-normal text-primary hover:underline"
          >
            See all →
          </Link>
        </div>
      }
      className="min-w-0"
    >
      {transactions.length === 0 ? (
        <div className="text-sm text-muted">No transactions yet.</div>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {transactions.map((transaction) => {
            const category = categoryById.get(transaction.categoryId);
            const account = accountById.get(transaction.accountId);
            const isIncome = category?.type === "income";
            const details = [
              transaction.note ? category?.name : null,
              account?.name,
              dayFormat.format(new Date(transaction.date)),
            ].filter(Boolean);

            return (
              <li key={transaction.id} className="flex items-center gap-3 py-3">
                <CategoryIcon
                  icon={category?.icon ?? ""}
                  color={category?.color ?? ""}
                />

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {transaction.note || category?.name || "Transaction"}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {details.join(" · ")}
                  </div>
                </div>

                <div
                  className={cn(
                    "font-medium tabular-nums",
                    isIncome ? "text-income" : "text-expense",
                  )}
                >
                  {isIncome
                    ? `+${formatMoney(transaction.amount, currency)}`
                    : formatMoney(-transaction.amount, currency)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default RecentTransactions;
