import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { TOURS } from "../data/tours";
import { TourCard } from "../components/tour/TourCard";
import { Icon } from "../components/common/Icon";
import { Dialog } from "../components/common/Dialog";
import { DemoNotice } from "../components/common/DemoNotice";

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const favoritedTours = TOURS.filter((t) => favorites.includes(t.slug));

  return (
    <div className="favorites-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Saved Journeys</span></li>
          </ol>
        </nav>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="display">Saved Journeys</h1>
            <p className="lede">
              Your personal shortlist of destinations and itineraries, saved across sessions for comparison.
            </p>
          </div>

          {favoritedTours.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfirmClearOpen(true)}
              style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
            >
              <Icon name="trash" size={16} aria-hidden="true" />
              <span>Clear all saved ({favoritedTours.length})</span>
            </button>
          )}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>
      </div>

      <div className="wrap">
        {favoritedTours.length === 0 ? (
          <div className="empty" style={{ marginBlock: "3rem" }}>
            <Icon name="heart" className="empty-icon" size={54} aria-hidden="true" />
            <h2>No saved journeys yet</h2>
            <p>
              Tap the heart icon on any tour card or detail page to bookmark experiences you'd like to revisit or compare.
            </p>
            <Link to="/tours" className="btn btn-accent" style={{ marginTop: "1rem" }}>
              <span>Explore All 30 Journeys</span>
              <Icon name="arrowRight" size={16} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "2.5rem",
              marginTop: "1.5rem",
            }}
          >
            {favoritedTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for clearing */}
      <Dialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Clear all saved journeys?"
      >
        <p className="muted" style={{ lineHeight: 1.6 }}>
          This will remove all {favoritedTours.length} bookmarked itineraries from your saved list. This action cannot be undone.
        </p>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setConfirmClearOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              clearFavorites();
              setConfirmClearOpen(false);
            }}
          >
            Yes, clear all
          </button>
        </div>
      </Dialog>
    </div>
  );
};
