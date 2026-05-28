import { ReactNode } from "react";

interface TimelineItem {
  status: "done" | "active" | "pending";
  title: string;
  subtitle?: string;
  timestamp?: string;
  number?: number;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className={`tl-item ${item.status}`}>
          <span className="tl-dot">
            {item.status === "done" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              item.number ?? i + 1
            )}
          </span>
          <div className="tl-body">
            <p className="tl-title">{item.title}</p>
            {item.subtitle && <p className="tl-subtitle">{item.subtitle}</p>}
            {item.timestamp && <p className="tl-time">{item.timestamp}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
