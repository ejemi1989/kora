"use client";

import { useEffect, useState, ReactNode } from "react";

interface ToastProps {
  children: ReactNode;
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({ children, duration = 2600, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return <div className="toast">{children}</div>;
}
