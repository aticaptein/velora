import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DESTINATIONS } from "../data/destinations";
import { TOURS } from "../data/tours";
import { ResponsiveImage } from "../components/common/ResponsiveImage";
import { TourGrid } from "../components/tour/TourGrid";
import { DemoNotice } from "../components/common/DemoNotice";

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const destination = DESTINATIONS.find((d) => d.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!destination) {
    return (
      <div className="wrap section" style={{ textAlign: "center", paddingBlock: "8rem" }}>
        <h1 className="h-xl">Destination Not Found</h1>
        <p className="muted" style={{ marginBlock: "1rem" }}>
          We could not locate this destination in our current directory.
        </p>
        <Link to="/destinations" className="btn btn-accent">
          <span>Return to All Destinations</span>
        </Link>
      </div>
    );
  }

  const destinationTours = TOURS.filter(
    (t) => t.destination.toLowerCase() === destination.name.toLowerCase()
  );

  return (
    <div className="destination-detail-page" style={{ paddingBottom: "var(--sp-9)" }}>
      {/* Hero Header with Panoramic Photo */}
      <section
        className="is-dark"
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingTop: "calc(var(--header-h) + 3rem)",
          paddingBottom: "var(--sp-8)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <ResponsiveImage
            name={destination.images[0] || "hero-cappadocia"}
            alt={destination.name}
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,33,36,0.5) 0%, rgba(10,33,36,0.85) 90%)",
            }}
          />
        </div>

        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <nav className="crumbs" aria-label="Breadcrumb" style={{ color: "var(--seaglass)" }}>
            <ol>
              <li><Link to="/" style={{ color: "var(--salt)" }}>Home</Link></li>
              <li><Link to="/destinations" style={{ color: "var(--salt)" }}>Destinations</Link></li>
              <li><span aria-current="page" style={{ color: "var(--saffron-300)" }}>{destination.name}</span></li>
            </ol>
          </nav>

          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 0.8rem",
              borderRadius: "var(--r-pill)",
              background: "rgba(238, 240, 234, 0.2)",
              backdropFilter: "blur(6px)",
              color: "var(--saffron)",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "0.8rem",
            }}
          >
            {destination.region} &bull; {destination.country}
          </span>

          <h1 className="display" style={{ color: "var(--salt)", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            {destination.name}
          </h1>

          <p style={{ fontStyle: "italic", fontSize: "1.25rem", color: "var(--seaglass-200)", marginTop: "0.5rem", maxWidth: "60ch" }}>
            "{destination.tagline}"
          </p>
        </div>
      </section>

      <div className="wrap" style={{ marginTop: "1rem" }}>
        <DemoNotice compact />
      </div>

      {/* Guide Details Section */}
      <section className="wrap section-tight">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(2rem, 4vw, 4.5rem)",
            alignItems: "start",
          }}
        >
          <div>
            <p className="kicker">TERRITORY ESSAY</p>
            <h2 className="h-xl" style={{ marginTop: "0.4rem" }}>
              The Character of the Land
            </h2>
            <p style={{ marginTop: "1.2rem", fontSize: "1.08rem", lineHeight: 1.7, color: "var(--fg)" }}>
              {destination.intro}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                marginTop: "2.5rem",
                padding: "1.5rem",
                background: "var(--salt-50)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--line)",
              }}
            >
              <div>
                <span className="muted" style={{ fontSize: "0.82rem", display: "block" }}>Best Season</span>
                <strong style={{ fontSize: "0.95rem" }}>{destination.bestTime}</strong>
              </div>
              <div>
                <span className="muted" style={{ fontSize: "0.82rem", display: "block" }}>Typical Pace</span>
                <strong style={{ fontSize: "0.95rem" }}>{destination.pace}</strong>
              </div>
              <div>
                <span className="muted" style={{ fontSize: "0.82rem", display: "block" }}>Ideal For</span>
                <strong style={{ fontSize: "0.95rem" }}>{destination.idealFor}</strong>
              </div>
            </div>
          </div>

          {/* Signature Moments Card */}
          <div
            style={{
              background: "var(--salt-50)",
              border: "1.5px solid var(--line-strong)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "var(--shadow-float)",
            }}
          >
            <h3 style={{ fontSize: "var(--step-2)", marginBottom: "1.2rem" }}>
              Signature Experiences
            </h3>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {destination.moments.map((m, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--lagoon-800)",
                      color: "var(--salt)",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      flex: "none",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{m.title}</h4>
                    <p className="muted" style={{ fontSize: "0.92rem", marginTop: "0.2rem" }}>
                      {m.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destination Tours Section */}
      <section className="wrap section-tight" aria-labelledby="destination-tours-heading">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
          <div>
            <p className="kicker">AVAILABLE ITINERARIES</p>
            <h2 id="destination-tours-heading" className="h-xl" style={{ marginTop: "0.4rem" }}>
              Journeys in {destination.name} ({destinationTours.length})
            </h2>
          </div>
          <Link to="/tours" className="btn btn-ghost btn-sm">
            <span>View all other destinations</span>
          </Link>
        </div>

        <TourGrid
          tours={destinationTours}
          emptyMessage={`We are currently authoring new routes for ${destination.name}. Check back soon.`}
        />
      </section>
    </div>
  );
};
