import type { RefObject } from "react";

import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import SegmentedControl from "../../components/ui/SegmentedControl";
import Select from "../../components/ui/Select";
import type { Account, Category, CategoryType } from "../../types";
import { TYPE_OPTIONS } from "../categories/categoryOptions";

function TransactionFields({
  type,
  setType,
  amount,
  setAmount,
  amountError,
  accountId,
  setAccountId,
  categoryId,
  setCategoryId,
  date,
  setDate,
  note,
  setNote,
  accounts,
  categories,
  amountInputRef,
}: {
  type: CategoryType;
  setType: (v: CategoryType) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string | null;
  accountId: string;
  setAccountId: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  accounts: Account[];
  categories: Category[];
  amountInputRef?: RefObject<HTMLInputElement | null>;
}) {
  const currency = accounts.find((a) => a.id === accountId)?.currency;
  const typeCategories = categories.filter((c) => c.type === type);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted">Type</span>
        <SegmentedControl
          label="Transaction type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={setType}
        />
      </div>

      <Field label="Amount" error={amountError}>
        <div className="relative">
          <Input
            required
            type="number"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            placeholder="0.00"
            className="pr-16"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            ref={amountInputRef}
          />
          {currency && (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-muted">
              {currency}
            </span>
          )}
        </div>
      </Field>

      <Field label="Account">
        <Select
          required
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.length === 0 && <option value="">No accounts yet</option>}
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.currency})
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Category">
        <Select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {typeCategories.length === 0 && (
            <option value="">No {type} categories yet</option>
          )}
          {typeCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Date">
        <Input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      <Field label="Note">
        <Input
          type="text"
          maxLength={200}
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>
    </>
  );
}

export default TransactionFields;
