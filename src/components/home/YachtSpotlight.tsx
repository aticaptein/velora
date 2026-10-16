import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { Icon } from "../common/Icon";
import { TOURS } from "../../data/tours";
import { formatCurrency } from "../../lib/format";
import { gsap, setupParallax, revealOnScroll, isReducedMotion } from "../../lib/motion";

export const YachtSpotlight: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const yachtTours = TOURS.filter((t) => t.categories.includes("yacht"));

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      setupParallax(".yacht-visual img", containerRef.current, 20);

      gsap.fromTo(
        ".yacht-visual",
        { autoAlpha: 0, x: -35 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".yacht-floating-card",
        { autoAlpha: 0, scale: 0.88, y: 25 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          delay: 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      revealOnScroll(".yacht-copy-item", {
        trigger: containerRef.current,
        y: 28,
        stagger: 0.12,
        start: "top 80%",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section is-dark" style={{ position: "relative", overflow: "hidden" }}>
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(2rem, 5vw, 4.5rem)",
            alignItems: "center",
          }}
        >
          {/* Visual Side */}
          <div style={{ position: "relative" }}>
            <div
              className="yacht-visual"
              style={{
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                aspectRatio: "4 / 3",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              }}
            >
              <ResponsiveImage
                name="yacht-1"
                alt="Wooden gulet anchored in turquoise bay off the Turkish Riviera"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="parallax-img"
              />
            </div>

            {/* Overlapping floating card */}
            <div
              className="yacht-floating-card"
              style={{
                position: "absolute",
                right: "-1rem",
                bottom: "-1.5rem",
                background: "var(--lagoon-800)",
                border: "1.5px solid var(--seaglass-200)",
                borderRadius: "var(--r-md)",
                padding: "1.2rem 1.6rem",
                boxShadow: "var(--shadow-float)",
                maxWidth: "280px",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--saffron)" }}>
                <Icon name="anchor" size={20} aria-hidden="true" />
                <span style={{ fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.05em" }}>
                  PRIVATE CHARTER
                </span>
              </div>
              <p style={{ fontSize: "0.95rem", marginTop: "0.4rem", color: "var(--salt)" }}>
                Handcrafted Bodrum gulets with captain, chef, and private anchorage.
              </p>
            </div>
          </div>

          {/* Copy Side */}
          <div>
            <div className="yacht-copy-item">
              <p className="kicker" style={{ color: "var(--seaglass)" }}>
                NAUTICAL EXPLORATION
              </p>
              <h2 className="display" style={{ marginTop: "0.4rem", color: "var(--salt)" }}>
                The Sea From Its Own Deck
              </h2>
              <p className="muted" style={{ marginTop: "1rem", fontSize: "1.1rem", lineHeight: 1.6 }}>
                Whether a day-trip catamaran skirting Santorini's volcanic caldera or a seven-day wooden gulet wandering the sunken ruins of Kekova, experiencing the coastline by boat strips away the highway noise.
              </p>
            </div>

            <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
              {yachtTours.slice(0, 2).map((tour) => (
                <div
                  key={tour.slug}
                  className="yacht-copy-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.4rem",
                    borderRadius: "var(--r-md)",
                    background: "rgba(238, 240, 234, 0.06)",
                    border: "1px solid rgba(238, 240, 234, 0.12)",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--salt)" }}>
                      <Link to={`/tours/${tour.slug}`} style={{ textDecoration: "none" }}>
                        {tour.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--seaglass)", marginTop: "0.2rem" }}>
                      {tour.destination} &bull; {tour.durationLabel}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", flex: "none" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--seaglass-200)", display: "block" }}>
                      from
                    </span>
                    <strong style={{ fontSize: "1.2rem", color: "var(--saffron)" }}>
                      {formatCurrency(tour.price)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="yacht-copy-item" style={{ marginTop: "2rem" }}>
              <Link to="/tours?category=yacht" className="btn btn-accent">
                <span>View all yacht &amp; boat experiences</span>
                <Icon name="arrowRight" size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
