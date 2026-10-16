import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { TOURS } from "../data/tours";
import { TourGallery } from "../components/tour/TourGallery";
import { ItineraryList } from "../components/tour/ItineraryList";
import { BookingWidget } from "../components/tour/BookingWidget";
import { TourCard } from "../components/tour/TourCard";
import { TierBadge } from "../components/common/TierBadge";
import { StatusBadge } from "../components/common/StatusBadge";
import { Icon } from "../components/common/Icon";
import { useFavorites } from "../context/FavoritesContext";
import { DemoNotice } from "../components/common/DemoNotice";
import { DESTINATIONS } from "../data/destinations";
import { gsap, isReducedMotion } from "../lib/motion";

export const TourDetailPage: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const tour = TOURS.find((t) => t.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useGSAP(
    () => {
      if (isReducedMotion() || !tour) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".detail-header-block",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          ".detail-stats-bar",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".detail-gallery-block",
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ".detail-widget-block",
          { autoAlpha: 0, x: 25 },
          { autoAlpha: 1, x: 0, duration: 0.8 },
          "-=0.5"
        );
    },
    { scope: containerRef, dependencies: [slug] }
  );

  if (!tour) {
    return (
      <div className="wrap section" style={{ textAlign: "center", paddingBlock: "8rem" }}>
        <h1 className="h-xl">Journey Not Found</h1>
        <p className="muted" style={{ marginBlock: "1rem" }}>
          We could not locate this itinerary in our current catalog.
        </p>
        <Link to="/tours" className="btn btn-accent">
          <span>Return to All Journeys</span>
          <Icon name="arrowRight" size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(tour.slug);
  const destObj = DESTINATIONS.find(
    (d) =>
      d.slug.toLowerCase() === tour.destination.toLowerCase() ||
      d.name.toLowerCase() === tour.destination.toLowerCase()
  );
  const destName = destObj ? destObj.name : tour.destination;
  const destSlug = destObj ? destObj.slug : tour.destination.toLowerCase();

  // Related tours in same destination or category
  const relatedTours = TOURS.filter(
    (t) =>
      t.slug !== tour.slug &&
      (t.destination === tour.destination ||
        t.categories.some((c) => tour.categories.includes(c)))
  ).slice(0, 3);

  return (
    <article ref={containerRef} className="tour-detail-page" style={{ paddingBottom: "var(--sp-9)" }}>
      {/* Top Banner / Breadcrumb */}
      <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + 1.5rem)" }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tours">Tours</Link></li>
            <li><Link to={`/destinations/${destSlug}`}>{destName}</Link></li>
            <li><span aria-current="page">{tour.title}</span></li>
          </ol>
        </nav>

        <div className="detail-header-block" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <TierBadge tier={tour.tier} />
              <StatusBadge status={tour.status} note={tour.statusNote} />
            </div>
            <h1 className="h-xl" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              {tour.title}
            </h1>
            <p className="muted" style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
              {tour.summary}
            </p>
          </div>

          <button
            type="button"
            className="fav-btn"
            onClick={() => toggleFavorite(tour.slug, tour.title)}
            aria-pressed={favorited}
            aria-label={favorited ? "Remove from saved journeys" : "Save journey"}
            style={{ width: "52px", height: "52px" }}
          >
            <Icon
              name={favorited ? "heartFill" : "heart"}
              size={24}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div
          className="detail-stats-bar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            padding: "1rem 1.4rem",
            background: "var(--salt-50)",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--line)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Icon name="clock" size={20} style={{ color: "var(--saffron)" }} aria-hidden="true" />
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>Duration</span>
              <strong style={{ fontSize: "0.95rem" }}>{tour.durationLabel}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Icon name="pin" size={20} style={{ color: "var(--saffron)" }} aria-hidden="true" />
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>Location</span>
              <strong style={{ fontSize: "0.95rem" }}>{destName}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Icon name="users" size={20} style={{ color: "var(--saffron)" }} aria-hidden="true" />
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>Group Limit</span>
              <strong style={{ fontSize: "0.95rem" }}>Max {tour.groupMax} guests</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Icon name="star" size={20} style={{ color: "var(--saffron)" }} aria-hidden="true" />
            <div>
              <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>Rating</span>
              <strong style={{ fontSize: "0.95rem" }}>{tour.rating.toFixed(1)} / 5.0 ({tour.reviews} reviews)</strong>
            </div>
          </div>
        </div>

        <DemoNotice compact />
      </div>

      {/* Main Content Layout with 2 Columns (Content + Sticky Booking Widget) */}
      <div className="wrap" style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.85fr)",
            gap: "clamp(2rem, 4vw, 4rem)",
            alignItems: "start",
          }}
        >
          {/* Main Story Column */}
          <div style={{ display: "grid", gap: "3rem" }}>
            {/* Gallery */}
            <div className="detail-gallery-block">
              <TourGallery images={tour.images} title={tour.title} />
            </div>

            {/* Overview */}
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" style={{ fontSize: "var(--step-3)", marginBottom: "1rem" }}>
                Overview
              </h2>
              <p style={{ fontSize: "1.08rem", lineHeight: 1.7, color: "var(--fg)" }}>
                {tour.overview}
              </p>
            </section>

            {/* Signature Highlights */}
            <section aria-labelledby="highlights-heading">
              <h2 id="highlights-heading" style={{ fontSize: "var(--step-3)", marginBottom: "1.2rem" }}>
                Journey Highlights
              </h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {tour.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                      padding: "0.8rem 1rem",
                      background: "var(--salt-50)",
                      borderRadius: "var(--r-md)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--saffron)",
                        marginTop: "0.15rem",
                        flex: "none",
                      }}
                    >
                      <Icon name="check" size={18} aria-hidden="true" />
                    </span>
                    <span style={{ fontSize: "0.98rem", lineHeight: 1.5 }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Day-by-Day Itinerary */}
            <ItineraryList stops={tour.itinerary} />

            {/* Included & Excluded Services */}
            <section
              aria-labelledby="services-heading"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "2rem",
                padding: "2rem",
                background: "var(--salt-50)",
                borderRadius: "var(--r-lg)",
                border: "1.5px solid var(--line)",
              }}
            >
              <div>
                <h3
                  id="services-heading"
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--st-available)",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon name="check" size={20} aria-hidden="true" />
                  <span>What's Included</span>
                </h3>
                <ul role="list" style={{ display: "grid", gap: "0.6rem" }}>
                  {tour.included.map((item, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.92rem", lineHeight: 1.45 }}>
                      <span style={{ color: "var(--st-available)", fontWeight: 700 }}>&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--fg-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon name="x" size={20} aria-hidden="true" />
                  <span>What's Excluded</span>
                </h3>
                <ul role="list" style={{ display: "grid", gap: "0.6rem" }}>
                  {tour.excluded.map((item, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.92rem", lineHeight: 1.45, color: "var(--fg-muted)" }}>
                      <span>&ndash;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Practical Information */}
            <section aria-labelledby="practical-heading">
              <h2 id="practical-heading" style={{ fontSize: "var(--step-3)", marginBottom: "1rem" }}>
                Practical Information
              </h2>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                {tour.info.map((note, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      fontSize: "0.95rem",
                      color: "var(--fg-muted)",
                      padding: "0.6rem 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <Icon name="info" size={18} style={{ color: "var(--lagoon-400)", flex: "none", marginTop: "0.15rem" }} aria-hidden="true" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget Sidebar */}
          <aside
            className="detail-widget-block"
            style={{
              position: "sticky",
              top: "calc(var(--header-h) + 1.5rem)",
            }}
            aria-label="Reservation options"
          >
            <BookingWidget tour={tour} />
          </aside>
        </div>

        {/* Related Tours Section */}
        {relatedTours.length > 0 && (
          <section style={{ marginTop: "6rem", paddingTop: "4rem", borderTop: "1.5px solid var(--line)" }} aria-labelledby="related-heading">
            <h2 id="related-heading" className="h-xl" style={{ marginBottom: "2rem" }}>
              Journeys in the Same Spirit
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                gap: "2rem",
              }}
            >
              {relatedTours.map((relTour) => (
                <TourCard key={relTour.slug} tour={relTour} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
