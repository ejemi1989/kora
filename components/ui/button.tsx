"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "p" | "s" | "g" | "d" | "dark";
  size?: "default" | "sm" | "ico";
  block?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "p",
  size = "default",
  block = false,
  loading = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    size === "ico" ? "btn-ico" : "",
    block ? "btn-block" : "",
    loading ? "btn-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {children}
    </button>
  );
}
