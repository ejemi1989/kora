import { ReactNode } from "react";
import { Icon } from "@/components/icon";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = "info",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={36} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
