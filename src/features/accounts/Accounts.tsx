import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Popover from "../../components/ui/Popover";
import { formatCurrency } from "../../lib/formatCurrency";
import type { Account } from "../../types";
import { toastShown } from "../ui/uiSlice";
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
    dispatch(toastShown("Account added", "success"));
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

                  <Popover>
                    {(close) => (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountToEdit(account);
                            close();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-content hover:bg-surface"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountToDelete(account);
                            close();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-expense hover:bg-surface"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    )}
                  </Popover>
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
            dispatch(toastShown("Account deleted", "success"));
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
