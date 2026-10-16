import React from "react";
import { Link } from "react-router-dom";
import { ResponsiveImage } from "../components/common/ResponsiveImage";
import { Icon } from "../components/common/Icon";
import { DemoNotice } from "../components/common/DemoNotice";

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">About VELORA</span></li>
          </ol>
        </nav>

        <h1 className="display">The Art of Travel</h1>
        <p className="lede">
          Founded in Istanbul and Paris with a single conviction: the best journeys leave both traveler and host richer for having met.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>
      </div>

      <div className="wrap">
        {/* Hero Visual Section */}
        <div
          style={{
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            aspectRatio: "21 / 9",
            maxHeight: "520px",
            boxShadow: "var(--shadow-float)",
            marginBottom: "4rem",
          }}
        >
          <ResponsiveImage
            name="story-2"
            alt="Old town alleyways in Istanbul at sunset"
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
          />
        </div>

        {/* Narrative Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
            marginBottom: "5rem",
          }}
        >
          <div>
            <p className="kicker">OUR GENESIS</p>
            <h2 className="h-lg" style={{ marginTop: "0.4rem" }}>
              Born from a Dislike of Rushed Tourism
            </h2>
            <div className="prose" style={{ marginTop: "1.2rem", lineHeight: 1.7, fontSize: "1.05rem" }}>
              <p>
                In 2018, our founders walked the Lycian Way together. What stuck was not the major Roman amphitheaters (impressive though they were), but breakfast in a small mountain village where grandmother Zehra served hot flatbread with fresh thyme honey and wild figs.
              </p>
              <p>
                Standard travel agencies promised "see 12 cities in 7 days." We realized that modern travelers don't lack options — they lack depth, honest pacing, and direct access to native culture.
              </p>
              <p>
                VELORA was created as an antidote. We craft journeys spanning accessible day excursions to high-end bespoke charters, unified by one principle: every hour on our itinerary has a reason to exist.
              </p>
            </div>
          </div>

          <div
            style={{
              background: "var(--salt-50)",
              border: "1.5px solid var(--line)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            <h3 style={{ fontSize: "var(--step-2)", marginBottom: "1rem" }}>
              The Four Principles
            </h3>
            <div style={{ display: "grid", gap: "1.2rem" }}>
              <div>
                <strong style={{ display: "block", color: "var(--lagoon-800)", fontSize: "1.05rem" }}>
                  1. The Cap of 12
                </strong>
                <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  Group sizes are strictly limited so conversations remain human and local shops aren't overwhelmed.
                </p>
              </div>

              <div>
                <strong style={{ display: "block", color: "var(--lagoon-800)", fontSize: "1.05rem" }}>
                  2. Honest Living Rates
                </strong>
                <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  We contract directly with family-run taverns, licensed historians, and boat captains, ensuring 80%+ of tour revenue stays directly in the host community.
                </p>
              </div>

              <div>
                <strong style={{ display: "block", color: "var(--lagoon-800)", fontSize: "1.05rem" }}>
                  3. Unscheduled White Space
                </strong>
                <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  We design free afternoons into every multi-day route so you have time to wander without a schedule.
                </p>
              </div>

              <div>
                <strong style={{ display: "block", color: "var(--lagoon-800)", fontSize: "1.05rem" }}>
                  4. Complete Price Transparency
                </strong>
                <p className="muted" style={{ fontSize: "0.95rem", marginTop: "0.2rem" }}>
                  No mandatory factory visits, no high-pressure carpets, and zero hidden checkout fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Founding Desks Strip */}
        <section
          style={{
            background: "var(--lagoon-900)",
            color: "var(--salt)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px", marginInline: "auto", marginBottom: "3rem" }}>
            <p className="kicker" style={{ color: "var(--seaglass)" }}>OUR GLOBAL DESKS</p>
            <h2 className="display" style={{ marginTop: "0.4rem", color: "var(--salt)" }}>
              Rooted Where We Guide
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}
          >
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--r-md)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--saffron)" }}>Istanbul Desk</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--seaglass)", marginTop: "0.3rem" }}>Karaköy, Beyoğlu</p>
              <p style={{ fontSize: "0.92rem", marginTop: "0.8rem", color: "rgba(238,240,234,0.85)", lineHeight: 1.6 }}>
                Our flagship headquarters overseeing Cappadocia balloon operations, Aegean gulet charters, and Bosphorus cultural walks.
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--r-md)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--saffron)" }}>Paris Desk</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--seaglass)", marginTop: "0.3rem" }}>Le Marais, 4e Arrondissement</p>
              <p style={{ fontSize: "0.92rem", marginTop: "0.8rem", color: "rgba(238,240,234,0.85)", lineHeight: 1.6 }}>
                Curating culinary walking routes, Swiss alpine ski excursions, and Mediterranean coastal retreats across Southern Europe.
              </p>
            </div>

            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--r-md)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--saffron)" }}>Tokyo Desk</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--seaglass)", marginTop: "0.3rem" }}>Yanaka, Taito City</p>
              <p style={{ fontSize: "0.92rem", marginTop: "0.8rem", color: "rgba(238,240,234,0.85)", lineHeight: 1.6 }}>
                Direct liaison with temple lodges in Kyoto, local ramen masters in Shinjuku, and artisan workshops in Kanazawa.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
          <h2 className="h-lg">Ready to Discover?</h2>
          <p className="muted" style={{ marginTop: "0.5rem" }}>Explore our 30 active itineraries across 13 regions.</p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/tours" className="btn btn-accent">
              <span>View All Tours</span>
              <Icon name="arrowRight" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
