import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

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
  createAccount,
  deleteAccount,
  fetchAccounts,
  findDuplicateAccountName,
  selectAccountsError,
  selectAccountsStatus,
  selectAllAccounts,
} from "./accountsSlice";
import EditAccountDialog from "./EditAccountDialog";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);
  const status = useAppSelector(selectAccountsStatus);
  const error = useAppSelector(selectAccountsError);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [startingBalance, setStartingBalance] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "idle") void dispatch(fetchAccounts());
  }, [status, dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (findDuplicateAccountName(accounts, name)) {
      setNameError("An account with this name already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createAccount({
          name,
          currency,
          startingBalance: Number(startingBalance),
        }),
      ).unwrap();

      dispatch(toastShown("Account added", "success"));
      setName("");
      setCurrency("PLN");
      setStartingBalance("");
      nameInputRef.current?.focus();
    } catch {
      dispatch(toastShown("Failed to add account", "error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
  };

  const content = () => {
    if (status === "idle" || status === "loading") {
      return (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-surface-elevated"
            />
          ))}
        </>
      );
    } else if (status === "failed") {
      return (
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm text-expense">
            {error ?? "Failed to load accounts"}
          </span>

          <Button
            variant="secondary"
            onClick={() => void dispatch(fetchAccounts())}
          >
            Retry
          </Button>
        </div>
      );
    } else if (status === "succeeded" && accounts.length === 0) {
      return <div className="text-sm text-muted">No accounts yet.</div>;
    } else {
      return (
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
      );
    }
  };

  return (
    <div className="flex flex-col items-start gap-5 md:flex-row">
      <Card header="Add Account" className="w-full md:w-auto md:min-w-95">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <AccountFields
            name={name}
            setName={handleNameChange}
            nameError={nameError}
            currency={currency}
            setCurrency={setCurrency}
            startingBalance={startingBalance}
            setStartingBalance={setStartingBalance}
            nameInputRef={nameInputRef}
          />
          <Button
            type="submit"
            className="flex w-auto items-center gap-1.5 self-start"
            loading={isSubmitting}
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

            {status === "succeeded" && (
              <span className="text-sm font-normal text-muted">
                {accounts.length}{" "}
                {accounts.length === 1 ? "account" : "accounts"}
              </span>
            )}
          </div>
        }
        className="w-full md:flex-1"
      >
        {content()}
      </Card>

      {accountToDelete && (
        <ConfirmDialog
          onClose={() => setAccountToDelete(null)}
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              await dispatch(deleteAccount(accountToDelete.id)).unwrap();
              dispatch(toastShown("Account deleted", "success"));
            } catch {
              dispatch(toastShown("Failed to delete account", "error"));
            } finally {
              setIsDeleting(false);
              setAccountToDelete(null);
            }
          }}
          title={`Delete "${accountToDelete?.name}"?`}
          description="This will permanently delete this account and all transactions linked to it. This action cannot be undone."
          confirmLabel="Delete Account"
          loading={isDeleting}
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
