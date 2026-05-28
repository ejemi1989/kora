import { ReactNode } from "react";

type BadgeVariant = "conf" | "pack" | "ship" | "del" | "can";

interface BadgeProps {
  variant: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
