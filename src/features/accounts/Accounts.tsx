import { useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { accountAdded, selectAllAccounts } from "./accountsSlice";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Field from "../../components/ui/Field";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAllAccounts);
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
          <button type="submit">Add Account</button>
        </form>
      </Card>

      <Card header="Your Accounts" className="flex-1">
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              {account.name} - {account.currency} - {account.startingBalance}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Accounts;
