import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

export function Panel({
  title,
  actionLabel,
  onAction,
  children,
  className = "",
}: PanelProps) {
  return (
    <div className={`panel ${className}`.trim()}>
      {title && (
        <div className="panel-h">
          <h3>{title}</h3>
          {actionLabel && (
            <button className="panel-action" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div className="panel-b">{children}</div>
    </div>
  );
}
