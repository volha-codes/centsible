import type { ReactNode } from "react";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-muted">
      {label}
      {children}
      {error && <span className="text-xs text-expense">{error}</span>}
    </label>
  );
}

export default Field;
