import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { DemoNotice } from "../components/common/DemoNotice";

export const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="contact-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Contact &amp; Concierge</span></li>
          </ol>
        </nav>

        <h1 className="display">Speak With a Curator</h1>
        <p className="lede">
          Our desks in Istanbul, Paris, and Tokyo answer inquiries personally. No automated phone trees or chat bots.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>
      </div>

      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
          }}
        >
          {/* Inquiry Form */}
          <div
            style={{
              background: "var(--salt-50)",
              border: "1.5px solid var(--line-strong)",
              borderRadius: "var(--r-lg)",
              padding: "clamp(1.5rem, 4vw, 3rem)",
              boxShadow: "var(--shadow-float)",
            }}
          >
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "0.5rem" }}>
              Send a Dispatch
            </h2>
            <p className="muted" style={{ fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              We typically reply within 4 business hours with bespoke suggestions.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: "2rem",
                  borderRadius: "var(--r-md)",
                  background: "rgba(47, 107, 79, 0.12)",
                  color: "var(--st-available)",
                  border: "1.5px solid rgba(47, 107, 79, 0.3)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(47, 107, 79, 0.2)",
                    display: "grid",
                    placeItems: "center",
                    marginInline: "auto",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon name="check" size={24} aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Dispatch Received (Demo)</h3>
                <p style={{ marginTop: "0.5rem", color: "var(--fg)" }}>
                  Thank you, <strong>{name}</strong>. In this interactive demo simulation, your message has been logged.
                </p>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: "1.5rem" }}
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                >
                  <span>Send another message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
                {error && (
                  <div className="error-text" style={{ padding: "0.8rem", background: "#fbecea", borderRadius: "var(--r-sm)" }}>
                    <Icon name="alert" size={18} aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="contact-name" className="field-label">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Thorne"
                  />
                </div>

                <div className="field">
                  <label htmlFor="contact-email" className="field-label">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. julian@meridian.com"
                  />
                </div>

                <div className="field">
                  <label htmlFor="contact-subject" className="field-label">
                    Nature of Inquiry
                  </label>
                  <select
                    id="contact-subject"
                    className="select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="general">General Tour Inquiries</option>
                    <option value="private">Private Gulet / Yacht Charter</option>
                    <option value="custom">Custom Family or Group Route</option>
                    <option value="press">Press, Editorial &amp; Partnerships</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="contact-message" className="field-label">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    className="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what destination, dates, or travel style you're envisioning..."
                  />
                </div>

                <button type="submit" className="btn btn-accent btn-block" style={{ minHeight: "50px" }}>
                  <span>Send Dispatch (Demo)</span>
                  <Icon name="arrowRight" size={18} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>

          {/* Regional Concierge Desks */}
          <div style={{ display: "grid", gap: "2rem" }}>
            <div>
              <p className="kicker">DIRECT CONTACT</p>
              <h2 className="h-md" style={{ marginTop: "0.4rem" }}>
                Global Concierge Numbers
              </h2>
              <p className="muted" style={{ marginTop: "0.5rem" }}>
                Active travelers on departures have direct line access 24/7.
              </p>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  padding: "1.2rem 1.4rem",
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--lagoon-800)", color: "var(--salt)", display: "grid", placeItems: "center" }}>
                  <Icon name="phone" size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>Istanbul Flagship</h3>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>+90 212 555 0192 &bull; Mon–Sat 08:00–20:00 TRT</p>
                </div>
              </div>

              <div
                style={{
                  padding: "1.2rem 1.4rem",
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--lagoon-800)", color: "var(--salt)", display: "grid", placeItems: "center" }}>
                  <Icon name="phone" size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>Paris Office</h3>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>+33 1 42 68 55 00 &bull; Mon–Fri 09:00–18:00 CET</p>
                </div>
              </div>

              <div
                style={{
                  padding: "1.2rem 1.4rem",
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--lagoon-800)", color: "var(--salt)", display: "grid", placeItems: "center" }}>
                  <Icon name="mail" size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>General Inquiries</h3>
                  <p className="muted" style={{ fontSize: "0.88rem" }}>concierge@velora-travel.demo</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "var(--r-md)", background: "rgba(227, 167, 47, 0.12)", border: "1px solid rgba(227, 167, 47, 0.3)" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--lagoon-900)" }}>Have a Booking Reference?</h3>
              <p style={{ fontSize: "0.9rem", marginTop: "0.3rem", color: "var(--fg)" }}>
                You can view real-time held dates and cancel simulated bookings directly on the portal.
              </p>
              <Link to="/manage-booking" className="text-link" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                <span>Lookup your booking</span>
                <Icon name="arrowRight" size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
