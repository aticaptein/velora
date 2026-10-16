import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../common/Icon";
import { DESTINATIONS } from "../../data/destinations";
import { CATEGORIES } from "../../data/categories";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-statement">
              The world, travelled with intention.
            </p>
            <p className="muted" style={{ maxWidth: "38ch", marginTop: "1.2rem", fontSize: "0.95rem" }}>
              VELORA curates thoughtful journeys from Istanbul rooftops to Arctic fjords — for curious travelers seeking depth over spectacle.
            </p>

            {/* Newsletter Dispatch Demo */}
            <div style={{ marginTop: "2rem", maxWidth: "420px" }}>
              <h2 style={{ fontSize: "1rem", color: "var(--seaglass)", marginBottom: "0.6rem" }}>
                The Travel Journal Dispatch
              </h2>
              {subscribed ? (
                <div style={{ padding: "0.8rem 1.2rem", borderRadius: "var(--r-md)", background: "rgba(157, 191, 180, 0.15)", color: "var(--seaglass)" }}>
                  <p style={{ fontWeight: 600 }}>Welcome to our reader circle.</p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "0.2rem" }}>
                    Illustrative demo subscription received for {email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <label htmlFor="footer-newsletter-input" className="sr-only">
                    Your email address
                  </label>
                  <input
                    id="footer-newsletter-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input"
                    style={{ flex: "1 1 200px", minHeight: "46px", background: "rgba(255, 255, 255, 0.08)", color: "#fff", borderColor: "rgba(238, 240, 234, 0.2)" }}
                  />
                  <button type="submit" className="btn btn-accent btn-sm">
                    <span>Subscribe</span>
                    <Icon name="arrowRight" size={16} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="footer-cols">
            <div>
              <h2>Destinations</h2>
              <ul role="list">
                {DESTINATIONS.slice(0, 6).map((d) => (
                  <li key={d.slug}>
                    <Link to={`/destinations/${d.slug}`}>{d.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/destinations" style={{ color: "var(--saffron-300)" }}>
                    All 13 destinations &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>Featured Styles</h2>
              <ul role="list">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link to={`/tours?category=${c.id}`}>{c.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/tours" style={{ color: "var(--saffron-300)" }}>
                    All 16 categories &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>Agency & Trust</h2>
              <ul role="list">
                <li><Link to="/about">Our Philosophy</Link></li>
                <li><Link to="/manage-booking">Manage Bookings</Link></li>
                <li><Link to="/favorites">Saved Journeys</Link></li>
                <li><Link to="/faq">Frequently Asked</Link></li>
                <li><Link to="/contact">Concierge & Offices</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Architectural Wordmark Outline */}
        <div className="footer-giant" aria-hidden="true">
          VELORA
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} VELORA International. Crafted with devotion for travelers everywhere.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link to="/about">Manifesto</Link>
            <Link to="/faq">Guarantees</Link>
            <Link to="/contact">Emergency Desk</Link>
            <span style={{ opacity: 0.7 }}>Demonstration Website</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
