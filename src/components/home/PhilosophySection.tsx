import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Icon } from "../common/Icon";
import { revealOnScroll, batchReveal, isReducedMotion } from "../../lib/motion";

export const PhilosophySection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  const pillars = [
    {
      icon: "shield" as const,
      title: "No Hidden Costs",
      desc: "Museum tickets, local transit, guide honorariums, and included meals are stated upfront. No surprise tipping envelopes or compulsory shopping stops.",
    },
    {
      icon: "users" as const,
      title: "Intimate Group Sizes",
      desc: "Capped strictly at 12–14 travelers for group departures. You'll never be part of a flag-waving human corridor.",
    },
    {
      icon: "check" as const,
      title: "Guaranteed Departures",
      desc: "Once you book a confirmed date, your trip departs. We do not cancel journeys at the eleventh hour because a coach is half-full.",
    },
    {
      icon: "phone" as const,
      title: "24/7 Human Concierge",
      desc: "Direct WhatsApp and telephone access to our Istanbul, Paris, and Tokyo desks throughout your journey.",
    },
  ];

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".philosophy-header", {
        trigger: containerRef.current,
        y: 28,
        duration: 0.85,
      });

      batchReveal(".philosophy-pillar", {
        interval: 0.08,
        batchMax: 4,
        y: 35,
        stagger: 0.12,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section is-dark" aria-labelledby="philosophy-heading">
      <div className="wrap">
        <div
          className="philosophy-header"
          style={{ textAlign: "center", maxWidth: "650px", marginInline: "auto", marginBottom: "3.5rem" }}
        >
          <p className="kicker" style={{ color: "var(--seaglass)" }}>OUR COMMITMENT</p>
          <h2 id="philosophy-heading" className="display" style={{ marginTop: "0.4rem", color: "var(--salt)" }}>
            Travel Built on Respect
          </h2>
          <p className="muted" style={{ marginTop: "0.8rem", fontSize: "1.05rem" }}>
            We measure our quality by the friendships made with local families, boat captains, and tavern keepers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="philosophy-pillar"
              style={{
                background: "rgba(238, 240, 234, 0.05)",
                border: "1px solid rgba(238, 240, 234, 0.12)",
                borderRadius: "var(--r-lg)",
                padding: "2rem 1.6rem",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(227, 167, 47, 0.15)",
                  color: "var(--saffron)",
                }}
              >
                <Icon name={p.icon} size={24} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: "1.25rem", color: "var(--salt)", fontWeight: 500 }}>
                {p.title}
              </h3>
              <p style={{ color: "rgba(238, 240, 234, 0.75)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
