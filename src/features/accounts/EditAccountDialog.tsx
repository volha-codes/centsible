import { Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { Account } from "../../types";
import { toastShown } from "../ui/uiSlice";
import AccountFields from "./AccountFields";
import {
  findDuplicateAccountName,
  selectAllAccounts,
  updateAccount,
} from "./accountsSlice";

const EditAccountDialog = ({
  account,
  onClose,
}: {
  account: Account;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);

  const [name, setName] = useState(account.name);
  const [currency, setCurrency] = useState(account.currency);
  const [startingBalance, setStartingBalance] = useState(
    account.startingBalance.toString(),
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (findDuplicateAccountName(accounts, name, account.id)) {
      setNameError("An account with this name already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updateAccount({
          id: account.id,
          changes: { name, currency, startingBalance: Number(startingBalance) },
        }),
      ).unwrap();

      dispatch(toastShown("Account updated", "success"));
      onClose();
    } catch {
      dispatch(toastShown("Failed to update account", "error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Pencil className="text-primary" size={22} />
        </div>
        <h2 className="text-lg font-semibold text-content">
          Edit &quot;{account.name}&quot;
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <AccountFields
            name={name}
            setName={handleNameChange}
            currency={currency}
            setCurrency={setCurrency}
            startingBalance={startingBalance}
            setStartingBalance={setStartingBalance}
            nameError={nameError}
          />
          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditAccountDialog;
