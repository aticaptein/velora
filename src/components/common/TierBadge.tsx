import React from "react";
import type { Tier } from "../../data/types";
import { Icon } from "./Icon";

interface TierBadgeProps {
  tier: Tier;
  className?: string;
}

const tierMeta: Record<Tier, { label: string; icon: "compass" | "star" | "crown" }> = {
  essential: { label: "Essential", icon: "compass" },
  signature: { label: "Signature", icon: "star" },
  luxury: { label: "Luxury & VIP", icon: "crown" },
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className = "" }) => {
  const meta = tierMeta[tier] || tierMeta.signature;

  return (
    <span className={`tier ${className}`} data-tier={tier}>
      <Icon name={meta.icon} size={14} aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
};
