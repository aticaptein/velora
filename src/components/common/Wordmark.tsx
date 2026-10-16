import React from "react";

interface WordmarkProps {
  showTagline?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Wordmark: React.FC<WordmarkProps> = ({
  showTagline = true,
  className = "",
  size = "md",
}) => {
  const sizeStyles = {
    sm: { fontSize: "1.25rem" },
    md: { fontSize: "1.55rem" },
    lg: { fontSize: "2.2rem" },
  }[size];

  return (
    <div className={`wordmark-container ${className}`}>
      <span className="wordmark" style={sizeStyles} aria-label="VELORA">
        <span>VEL</span>
        <svg
          className="ring"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            opacity="0.85"
          />
          <g className="sun">
            <circle cx="12" cy="12" r="4.2" fill="var(--saffron, #e3a72f)" />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          </g>
        </svg>
        <span>RA</span>
      </span>
      {showTagline && (
        <span className="wordmark-tag" aria-hidden="true">
          The Art of Travel
        </span>
      )}
    </div>
  );
};
