import { Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAppDispatch } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { Account } from "../../types";
import AccountFields from "./AccountFields";
import { accountUpdated } from "./accountsSlice";

const EditAccountDialog = ({
  account,
  onClose,
}: {
  account: Account;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(account.name);
  const [currency, setCurrency] = useState(account.currency);
  const [startingBalance, setStartingBalance] = useState(
    account.startingBalance.toString(),
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      accountUpdated({
        id: account.id,
        changes: { name, currency, startingBalance: Number(startingBalance) },
      }),
    );

    onClose();
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
            setName={setName}
            currency={currency}
            setCurrency={setCurrency}
            startingBalance={startingBalance}
            setStartingBalance={setStartingBalance}
          />
          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditAccountDialog;
