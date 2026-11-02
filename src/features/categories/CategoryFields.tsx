import type { ReactNode, RefObject } from "react";

import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import SegmentedControl from "../../components/ui/SegmentedControl";
import type { CategoryType } from "../../types";
import { TYPE_OPTIONS } from "./categoryOptions";
import ColorPicker from "./ColorPicker";
import IconPicker from "./IconPicker";

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-muted">{label}</span>
      {children}
    </div>
  );
}

function CategoryFields({
  name,
  setName,
  nameError,
  type,
  setType,
  icon,
  setIcon,
  color,
  setColor,
  nameInputRef,
}: {
  name: string;
  setName: (v: string) => void;
  nameError: string | null;
  type: CategoryType;
  setType: (v: CategoryType) => void;
  icon: string;
  setIcon: (v: string) => void;
  color: string;
  setColor: (v: string) => void;
  nameInputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      <FieldGroup label="Type">
        <SegmentedControl
          label="Type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={setType}
        />
      </FieldGroup>
      <Field label="Name" error={nameError}>
        <Input
          required
          type="text"
          placeholder="e.g. Food & Dining"
          value={name}
          onChange={(e) => setName(e.target.value)}
          ref={nameInputRef}
        />
      </Field>
      <FieldGroup label="Icon">
        <IconPicker value={icon} onChange={setIcon} />
      </FieldGroup>
      <FieldGroup label="Color">
        <ColorPicker value={color} onChange={setColor} />
      </FieldGroup>
    </>
  );
}

export default CategoryFields;
