import { Pencil, Trash2 } from "lucide-react";

import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import type { Account, Category, Transaction } from "../../types";
import CategoryIcon from "../categories/CategoryIcon";

const ACTION_CLASSES =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-surface-elevated text-muted transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary";

const TransactionRow = ({
  transaction,
  category,
  account,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  category?: Category;
  account?: Account;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const isIncome = category?.type === "income";
  const currency = account?.currency ?? "";
  const title = transaction.note || category?.name || "Transaction";
  const details = [
    transaction.note ? category?.name : null,
    account?.name,
  ].filter(Boolean);

  return (
    <li
      id={`transaction-${transaction.id}`}
      className="flex items-center gap-3 py-3"
    >
      <CategoryIcon icon={category?.icon ?? ""} color={category?.color ?? ""} />

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{title}</div>
        {details.length > 0 && (
          <div className="truncate text-xs text-muted">
            {details.join(" · ")}
          </div>
        )}
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

      <button
        type="button"
        aria-label={`Edit ${title}`}
        onClick={onEdit}
        className={`${ACTION_CLASSES} hover:text-content`}
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        aria-label={`Delete ${title}`}
        onClick={onDelete}
        className={`${ACTION_CLASSES} hover:text-expense`}
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
};

export default TransactionRow;
