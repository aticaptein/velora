import React from "react";
import type { TourStatus } from "../../data/types";

interface StatusBadgeProps {
  status: TourStatus;
  note?: string;
  className?: string;
}

const statusLabels: Record<TourStatus, string> = {
  available: "Available",
  limited: "Limited departures",
  soldout: "Sold out this season",
  cancelled: "Temporarily paused",
  inactive: "Seasonal hiatus",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  note,
  className = "",
}) => {
  const label = note || statusLabels[status];

  return (
    <span
      className={`status ${className}`}
      data-status={status}
      role="status"
      aria-label={`Booking status: ${label}`}
    >
      {label}
    </span>
  );
};
