import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

function Button({
  className,
  type = "button",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer rounded-xl bg-primary px-5.5 py-3 font-medium text-background transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-primary/80 enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export default Button;
