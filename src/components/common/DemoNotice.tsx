import React from "react";
import { Icon } from "./Icon";
import { DEMO_NOTICE } from "../../data/categories";

interface DemoNoticeProps {
  className?: string;
  compact?: boolean;
}

export const DemoNotice: React.FC<DemoNoticeProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <aside
      className={`demo-ribbon ${className}`}
      role="note"
      aria-label="Demo notice"
    >
      <Icon name="info" size={18} aria-hidden="true" />
      <span>
        {compact
          ? "Illustrative demo: bookings and availability are simulated."
          : DEMO_NOTICE}
      </span>
    </aside>
  );
};
