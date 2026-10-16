import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { CATEGORIES } from "../../data/categories";
import { Icon } from "../common/Icon";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { revealOnScroll, batchReveal, isReducedMotion } from "../../lib/motion";

export const CategoryScroller: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".cat-header", {
        trigger: containerRef.current,
        y: 28,
        duration: 0.8,
      });

      batchReveal(".category-card", {
        interval: 0.08,
        batchMax: 4,
        y: 35,
        stagger: 0.08,
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section" aria-labelledby="categories-heading">
      <div className="wrap">
        <div
          className="cat-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <p className="kicker">HOW DO YOU TRAVEL?</p>
            <h2 id="categories-heading" className="h-xl" style={{ marginTop: "0.4rem" }}>
              16 Styles of Discovery
            </h2>
          </div>
          <Link to="/tours" className="text-link">
            <span>Browse all categories</span>
            <Icon name="arrowRight" size={16} aria-hidden="true" />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/tours?category=${category.id}`}
              style={{
                position: "relative",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "1.4rem",
                color: "var(--salt)",
                textDecoration: "none",
                isolation: "isolate",
                boxShadow: "0 10px 25px rgba(10,33,36,0.15)",
                transition: "transform 400ms var(--ease-velora), box-shadow 400ms ease",
              }}
              className="category-card"
            >
              {/* Background image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: -1,
                  transition: "transform 700ms var(--ease-velora)",
                }}
              >
                <ResponsiveImage
                  name={category.image}
                  alt={category.name}
                  sizes="(min-width: 1200px) 300px, 50vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(10,33,36,0.1) 0%, rgba(10,33,36,0.85) 85%)",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(238, 240, 234, 0.2)",
                    backdropFilter: "blur(6px)",
                    color: "var(--saffron)",
                  }}
                >
                  <Icon name={category.icon} size={18} aria-hidden="true" />
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--salt)" }}>
                  {category.name}
                </h3>
              </div>

              <p style={{ fontSize: "0.85rem", opacity: 0.88, color: "var(--seaglass-200)", lineHeight: 1.35 }}>
                {category.blurb}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
