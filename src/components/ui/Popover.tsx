import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const Popover = ({
  children,
}: {
  children: (close: () => void) => ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-md p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-content"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-10 mt-1 min-w-36 rounded-lg border border-border bg-surface-elevated py-1 shadow-lg">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};

export default Popover;
