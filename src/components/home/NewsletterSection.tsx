import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { Icon } from "../common/Icon";
import { gsap, revealOnScroll, isReducedMotion } from "../../lib/motion";

export const NewsletterSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".newsletter-card", {
        trigger: containerRef.current,
        y: 36,
        duration: 0.9,
      });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (submitted && !isReducedMotion()) {
      gsap.fromTo(
        ".newsletter-success",
        { scale: 0.92, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)" }
      );
    }
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <section ref={containerRef} className="section" aria-labelledby="newsletter-heading">
      <div className="wrap">
        <div
          className="newsletter-card"
          style={{
            background: "var(--salt-50)",
            border: "1.5px solid var(--line-strong)",
            borderRadius: "var(--r-lg)",
            padding: "clamp(2rem, 5vw, 4.5rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
            gap: "2.5rem",
            alignItems: "center",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <div>
            <p className="kicker">THE VELORA DISPATCH</p>
            <h2 id="newsletter-heading" className="display" style={{ marginTop: "0.4rem" }}>
              Letters on the Art of Travel
            </h2>
            <p className="muted" style={{ marginTop: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>
              Twice a month, our field scouts send an unvarnished report: newly discovered olive oil mills in Crete, walking trails reopened in the Alps, and seasonal departures before they appear in catalogs.
            </p>
          </div>

          <div>
            {submitted ? (
              <div
                className="newsletter-success"
                style={{
                  padding: "1.5rem 2rem",
                  borderRadius: "var(--r-md)",
                  background: "rgba(47, 107, 79, 0.12)",
                  color: "var(--st-available)",
                  border: "1.5px solid rgba(47, 107, 79, 0.3)",
                }}
              >
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <Icon name="check" size={24} aria-hidden="true" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>You're on the list</h3>
                </div>
                <p style={{ marginTop: "0.5rem", color: "var(--fg)" }}>
                  Thank you. A sample edition has been dispatched to <strong>{email}</strong> in this interactive demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                <div className="field">
                  <label htmlFor="newsletter-email" className="field-label">
                    Your email address
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="e.g. eleanor@meridian.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      style={{ flex: "1 1 240px" }}
                    />
                    <button type="submit" className="btn btn-accent">
                      <span>Join Dispatch</span>
                      <Icon name="arrowRight" size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="muted" style={{ fontSize: "0.82rem" }}>
                  Zero spam. Unsubscribe with one click anytime. Demo simulation only.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
