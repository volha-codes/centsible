import { Construction } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

function Toast({
  toast,
  onDismiss,
  duration = 3000,
}: {
  toast: { id: number; message: string } | null;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, duration]);

  if (!toast) return null;

  return createPortal(
    <div
      key={toast.id}
      className="fixed right-6 bottom-6 z-50 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg"
    >
      <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-content">
        <Construction size={16} className="text-warning" />
        {toast.message}
      </div>
      <div
        className="h-1 bg-primary"
        style={{ animation: `toast-progress ${duration}ms linear forwards` }}
      />
    </div>,
    document.body,
  );
}

export default Toast;
