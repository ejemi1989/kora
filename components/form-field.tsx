"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface FormGroupProps {
  label?: string;
  children: ReactNode;
}

export function FormGroup({ label, children }: FormGroupProps) {
  return (
    <div className="fg">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

interface FiProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Fi({ label, className = "", ...props }: FiProps) {
  return (
    <div>
      {label && <span className="di-label">{label}</span>}
      <input className={`fi ${className}`.trim()} {...props} />
    </div>
  );
}

interface DiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function DiInput({ label, className = "", ...props }: DiInputProps) {
  return (
    <div>
      {label && <span className="di-label">{label}</span>}
      <input className={`di-input ${className}`.trim()} {...props} />
    </div>
  );
}

interface DiTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function DiTextarea({ label, className = "", ...props }: DiTextareaProps) {
  return (
    <div>
      {label && <span className="di-label">{label}</span>}
      <textarea className={`di-input ${className}`.trim()} {...props} />
    </div>
  );
}

interface FeProps {
  children?: ReactNode;
}

export function Fe({ children }: FeProps) {
  return <p className="fe">{children}</p>;
}
