import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { accountAdded, selectAllAccounts } from "./accountsSlice";

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
    <div>
      <form onSubmit={handleSubmit}>
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

      <div>
        <h2>Accounts</h2>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              {account.name} - {account.currency} - {account.startingBalance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
