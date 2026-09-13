import { useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { accountAdded, selectAllAccounts } from "./accountsSlice";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../lib/formatCurrency";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [startingBalance, setStartingBalance] = useState("");

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
          <Field label="Name">
            <Input
              required
              type="text"
              placeholder="e.g. Main Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={nameInputRef}
            />
          </Field>
          <Field label="Currency">
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="PLN">PLN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </Select>
          </Field>
          <Field label="Starting Balance">
            <Input
              required
              type="number"
              placeholder="0.00"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
              onKeyDown={(e) => {
                if (["e", "E", "+"].includes(e.key)) e.preventDefault();
              }}
            />
          </Field>
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

                <div className="flex items-center gap-2.5">
                  <div className="font-medium">{account.name}</div>
                  <div className="rounded-md bg-surface-elevated px-2 py-1 text-sm font-medium text-muted">
                    {account.currency}
                  </div>
                  <div className="ml-auto font-medium tabular-nums">
                    {formatCurrency(account.startingBalance, account.currency)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Accounts;
