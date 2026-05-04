import type { LucideIcon } from "lucide-react";

type MetricTone = "default" | "positive" | "warning" | "info";

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = "default",
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  tone?: MetricTone;
}) {
  return (
    <article className={`metric metric-${tone}`}>
      <div className="metric-topline">
        <span>{label}</span>
        {Icon ? (
          <span className="metric-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <strong>{value}</strong>
      {trend ? <p>{trend}</p> : null}
    </article>
  );
}
