import React from "react";
import { Icon } from "./Icon";

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  label: string;
  disabled?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 0,
  max = 20,
  onChange,
  label,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Icon name="minus" size={16} aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-atomic="true">
        {value}
      </output>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label={`Increase ${label}`}
      >
        <Icon name="plus" size={16} aria-hidden="true" />
      </button>
    </div>
  );
};
