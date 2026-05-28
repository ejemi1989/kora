import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down";
  trendLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  className = "",
}: StatCardProps) {
  return (
    <div className={`panel ${className}`.trim()}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === "up" ? "text-success" : "text-danger"}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            {trend === "up" ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
