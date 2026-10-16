import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { Tour } from "../../data/types";
import { TourCard } from "./TourCard";
import { Icon } from "../common/Icon";
import { Link } from "react-router-dom";
import { gsap, isReducedMotion } from "../../lib/motion";

interface TourGridProps {
  tours: Tour[];
  emptyMessage?: string;
  onResetFilters?: () => void;
  className?: string;
}

export const TourGrid: React.FC<TourGridProps> = ({
  tours,
  emptyMessage = "No journeys match your active criteria.",
  onResetFilters,
  className = "",
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion() || tours.length === 0) return;

      gsap.fromTo(
        ".tour-card-wrap",
        { autoAlpha: 0, y: 20 },
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
    { scope: gridRef, dependencies: [tours] }
  );

  if (tours.length === 0) {
    return (
      <div className="empty" role="region" aria-label="No results">
        <Icon name="compass" className="empty-icon" size={48} aria-hidden="true" />
        <h3>No journeys found</h3>
        <p>{emptyMessage}</p>
        {onResetFilters ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onResetFilters}>
            <span>Reset all filters</span>
          </button>
        ) : (
          <Link to="/tours" className="btn btn-sm">
            <span>Explore all journeys</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div ref={gridRef} className={`tour-grid ${className}`}>
      {tours.map((tour) => (
        <TourCard key={tour.slug} tour={tour} />
      ))}
    </div>
  );
};
