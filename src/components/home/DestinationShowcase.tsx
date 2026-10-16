import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { DESTINATIONS } from "../../data/destinations";
import { TOURS } from "../../data/tours";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { Icon } from "../common/Icon";
import { gsap, revealOnScroll, setupParallax, isReducedMotion } from "../../lib/motion";

export const DestinationShowcase: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeSlug, setActiveSlug] = useState("cappadocia");

  const currentDest =
    DESTINATIONS.find((d) => d.slug === activeSlug) || DESTINATIONS[0];

  const destinationTours = TOURS.filter(
    (t) => t.destination.toLowerCase() === currentDest.name.toLowerCase()
  );

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".dest-header", {
        trigger: containerRef.current,
        y: 28,
        duration: 0.85,
      });

      revealOnScroll(".dest-stage-box", {
        trigger: ".dest-stage-box",
        y: 35,
        duration: 0.9,
      });

      setupParallax(".dest-stage-image img", ".dest-stage-box", 16);
    },
    { scope: containerRef }
  );

  // Transition animation when active destination changes
  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    gsap.fromTo(
      ".dest-stage-content",
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    gsap.fromTo(
      ".dest-stage-image img",
      { autoAlpha: 0.6, scale: 1.05 },
      { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power3.out" }
    );
  }, [activeSlug]);

  return (
    <section ref={containerRef} className="section" aria-labelledby="destinations-showcase-heading">
      <div className="wrap">
        <div
          className="dest-header"
          style={{ textAlign: "center", maxWidth: "680px", marginInline: "auto", marginBottom: "2.5rem" }}
        >
          <p className="kicker">TERRA INCOGNITA</p>
          <h2 id="destinations-showcase-heading" className="display" style={{ marginTop: "0.4rem" }}>
            13 Landscapes to Inhabit
          </h2>
          <p className="muted" style={{ marginTop: "0.8rem", fontSize: "1.05rem" }}>
            Each destination has its own tempo, light, and private secrets. Select a territory to preview its character.
          </p>
        </div>

        {/* Destination Selector Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollbarWidth: "none",
            marginBottom: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          role="tablist"
          aria-label="Destination selector tabs"
        >
          {DESTINATIONS.map((d) => {
            const isActive = d.slug === activeSlug;
            return (
              <button
                key={d.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`dest-panel-${d.slug}`}
                onClick={() => setActiveSlug(d.slug)}
                className="chip"
                style={{
                  background: isActive ? "var(--lagoon-800)" : "var(--salt-50)",
                  color: isActive ? "var(--salt)" : "var(--fg)",
                  borderColor: isActive ? "var(--lagoon-800)" : "var(--line-strong)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                }}
              >
                <span>{d.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Destination Editorial Stage */}
        <div
          id={`dest-panel-${currentDest.slug}`}
          role="tabpanel"
          className="dest-stage-box"
          style={{
            background: "var(--salt-50)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            border: "1.5px solid var(--line)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            }}
          >
            {/* Image Gallery Column */}
            <div className="dest-stage-image" style={{ position: "relative", minHeight: "360px", overflow: "hidden" }}>
              <ResponsiveImage
                name={currentDest.images[0] || "hero-cappadocia"}
                alt={`${currentDest.name}, ${currentDest.country}`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="parallax-img"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "1.5rem",
                  bottom: "1.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--r-pill)",
                  background: "rgba(10,33,36,0.85)",
                  color: "var(--salt)",
                  backdropFilter: "blur(6px)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  zIndex: 2,
                }}
              >
                {currentDest.region} &bull; {currentDest.country}
              </div>
            </div>

            {/* Editorial Content Column */}
            <div
              className="dest-stage-content"
              style={{
                padding: "clamp(1.5rem, 4vw, 3.5rem)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p className="kicker" style={{ color: currentDest.accent }}>
                  {currentDest.bestTime}
                </p>
                <h3 style={{ fontSize: "var(--step-4)", fontWeight: 350, marginTop: "0.3rem" }}>
                  {currentDest.name}
                </h3>
                <p style={{ fontStyle: "italic", fontSize: "1.1rem", color: "var(--fg-muted)", marginTop: "0.4rem" }}>
                  "{currentDest.tagline}"
                </p>

                <p style={{ marginTop: "1.2rem", lineHeight: 1.6, color: "var(--fg)" }}>
                  {currentDest.intro}
                </p>

                {/* Key Moments */}
                <div style={{ marginTop: "1.8rem", display: "grid", gap: "0.75rem" }}>
                  {currentDest.moments.slice(0, 3).map((m, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
                      <Icon name="check" size={16} style={{ color: currentDest.accent, flex: "none" }} aria-hidden="true" />
                      <span style={{ fontSize: "0.95rem" }}><strong>{m.title}</strong> &ndash; {m.body}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Tours Preview */}
              <div
                style={{
                  marginTop: "2.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--line)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <span className="muted" style={{ fontSize: "0.95rem" }}>
                  {destinationTours.length} curated {destinationTours.length === 1 ? "journey" : "journeys"} available
                </span>

                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <Link
                    to={`/destinations/${currentDest.slug}`}
                    className="btn btn-outline btn-sm"
                  >
                    <span>View Territory Dossier</span>
                  </Link>

                  <Link
                    to={`/tours?destination=${encodeURIComponent(currentDest.name)}`}
                    className="btn btn-accent btn-sm"
                  >
                    <span>Browse Tours</span>
                    <Icon name="arrowRight" size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
