import React, { useState } from "react";
import type { ItineraryStop } from "../../data/types";
import { Icon } from "../common/Icon";

interface ItineraryListProps {
  stops: ItineraryStop[];
}

export const ItineraryList: React.FC<ItineraryListProps> = ({ stops }) => {
  const [openAll, setOpenAll] = useState(false);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAll = () => {
    if (openAll) {
      setOpenIndices([]);
      setOpenAll(false);
    } else {
      setOpenIndices(stops.map((_, i) => i));
      setOpenAll(true);
    }
  };

  return (
    <div className="itinerary-section" style={{ display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h2 style={{ fontSize: "var(--step-3)" }}>The Journey Itinerary</h2>
          <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
            Thoughtfully paced stops designed for discovery without haste.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={toggleAll}
        >
          <span>{openAll ? "Collapse all" : "Expand all"}</span>
        </button>
      </div>

      <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
        {/* Continuous timeline vertical line */}
        <div
          style={{
            position: "absolute",
            left: "8px",
            top: "16px",
            bottom: "24px",
            width: "2px",
            background: "var(--line-strong)",
          }}
          aria-hidden="true"
        />

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {stops.map((stop, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={stop.title + idx}
                style={{
                  position: "relative",
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--line)",
                  overflow: "hidden",
                  transition: "box-shadow var(--dur-micro) ease",
                }}
              >
                {/* Timeline node */}
                <span
                  style={{
                    position: "absolute",
                    left: "-1.5rem",
                    top: "1.2rem",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: isOpen ? "var(--saffron)" : "var(--lagoon-600)",
                    border: "3px solid var(--salt)",
                    transform: "translateX(-7px)",
                    transition: "background var(--dur-micro) ease",
                  }}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.2rem 1.4rem",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "var(--step-1)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "baseline", gap: "0.8rem" }}>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        letterSpacing: "0.08em",
                        color: "var(--lagoon-400)",
                        fontFamily: "var(--font-ui)",
                      }}
                    >
                      STOP {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{stop.title}</span>
                  </span>
                  <Icon
                    name={isOpen ? "chevronDown" : "chevronRight"}
                    size={20}
                    style={{
                      flex: "none",
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform var(--dur-micro) ease",
                    }}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 1.4rem 1.4rem 1.4rem",
                      color: "var(--fg-muted)",
                      fontSize: "0.98rem",
                      lineHeight: "1.6",
                    }}
                  >
                    <p>{stop.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
