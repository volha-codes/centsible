import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

const Card = ({
  header,
  children,
  className,
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-6",
        className,
      )}
    >
      {header && (
        <div className="text-base font-semibold text-content">{header}</div>
      )}
      {children}
    </div>
  );
};

export default Card;
