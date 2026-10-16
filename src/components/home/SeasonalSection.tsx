import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { TOURS } from "../../data/tours";
import { TourCard } from "../tour/TourCard";
import { gsap, revealOnScroll, batchReveal, isReducedMotion } from "../../lib/motion";

type SeasonKey = "all" | "spring" | "summer" | "autumn" | "winter";

export const SeasonalSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonKey>("spring");

  const seasonMeta: Record<
    SeasonKey,
    { label: string; tagline: string; icon: string }
  > = {
    all: { label: "All Seasons", tagline: "Journeys that shine across every calendar turn.", icon: "sun" },
    spring: { label: "Spring", tagline: "Alpine thaw, Istanbul blossoms and empty Aegean lanes.", icon: "sun" },
    summer: { label: "Summer", tagline: "Sun-drenched coasts, turquoise dips and long starry nights.", icon: "sun" },
    autumn: { label: "Autumn", tagline: "Harvest tables, golden light in Cappadocia and quiet cities.", icon: "leaf" },
    winter: { label: "Winter", tagline: "Swiss powder snow, cozy cave fires and crisp fjord air.", icon: "snowflake" },
  };

  const filteredTours = TOURS.filter(
    (t) => activeSeason === "all" || t.season === activeSeason || t.season === "all"
  ).slice(0, 3);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".seasonal-header", {
        trigger: containerRef.current,
        y: 28,
        duration: 0.85,
      });

      batchReveal(".seasonal-card-item", {
        interval: 0.08,
        batchMax: 3,
        y: 36,
        stagger: 0.1,
      });
    },
    { scope: containerRef }
  );

  // Transition when switching season filter
  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    gsap.fromTo(
      ".seasonal-card-item",
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }
    );
  }, [activeSeason]);

  return (
    <section ref={containerRef} className="section" aria-labelledby="seasonal-heading">
      <div className="wrap">
        <div
          className="seasonal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <p className="kicker">RHYTHMS OF THE YEAR</p>
            <h2 id="seasonal-heading" className="h-xl" style={{ marginTop: "0.4rem" }}>
              Seasonal Departures
            </h2>
          </div>

          {/* Season switcher */}
          <div
            style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
            role="tablist"
            aria-label="Season filter"
          >
            {(Object.keys(seasonMeta) as SeasonKey[]).map((key) => {
              const active = key === activeSeason;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveSeason(key)}
                  className="chip"
                  style={{
                    background: active ? "var(--lagoon-800)" : "transparent",
                    color: active ? "var(--salt)" : "var(--fg)",
                    fontSize: "0.88rem",
                    minHeight: "38px",
                  }}
                >
                  <span>{seasonMeta[key].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="muted seasonal-header" style={{ fontSize: "1.05rem", marginBottom: "2.5rem" }}>
          {seasonMeta[activeSeason].tagline}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "2rem",
          }}
        >
          {filteredTours.map((tour) => (
            <div key={tour.slug} className="seasonal-card-item">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link to={`/tours`} className="btn btn-ghost btn-sm">
            <span>Explore all seasonal departures</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
