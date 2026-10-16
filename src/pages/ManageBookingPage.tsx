import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
import { Icon } from "../components/common/Icon";
import { formatCurrency, formatDateString } from "../lib/format";
import { Dialog } from "../components/common/Dialog";
import { DemoNotice } from "../components/common/DemoNotice";

export const ManageBookingPage: React.FC = () => {
  const { bookings, cancelBooking, getBookingByRef } = useBookings();
  const [searchRef, setSearchRef] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<ReturnType<typeof getBookingByRef> | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelTargetRef, setCancelTargetRef] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;
    const found = getBookingByRef(searchRef.trim());
    setSearchedBooking(found);
    setHasSearched(true);
  };

  const handleConfirmCancel = () => {
    if (cancelTargetRef) {
      cancelBooking(cancelTargetRef);
      if (searchedBooking && searchedBooking.reference === cancelTargetRef) {
        setSearchedBooking({ ...searchedBooking, status: "cancelled" });
      }
      setCancelTargetRef(null);
    }
  };

  return (
    <div className="manage-booking-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Manage Bookings</span></li>
          </ol>
        </nav>

        <h1 className="display">Manage Your Journeys</h1>
        <p className="lede">
          Lookup a simulated reservation by reference code, view itinerary details, or simulate a cancellation.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>
      </div>

      <div className="wrap">
        {/* Lookup Box */}
        <div
          style={{
            maxWidth: "600px",
            background: "var(--salt-50)",
            padding: "2rem",
            borderRadius: "var(--r-lg)",
            border: "1.5px solid var(--line-strong)",
            marginBottom: "3rem",
            boxShadow: "0 10px 25px rgba(10,33,36,0.06)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Find Your Booking</h2>
          <p className="muted" style={{ fontSize: "0.92rem", marginBottom: "1.2rem" }}>
            Enter your 12-character booking reference (e.g. <code>VEL-2026-X8P2</code>)
          </p>

          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <label htmlFor="booking-ref-input" className="sr-only">
              Booking Reference
            </label>
            <input
              id="booking-ref-input"
              type="text"
              className="input"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="e.g. VEL-2026-8942"
              style={{ flex: "1 1 200px", textTransform: "uppercase" }}
              required
            />
            <button type="submit" className="btn btn-accent">
              <Icon name="search" size={18} aria-hidden="true" />
              <span>Lookup</span>
            </button>
          </form>

          {hasSearched && !searchedBooking && (
            <div
              style={{
                marginTop: "1.2rem",
                padding: "1rem",
                borderRadius: "var(--r-md)",
                background: "rgba(181, 72, 47, 0.1)",
                color: "var(--clay)",
                fontSize: "0.95rem",
              }}
            >
              No simulated reservation found with reference <strong>{searchRef}</strong>. Please check the code or review your recent bookings below.
            </div>
          )}
        </div>

        {/* Searched Booking Highlight */}
        {searchedBooking && (
          <div style={{ marginBottom: "3.5rem" }}>
            <h2 className="h-md" style={{ marginBottom: "1rem" }}>Lookup Result</h2>
            <BookingCard
              booking={searchedBooking}
              onCancelRequest={(ref) => setCancelTargetRef(ref)}
            />
          </div>
        )}

        {/* All Recent Simulated Bookings */}
        <div>
          <h2 className="h-md" style={{ marginBottom: "1.5rem" }}>
            Recent Simulated Bookings ({bookings.length})
          </h2>

          {bookings.length === 0 ? (
            <div className="empty">
              <Icon name="ticket" className="empty-icon" size={48} aria-hidden="true" />
              <h3>No bookings created yet</h3>
              <p>
                Browse our curated experiences and complete a quick simulated booking to test the reservation flow.
              </p>
              <Link to="/tours" className="btn btn-accent" style={{ marginTop: "1rem" }}>
                <span>Explore Tours</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancelRequest={(ref) => setCancelTargetRef(ref)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <Dialog
        isOpen={Boolean(cancelTargetRef)}
        onClose={() => setCancelTargetRef(null)}
        title="Simulate Booking Cancellation"
      >
        <p className="muted" style={{ lineHeight: 1.6 }}>
          Are you sure you want to cancel booking reference <strong>{cancelTargetRef}</strong>? In this demo simulation, the status will immediately update to <em>Cancelled</em> and held seats will be released.
        </p>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setCancelTargetRef(null)}
          >
            Keep Reservation
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleConfirmCancel}
          >
            Confirm Cancellation
          </button>
        </div>
      </Dialog>
    </div>
  );
};

interface BookingCardProps {
  booking: ReturnType<ReturnType<typeof useBookings>["getBookingByRef"]> & object;
  onCancelRequest: (ref: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancelRequest }) => {
  const isCancelled = booking.status === "cancelled";

  return (
    <article
      style={{
        background: "var(--salt-50)",
        border: `1.5px solid ${isCancelled ? "var(--clay)" : "var(--line-strong)"}`,
        borderRadius: "var(--r-lg)",
        padding: "clamp(1.2rem, 3vw, 2rem)",
        display: "grid",
        gap: "1.2rem",
        boxShadow: "0 8px 24px rgba(10,33,36,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "0.25rem 0.65rem",
              borderRadius: "var(--r-pill)",
              fontSize: "0.8rem",
              fontWeight: 700,
              background: isCancelled ? "rgba(181, 72, 47, 0.15)" : "rgba(47, 107, 79, 0.15)",
              color: isCancelled ? "var(--clay)" : "var(--st-available)",
              marginBottom: "0.4rem",
            }}
          >
            {isCancelled ? "CANCELLED" : "CONFIRMED"}
          </span>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 600 }}>{booking.tourTitle}</h3>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            Destination: {booking.destination} &bull; Ref: <strong>{booking.reference}</strong>
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--lagoon-800)" }}>
            {formatCurrency(booking.totalPrice)}
          </div>
          <span className="muted" style={{ fontSize: "0.82rem" }}>
            {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ""}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          padding: "1rem",
          background: "var(--white)",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--line)",
          fontSize: "0.9rem",
        }}
      >
        <div>
          <span className="muted" style={{ display: "block", fontSize: "0.8rem" }}>Departure Date</span>
          <strong>{formatDateString(booking.departureDate)}</strong>
        </div>
        <div>
          <span className="muted" style={{ display: "block", fontSize: "0.8rem" }}>Service Tier</span>
          <strong>{booking.packageName}</strong>
        </div>
        <div>
          <span className="muted" style={{ display: "block", fontSize: "0.8rem" }}>Lead Guest</span>
          <strong>{booking.passenger.fullName}</strong>
        </div>
        <div>
          <span className="muted" style={{ display: "block", fontSize: "0.8rem" }}>Booked On</span>
          <span>{formatDateString(booking.createdAt.split("T")[0])}</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "0.5rem" }}>
        <Link to={`/tours/${booking.tourSlug}`} className="text-link" style={{ fontSize: "0.9rem" }}>
          <span>View Tour Itinerary</span>
          <Icon name="arrowRight" size={14} aria-hidden="true" />
        </Link>

        {!isCancelled && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onCancelRequest(booking.reference)}
          >
            <Icon name="trash" size={14} aria-hidden="true" />
            <span>Cancel Reservation</span>
          </button>
        )}
      </div>
    </article>
  );
};
