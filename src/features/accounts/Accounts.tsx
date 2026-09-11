import { useState, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { accountAdded, selectAllAccounts } from "./accountsSlice";
import Card from "../../components/ui/Card";

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
          <input
            required
            type="text"
            placeholder="Account Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
          <input
            type="number"
            placeholder="Starting Balance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
          />
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
