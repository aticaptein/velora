import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/common/Icon";

export const NotFoundPage: React.FC = () => {
  return (
    <div
      className="not-found-page wrap"
      style={{
        paddingTop: "calc(var(--header-h) + 4rem)",
        paddingBottom: "8rem",
        textAlign: "center",
        maxWidth: "680px",
        marginInline: "auto",
      }}
    >
      <p className="kicker" style={{ color: "var(--saffron)" }}>ERROR 404</p>
      <h1 className="display" style={{ marginTop: "0.5rem" }}>
        A Path Less Travelled
      </h1>
      <p className="lede" style={{ marginBlock: "1.2rem auto", color: "var(--fg-muted)" }}>
        The coordinates you entered do not match any known route in our atlas. Perhaps it was reshaped by wind, or perhaps it awaits discovery.
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2.5rem" }}>
        <Link to="/" className="btn btn-accent">
          <Icon name="home" size={18} aria-hidden="true" />
          <span>Return Home</span>
        </Link>
        <Link to="/tours" className="btn btn-ghost">
          <Icon name="compass" size={18} aria-hidden="true" />
          <span>Explore All 30 Journeys</span>
        </Link>
      </div>

      <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid var(--line)" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Popular Waypoints</h2>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/destinations/cappadocia" className="chip">Cappadocia</Link>
          <Link to="/destinations/istanbul" className="chip">Istanbul</Link>
          <Link to="/destinations/paris" className="chip">Paris</Link>
          <Link to="/tours?category=yacht" className="chip">Yacht Charters</Link>
          <Link to="/destinations" className="chip">All 13 Regions</Link>
        </div>
      </div>
    </div>
  );
};
