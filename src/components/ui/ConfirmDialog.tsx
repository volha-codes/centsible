import { TriangleAlert } from "lucide-react";

import Button from "./Button";
import Modal from "./Modal";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-expense/10">
          <TriangleAlert className="text-expense" size={22} />
        </div>
        <h2 className="text-lg font-semibold text-content">{title}</h2>
        <p className="text-sm text-muted">{description}</p>
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
