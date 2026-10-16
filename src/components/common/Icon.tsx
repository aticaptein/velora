import React from "react";
import type { IconName } from "../../data/types";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = "",
  "aria-hidden": ariaHidden = true,
  "aria-label": ariaLabel,
  ...props
}) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,
    ...props,
  };

  switch (name) {
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    case "heart":
      return (
        <svg {...commonProps}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "heartFill":
      return (
        <svg {...commonProps} fill="currentColor" stroke="none">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...commonProps}>
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      );
    case "close":
    case "x":
      return (
        <svg {...commonProps}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "arrowRight":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case "arrowLeft":
      return (
        <svg {...commonProps}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case "arrowUpRight":
      return (
        <svg {...commonProps}>
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      );
    case "chevronDown":
      return (
        <svg {...commonProps}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "chevronLeft":
      return (
        <svg {...commonProps}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...commonProps}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...commonProps}>
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      );
    case "users":
      return (
        <svg {...commonProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "clock":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "pin":
      return (
        <svg {...commonProps}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "check":
      return (
        <svg {...commonProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "info":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "plus":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      );
    case "minus":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
        </svg>
      );
    case "star":
      return (
        <svg {...commonProps} fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "compass":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...commonProps}>
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      );
    case "wave":
      return (
        <svg {...commonProps}>
          <path d="M2 12c2.5-3 5.5-3 8 0s5.5 3 8 0" />
          <path d="M2 17c2.5-3 5.5-3 8 0s5.5 3 8 0" />
        </svg>
      );
    case "anchor":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="5" r="3" />
          <line x1="12" x2="12" y1="8" y2="22" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      );
    case "ship":
      return (
        <svg {...commonProps}>
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
          <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
          <path d="M12 10v4" />
          <path d="M12 2v3" />
        </svg>
      );
    case "family":
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="8" r="3" />
          <circle cx="18" cy="8" r="3" />
          <circle cx="12" cy="14" r="2.5" />
          <path d="M2 19c0-2.5 2-4 4-4s4 1.5 4 4" />
          <path d="M14 19c0-2.5 2-4 4-4s4 1.5 4 4" />
          <path d="M9.5 21c0-1.8 1.1-3 2.5-3s2.5 1.2 2.5 3" />
        </svg>
      );
    case "rings":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="12" r="6" />
          <circle cx="15" cy="12" r="6" />
        </svg>
      );
    case "crown":
      return (
        <svg {...commonProps}>
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
      );
    case "layers":
      return (
        <svg {...commonProps}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "weekend":
      return (
        <svg {...commonProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case "fork":
      return (
        <svg {...commonProps}>
          <path d="M18 2v20" />
          <path d="M6 2v6a3 3 0 0 0 6 0V2" />
          <path d="M9 8v14" />
        </svg>
      );
    case "snowflake":
      return (
        <svg {...commonProps}>
          <line x1="12" x2="12" y1="2" y2="22" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
          <line x1="19.07" x2="4.93" y1="4.93" y2="19.07" />
        </svg>
      );
    case "city":
      return (
        <svg {...commonProps}>
          <path d="M3 21h18" />
          <path d="M6 21V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" />
          <path d="M14 13h4a2 2 0 0 1 2 2v6" />
          <path d="M9 11h2" />
          <path d="M9 15h2" />
        </svg>
      );
    case "landmark":
      return (
        <svg {...commonProps}>
          <line x1="3" x2="21" y1="22" y2="22" />
          <line x1="6" x2="6" y1="18" y2="11" />
          <line x1="10" x2="10" y1="18" y2="11" />
          <line x1="14" x2="14" y1="18" y2="11" />
          <line x1="18" x2="18" y1="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...commonProps}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case "globe":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "home":
      return (
        <svg {...commonProps}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...commonProps}>
          <line x1="4" x2="4" y1="21" y2="14" />
          <line x1="4" x2="4" y1="10" y2="3" />
          <line x1="12" x2="12" y1="21" y2="12" />
          <line x1="12" x2="12" y1="8" y2="3" />
          <line x1="20" x2="20" y1="21" y2="16" />
          <line x1="20" x2="20" y1="12" y2="3" />
          <line x1="1" x2="7" y1="14" y2="14" />
          <line x1="9" x2="15" y1="8" y2="8" />
          <line x1="17" x2="23" y1="16" y2="16" />
        </svg>
      );
    case "ticket":
      return (
        <svg {...commonProps}>
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      );
    case "phone":
      return (
        <svg {...commonProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...commonProps}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "sun":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case "alert":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      );
    case "trash":
      return (
        <svg {...commonProps}>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      );
    case "expand":
      return (
        <svg {...commonProps}>
          <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" />
          <path d="M9 19.8H4.2V15m4.8 4.8L3 13.8" />
          <path d="M9 4.2H4.2V9m4.8-4.8L3 10.2" />
          <path d="M15 4.2h4.8V9m-4.8-4.8 6 6" />
        </svg>
      );
    case "route":
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </svg>
      );
    case "camera":
      return (
        <svg {...commonProps}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      );
    case "car":
      return (
        <svg {...commonProps}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case "grid":
      return (
        <svg {...commonProps}>
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      );
    case "list":
      return (
        <svg {...commonProps}>
          <line x1="8" x2="21" y1="6" y2="6" />
          <line x1="8" x2="21" y1="12" y2="12" />
          <line x1="8" x2="21" y1="18" y2="18" />
          <line x1="3" x2="3.01" y1="6" y2="6" />
          <line x1="3" x2="3.01" y1="12" y2="12" />
          <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};
