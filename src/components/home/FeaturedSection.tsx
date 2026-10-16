import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { TOURS } from "../../data/tours";
import { TourCard } from "../tour/TourCard";
import { Icon } from "../common/Icon";
import { revealOnScroll, batchReveal, isReducedMotion } from "../../lib/motion";

export const FeaturedSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const featuredTours = TOURS.filter((t) => t.featured).slice(0, 6);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".featured-header", {
        trigger: containerRef.current,
        y: 30,
        duration: 0.85,
      });

      batchReveal(".featured-card-wrapper", {
        interval: 0.1,
        batchMax: 3,
        y: 40,
        stagger: 0.12,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section is-dark" aria-labelledby="featured-heading">
      <div className="wrap">
        <div
          className="featured-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p className="kicker" style={{ color: "var(--seaglass)" }}>CURATOR'S COLLECTION</p>
            <h2 id="featured-heading" className="display" style={{ marginTop: "0.4rem", color: "var(--salt)" }}>
              Journeys of Rare Character
            </h2>
          </div>
          <Link to="/tours" className="btn btn-accent btn-sm">
            <span>Explore all 30 journeys</span>
            <Icon name="arrowRight" size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Featured Tours Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          {featuredTours.map((tour) => (
            <div
              key={tour.slug}
              className="featured-card-wrapper"
              style={{
                background: "var(--lagoon-900)",
                borderRadius: "var(--r-lg)",
                padding: "1rem",
                border: "1px solid rgba(238, 240, 234, 0.12)",
              }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
