type StatusBadgeTone = "success" | "warning" | "info" | "neutral" | "danger";

const toneClass: Record<StatusBadgeTone, string> = {
  success: "status-badge status-badge-success",
  warning: "status-badge status-badge-warning",
  info: "status-badge status-badge-info",
  neutral: "status-badge status-badge-neutral",
  danger: "status-badge status-badge-danger",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
}) {
  return <span className={toneClass[tone]}>{children}</span>;
}
