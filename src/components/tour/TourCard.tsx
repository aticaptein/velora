import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Tour } from "../../data/types";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { TierBadge } from "../common/TierBadge";
import { StatusBadge } from "../common/StatusBadge";
import { Icon } from "../common/Icon";
import { formatCurrency } from "../../lib/format";
import { useFavorites } from "../../context/FavoritesContext";
import { DESTINATIONS } from "../../data/destinations";
import { gsap, setupCardTilt, isReducedMotion } from "../../lib/motion";

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, className = "" }) => {
  const cardRef = useRef<HTMLElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(tour.slug);
  const isBookable = tour.status === "available" || tour.status === "limited";
  const destObj = DESTINATIONS.find(
    (d) =>
      d.slug.toLowerCase() === tour.destination.toLowerCase() ||
      d.name.toLowerCase() === tour.destination.toLowerCase()
  );
  const destName = destObj ? destObj.name : tour.destination;

  // 3D Tilt micro-interaction for desktop
  useEffect(() => {
    if (!cardRef.current || isReducedMotion()) return;
    const cleanup = setupCardTilt(cardRef.current);
    return cleanup;
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // GSAP micro-bounce animation on favorite toggle
    if (!isReducedMotion()) {
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.7 },
        { scale: 1.25, duration: 0.28, yoyo: true, repeat: 1, ease: "back.out(2)" }
      );
    }

    toggleFavorite(tour.slug, tour.title);
  };

  return (
    <div className={`tour-card-wrap ${className}`}>
      <article
        ref={cardRef}
        className={`tour-card ${!isBookable ? "is-unavailable" : ""}`}
        aria-labelledby={`tour-title-${tour.slug}`}
      >
        <div className="card-media">
          <ResponsiveImage
            name={tour.images[0] || "hero-cappadocia"}
            alt={tour.title}
            sizes="(min-width: 1200px) 380px, (min-width: 768px) 50vw, 100vw"
          />

          <div className="card-flags">
            <TierBadge tier={tour.tier} />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--r-pill)",
                background: "rgba(238, 240, 234, 0.9)",
                color: "var(--lagoon-800)",
                backdropFilter: "blur(4px)",
              }}
            >
              {destName}
            </span>
          </div>

          <div className="card-fav">
            <button
              type="button"
              className="fav-btn"
              onClick={handleFavoriteClick}
              aria-pressed={favorited}
              aria-label={
                favorited
                  ? `Remove ${tour.title} from saved journeys`
                  : `Save ${tour.title} to journeys`
              }
            >
              <Icon
                name={favorited ? "heartFill" : "heart"}
                size={22}
                aria-hidden="true"
              />
            </button>
          </div>

          {tour.status !== "available" && (
            <div className="card-status">
              <StatusBadge status={tour.status} note={tour.statusNote} />
            </div>
          )}
        </div>

        <div>
          <div className="card-meta">
            <span>
              <Icon name="clock" size={15} aria-hidden="true" />
              {tour.durationLabel}
            </span>
            <span>
              <Icon name="users" size={15} aria-hidden="true" />
              Up to {tour.groupMax} guests
            </span>
          </div>

          <h3 id={`tour-title-${tour.slug}`}>
            <Link to={`/tours/${tour.slug}`}>
              {tour.title}
            </Link>
          </h3>

          <p
            className="muted"
            style={{
              fontSize: "0.93rem",
              marginTop: "0.4rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tour.summary}
          </p>
        </div>

        <div className="card-foot">
          <div className="price">
            <small>
              From{" "}
            </small>
            <strong>{formatCurrency(tour.price)}</strong>
            <small>
              {tour.pricing === "person" ? " / guest" : " / charter"}
            </small>
          </div>

          <div className="rating" aria-label={`Rating ${tour.rating} out of 5 stars`}>
            <Icon name="star" size={15} aria-hidden="true" />
            <span>{tour.rating.toFixed(1)}</span>
            <span style={{ color: "var(--fg-muted)", fontSize: "0.82rem" }}>
              ({tour.reviews})
            </span>
          </div>
        </div>
      </article>
    </div>
  );
};
