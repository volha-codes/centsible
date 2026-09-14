import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { formatCurrency } from "../../lib/formatCurrency";
import type { Account } from "../../types";
import AccountFields from "./AccountFields";
import {
  accountAdded,
  accountRemoved,
  selectAllAccounts,
} from "./accountsSlice";
import EditAccountDialog from "./EditAccountDialog";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [startingBalance, setStartingBalance] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      accountAdded({
        name,
        currency,
        startingBalance: Number(startingBalance),
      }),
    );
    setName("");
    setCurrency("PLN");
    setStartingBalance("");
    nameInputRef.current?.focus();
  };

  return (
    <div className="flex items-start gap-5">
      <Card header="Add Account" className="min-w-95">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <AccountFields
            name={name}
            setName={setName}
            currency={currency}
            setCurrency={setCurrency}
            startingBalance={startingBalance}
            setStartingBalance={setStartingBalance}
            nameInputRef={nameInputRef}
          />
          <Button
            type="submit"
            className="flex w-auto items-center gap-1.5 self-start"
          >
            <Plus size={16} />
            Add Account
          </Button>
        </form>
      </Card>

      <Card
        header={
          <div className="flex items-center justify-between">
            <span>Your Accounts</span>
            <span className="text-sm font-normal text-muted">
              {accounts.length} accounts
            </span>
          </div>
        }
        className="flex-1"
      >
        {accounts.length === 0 ? (
          <div className="text-sm text-muted">No accounts yet.</div>
        ) : (
          <ul className="flex flex-col gap-3.5">
            {accounts.map((account) => (
              <li key={account.id} className="flex flex-col gap-3.5">
                <hr className="border-border" />

                <div className="flex items-center gap-2.5 py-1.5">
                  <div className="font-medium">{account.name}</div>
                  <div className="rounded-md bg-surface-elevated px-2 py-1 text-sm font-medium text-muted">
                    {account.currency}
                  </div>
                  <div className="ml-auto font-medium tabular-nums">
                    {formatCurrency(account.startingBalance, account.currency)}
                  </div>
                  <button
                    type="button"
                    aria-label="Edit account"
                    onClick={() => setAccountToEdit(account)}
                    className="cursor-pointer rounded-md p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete account"
                    onClick={() => setAccountToDelete(account)}
                    className="cursor-pointer rounded-md p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {accountToDelete && (
        <ConfirmDialog
          onClose={() => setAccountToDelete(null)}
          onConfirm={() => {
            dispatch(accountRemoved(accountToDelete!.id));
            setAccountToDelete(null);
          }}
          title={`Delete "${accountToDelete?.name}"?`}
          description="This will permanently delete this account and all transactions linked to it. This action cannot be undone."
          confirmLabel="Delete Account"
        />
      )}

      {accountToEdit && (
        <EditAccountDialog
          account={accountToEdit}
          onClose={() => setAccountToEdit(null)}
        />
      )}
    </div>
  );
};

export default Accounts;
