import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { DESTINATIONS } from "../data/destinations";
import { TOURS } from "../data/tours";
import { ResponsiveImage } from "../components/common/ResponsiveImage";
import { Icon } from "../components/common/Icon";
import { DemoNotice } from "../components/common/DemoNotice";
import { gsap, isReducedMotion } from "../lib/motion";

export const DestinationsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = ["All", "Türkiye", "Europe", "Asia", "Middle East", "Scandinavia"];

  const filteredDestinations = DESTINATIONS.filter(
    (d) => selectedRegion === "All" || d.region === selectedRegion
  );

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      gsap.fromTo(
        ".dest-card",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    },
    { scope: containerRef, dependencies: [selectedRegion] }
  );

  return (
    <div ref={containerRef} className="destinations-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Destinations</span></li>
          </ol>
        </nav>

        <h1 className="display">Where We Travel</h1>
        <p className="lede">
          Thirteen distinct regions of the world, explored with local roots, quiet curiosity, and architectural beauty.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>

        {/* Region Filter Tabs */}
        <div
          style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "2rem" }}
          role="tablist"
          aria-label="Filter by region"
        >
          {regions.map((region) => {
            const active = region === selectedRegion;
            return (
              <button
                key={region}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedRegion(region)}
                className="chip"
                style={{
                  background: active ? "var(--lagoon-800)" : "transparent",
                  color: active ? "var(--salt)" : "var(--fg)",
                  fontWeight: 600,
                }}
              >
                <span>{region}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="wrap" style={{ marginTop: "1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          {filteredDestinations.map((dest) => {
            const tourCount = TOURS.filter(
              (t) => t.destination.toLowerCase() === dest.name.toLowerCase()
            ).length;

            return (
              <article
                key={dest.slug}
                className="dest-card"
                style={{
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-lg)",
                  overflow: "hidden",
                  border: "1.5px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 30px rgba(10,33,36,0.06)",
                  transition: "transform 400ms var(--ease-velora), box-shadow 400ms ease",
                }}
              >
                {/* Visual Header */}
                <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                  <ResponsiveImage
                    name={dest.images[0] || "hero-cappadocia"}
                    alt={dest.name}
                    sizes="(min-width: 1200px) 400px, 100vw"
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "1rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "var(--r-pill)",
                      background: "rgba(10,33,36,0.85)",
                      color: "var(--salt)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {dest.country} &bull; {dest.region}
                  </span>

                  <span
                    style={{
                      position: "absolute",
                      right: "1rem",
                      bottom: "1rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "var(--r-pill)",
                      background: "rgba(238, 240, 234, 0.9)",
                      color: "var(--lagoon-800)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {tourCount} {tourCount === 1 ? "journey" : "journeys"}
                  </span>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: dest.accent,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Best Season: {dest.bestTime}
                    </span>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 400, marginTop: "0.3rem" }}>
                      {dest.name}
                    </h2>
                    <p
                      className="muted"
                      style={{ fontStyle: "italic", fontSize: "0.95rem", marginTop: "0.2rem" }}
                    >
                      "{dest.tagline}"
                    </p>

                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        marginTop: "0.8rem",
                        color: "var(--fg)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {dest.intro}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "1.5rem",
                      paddingTop: "1.2rem",
                      borderTop: "1px solid var(--line)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      to={`/destinations/${dest.slug}`}
                      className="btn btn-outline btn-sm"
                    >
                      <span>Explore Dossier</span>
                    </Link>

                    <Link
                      to={`/tours?destination=${encodeURIComponent(dest.name)}`}
                      className="text-link"
                    >
                      <span>Browse Tours</span>
                      <Icon name="arrowRight" size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
