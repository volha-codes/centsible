import { Pencil, Trash2 } from "lucide-react";

import Popover from "../../components/ui/Popover";
import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import type { Account, Category, Transaction } from "../../types";
import CategoryIcon from "../categories/CategoryIcon";

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

      <Popover>
        {(close) => (
          <>
            <button
              type="button"
              onClick={() => {
                onEdit();
                close();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-content hover:bg-surface"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                close();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-expense hover:bg-surface"
            >
              <Trash2 size={14} /> Delete
            </button>
          </>
        )}
      </Popover>
    </li>
  );
};

export default TransactionRow;
