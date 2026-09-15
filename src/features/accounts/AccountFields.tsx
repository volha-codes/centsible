import type { RefObject } from "react";

import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

function AccountFields({
  name,
  setName,
  nameError,
  currency,
  setCurrency,
  startingBalance,
  setStartingBalance,
  nameInputRef,
}: {
  name: string;
  setName: (v: string) => void;
  nameError: string | null;
  currency: string;
  setCurrency: (v: string) => void;
  startingBalance: string;
  setStartingBalance: (v: string) => void;
  nameInputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      <Field label="Name" error={nameError}>
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
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
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
    </>
  );
}

export default AccountFields;
