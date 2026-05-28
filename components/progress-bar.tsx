interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress-bar ${className}`.trim()}>
      <div className="progress-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
