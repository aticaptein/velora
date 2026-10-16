import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, setupParallax } from "../../lib/motion";
import { Icon } from "../common/Icon";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { DESTINATIONS } from "../../data/destinations";
import { CATEGORIES } from "../../data/categories";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const [selectedDest, setSelectedDest] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDest) params.set("destination", selectedDest);
    if (selectedCategory) params.set("category", selectedCategory);
    navigate(`/tours?${params.toString()}`);
  };

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Parallax scroll on hero background
      setupParallax(".hero-bg img", containerRef.current, 22);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-bg",
        { scale: 1.12, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.2 }
      )
        .fromTo(
          ".hero-kicker",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6 },
          "-=0.9"
        )
        .fromTo(
          ".hero-title-line",
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.12, duration: 0.85, ease: "power4.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-desc",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65 },
          "-=0.4"
        )
        .fromTo(
          ".hero-search-card",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75 },
          "-=0.4"
        )
        .fromTo(
          ".hero-badge",
          { scale: 0.92, autoAlpha: 0, y: 12 },
          {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.5,
            onComplete: () => {
              // Gentle organic float on stat badges
              gsap.to(".hero-badge", {
                y: -4,
                duration: 2.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                stagger: 0.2,
              });
            },
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="hero-section is-dark"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "calc(var(--header-h) + 2rem)",
        paddingBottom: "var(--sp-7)",
        overflow: "hidden",
      }}
      aria-label="Welcome to VELORA"
    >
      {/* Background Media with Dark Gradient Overlay */}
      <div
        className="hero-bg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <ResponsiveImage
          name="hero-cappadocia"
          alt="Hot air balloons floating above Cappadocia fairy chimneys at sunrise"
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          className="hero-image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,33,36,0.72) 0%, rgba(10,33,36,0.45) 45%, rgba(10,33,36,0.88) 100%)",
          }}
        />
      </div>

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "880px" }}>
          <p
            className="hero-kicker kicker"
            style={{
              color: "var(--saffron)",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
              textTransform: "uppercase",
              fontSize: "0.85rem",
            }}
          >
            International Travel &amp; Crafted Journeys
          </p>

          <h1
            className="display"
            style={{
              color: "var(--salt)",
              marginBottom: "1.5rem",
              fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
            }}
          >
            <span style={{ display: "block", overflow: "hidden" }}>
              <span className="hero-title-line" style={{ display: "block" }}>
                The art of travelling
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span className="hero-title-line" style={{ display: "block", fontStyle: "italic", fontWeight: 300, color: "var(--seaglass-200)" }}>
                slowly, deeply &amp; well.
              </span>
            </span>
          </h1>

          <p
            className="hero-desc lede"
            style={{
              color: "rgba(238, 240, 234, 0.88)",
              marginBottom: "2.5rem",
              fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)",
            }}
          >
            From dawn hot air balloons over Göreme to secluded Lycian gulet coves, Nordic fjords, and Roman alleyways. Thoughtfully planned for curious minds.
          </p>
        </div>

        {/* Quick Search Bar */}
        <div
          className="hero-search-card"
          style={{
            background: "rgba(247, 248, 244, 0.95)",
            color: "var(--lagoon-900)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(1rem, 2vw, 1.5rem)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            maxWidth: "1020px",
          }}
        >
          <form
            onSubmit={handleQuickSearch}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) auto",
              gap: "1rem",
              alignItems: "end",
            }}
          >
            <div className="field">
              <label htmlFor="hero-dest" className="field-label" style={{ color: "var(--lagoon-800)" }}>
                Where to explore?
              </label>
              <select
                id="hero-dest"
                className="select"
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
              >
                <option value="">Any destination (13 regions)</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.name}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="hero-cat" className="field-label" style={{ color: "var(--lagoon-800)" }}>
                Travel style
              </label>
              <select
                id="hero-cat"
                className="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All styles (16 categories)</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              style={{ minHeight: "50px", paddingInline: "1.8rem" }}
            >
              <Icon name="search" size={18} aria-hidden="true" />
              <span>Find Journeys</span>
            </button>
          </form>

          {/* Quick Filter Teaser Chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "1rem",
              paddingTop: "0.8rem",
              borderTop: "1px solid rgba(14, 43, 46, 0.1)",
              fontSize: "0.85rem",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--fg-muted)" }}>Popular:</span>
            {[
              { label: "Cappadocia Sunrise", dest: "Cappadocia" },
              { label: "Lycian Gulet Sail", cat: "yacht" },
              { label: "Tokyo Night Markets", dest: "Tokyo" },
              { label: "Amalfi Coastline", dest: "Amalfi Coast" },
              { label: "Swiss Alpine Trails", dest: "Swiss Alps" },
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                className="hero-badge chip"
                style={{ minHeight: "32px", padding: "0.2rem 0.75rem", fontSize: "0.82rem" }}
                onClick={() => {
                  if (p.dest) setSelectedDest(p.dest);
                  if (p.cat) setSelectedCategory(p.cat);
                  const q = p.dest ? `destination=${p.dest}` : `category=${p.cat}`;
                  navigate(`/tours?${q}`);
                }}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Features Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(238, 240, 234, 0.15)",
          }}
        >
          <div className="hero-badge">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--saffron)", display: "block" }}>
              30+
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--salt)" }}>Curated Journeys</span>
          </div>

          <div className="hero-badge">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--seaglass)", display: "block" }}>
              13
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--salt)" }}>Global Destinations</span>
          </div>

          <div className="hero-badge">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--saffron-300)", display: "block" }}>
              16
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--salt)" }}>Unique Travel Categories</span>
          </div>

          <div className="hero-badge">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--salt)", display: "block" }}>
              100%
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--seaglass)" }}>Vetted Local Guides</span>
          </div>
        </div>
      </div>
    </section>
  );
};
