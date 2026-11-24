import { Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { fromCents, toCents } from "../../lib/money";
import type { CategoryType, Transaction } from "../../types";
import { selectAllAccounts } from "../accounts/accountsSlice";
import { selectAllCategories } from "../categories/categoriesSlice";
import { toastShown } from "../ui/uiSlice";
import TransactionFields from "./TransactionFields";
import { updateTransaction } from "./transactionsSlice";
import { dayOf } from "./transactionUtils";

const MAX_AMOUNT_CENTS = 2_000_000_000;

const EditTransactionDialog = ({
  transaction,
  onClose,
  onUpdated,
}: {
  transaction: Transaction;
  onClose: () => void;
  onUpdated?: (month: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);
  const categories = useAppSelector(selectAllCategories);

  const [type, setType] = useState<CategoryType>(
    categories.find((c) => c.id === transaction.categoryId)?.type ?? "expense",
  );
  const [amount, setAmount] = useState(fromCents(transaction.amount));
  const [amountError, setAmountError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState(transaction.accountId);
  const [categoryId, setCategoryId] = useState(transaction.categoryId);
  const [date, setDate] = useState(dayOf(transaction.date));
  const [note, setNote] = useState(transaction.note);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeCategories = categories.filter((c) => c.type === type);
  const selectedAccountId = accounts.some((a) => a.id === accountId)
    ? accountId
    : (accounts[0]?.id ?? "");
  const selectedCategoryId = typeCategories.some((c) => c.id === categoryId)
    ? categoryId
    : (typeCategories[0]?.id ?? "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cents = toCents(amount);

    if (!(cents > 0)) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }

    if (cents > MAX_AMOUNT_CENTS) {
      setAmountError("This amount is too large.");
      return;
    }

    if (!selectedAccountId || !selectedCategoryId) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateTransaction({
          id: transaction.id,
          changes: {
            accountId: selectedAccountId,
            categoryId: selectedCategoryId,
            amount: cents,
            date,
            note: note.trim(),
          },
        }),
      ).unwrap();

      dispatch(toastShown("Transaction updated", "success"));
      onUpdated?.(date.slice(0, 7));
      onClose();
    } catch {
      dispatch(toastShown("Failed to update the transaction", "error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountError(null);
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Pencil className="text-primary" size={22} />
        </div>
        <h2 className="text-lg font-semibold text-content">Edit transaction</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <TransactionFields
            type={type}
            setType={setType}
            amount={amount}
            setAmount={handleAmountChange}
            amountError={amountError}
            accountId={selectedAccountId}
            setAccountId={setAccountId}
            categoryId={selectedCategoryId}
            setCategoryId={setCategoryId}
            date={date}
            setDate={setDate}
            note={note}
            setNote={setNote}
            accounts={accounts}
            categories={categories}
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

export default EditTransactionDialog;
