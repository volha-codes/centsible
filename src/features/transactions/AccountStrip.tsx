import { cn } from "../../lib/cn";
import { formatMoney } from "../../lib/money";
import type { Account } from "../../types";

const AccountStrip = ({
  accounts,
  selectedId,
  onSelect,
}: {
  accounts: Account[];
  selectedId: string;
  onSelect: (accountId: string) => void;
}) => {
  return (
    <div role="group" aria-label="Accounts" className="flex flex-wrap gap-2.5">
      {accounts.map((account) => {
        const isSelected = account.id === selectedId;

        return (
          <button
            key={account.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(isSelected ? "" : account.id)}
            className={cn(
              "flex min-w-40 cursor-pointer flex-col items-start gap-0.5 rounded-xl border px-4 py-2.5 text-left transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-surface hover:bg-surface-elevated",
            )}
          >
            <span className="text-xs text-muted">{account.name}</span>
            <span className="font-semibold tabular-nums">
              {formatMoney(account.balance, account.currency)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AccountStrip;
