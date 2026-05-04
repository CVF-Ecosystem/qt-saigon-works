import { X } from "lucide-react";

export function MobileDetailSheet({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-backdrop" role="presentation">
      <section
        aria-modal="true"
        className="mobile-detail-sheet"
        role="dialog"
      >
        <div className="sheet-header">
          <h2>{title}</h2>
          <button aria-label="Đóng" onClick={onClose} type="button">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
