import type { ReactNode } from "react";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-muted">
      {label}
      {children}
      {error ? (
        <span className="text-xs text-expense">{error}</span>
      ) : (
        hint && <span className="text-xs text-muted">{hint}</span>
      )}
    </label>
  );
}

export default Field;
