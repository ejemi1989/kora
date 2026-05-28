interface Step {
  label: string;
  status: "done" | "active" | "pending";
  number?: number;
}

interface DeliveryStepperProps {
  steps: Step[];
}

export function DeliveryStepper({ steps }: DeliveryStepperProps) {
  return (
    <div className="stepper">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`step ${step.status}`}
        >
          <span className="step-dot">
            {step.status === "done" ? (
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
              step.number ?? i + 1
            )}
          </span>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
