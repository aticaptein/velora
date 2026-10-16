import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "../../data/types";
import { EXTRAS } from "../../data/categories";
import { Stepper } from "../common/Stepper";
import { StatusBadge } from "../common/StatusBadge";
import { Icon } from "../common/Icon";
import { formatCurrency, formatDateString } from "../../lib/format";

interface BookingWidgetProps {
  tour: Tour;
  className?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ tour, className = "" }) => {
  const navigate = useNavigate();
  const isBookable = tour.status === "available" || tour.status === "limited";

  // Generate 8 realistic departure dates spaced by cadence
  const departureDates = useMemo(() => {
    const dates: { dateStr: string; seatsLeft: number }[] = [];
    const base = new Date();
    base.setDate(base.getDate() + 3); // starts in 3 days

    for (let i = 0; i < 8; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i * (tour.cadence || 3));
      const iso = d.toISOString().split("T")[0];
      // realistic seats left based on tour groupMax
      const seatsLeft = Math.max(1, Math.min(tour.groupMax, ((i * 3 + 2) % tour.groupMax) + 1));
      dates.push({ dateStr: iso, seatsLeft });
    }
    return dates;
  }, [tour.cadence, tour.groupMax]);

  const [selectedDate, setSelectedDate] = useState(departureDates[0]?.dateStr || "");
  const [selectedPackageId, setSelectedPackageId] = useState(
    tour.packages[0]?.id || "essential"
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const activePackage =
    tour.packages.find((p) => p.id === selectedPackageId) || tour.packages[0];
  const packageFactor = activePackage?.factor || 1.0;

  // Real-time dynamic pricing breakdown
  const pricingCalc = useMemo(() => {
    const baseAdultRate = tour.price * packageFactor;
    const baseChildRate = baseAdultRate * (tour.childRate || 0.6);

    let passengerTotal = 0;
    if (tour.pricing === "person") {
      passengerTotal = adults * baseAdultRate + children * baseChildRate;
    } else {
      passengerTotal = tour.price * packageFactor; // flat vehicle/boat charter rate
    }

    let extrasTotal = 0;
    for (const extraId of selectedExtras) {
      const extra = EXTRAS.find((e) => e.id === extraId);
      if (extra) {
        if (extra.per === "person") {
          extrasTotal += extra.price * (adults + children);
        } else {
          extrasTotal += extra.price;
        }
      }
    }

    const grandTotal = Math.round(passengerTotal + extrasTotal);

    return {
      baseAdultRate: Math.round(baseAdultRate),
      baseChildRate: Math.round(baseChildRate),
      passengerTotal: Math.round(passengerTotal),
      extrasTotal: Math.round(extrasTotal),
      grandTotal,
    };
  }, [tour, packageFactor, adults, children, selectedExtras]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProceed = () => {
    const params = new URLSearchParams({
      tour: tour.slug,
      date: selectedDate,
      adults: String(adults),
      children: String(children),
      pkg: selectedPackageId,
      extras: selectedExtras.join(","),
    });
    navigate(`/book/${tour.slug}?${params.toString()}`);
  };

  return (
    <div
      className={`booking-widget-card ${className}`}
      style={{
        background: "var(--salt-50)",
        border: "1.5px solid var(--line-strong)",
        borderRadius: "var(--r-lg)",
        padding: "clamp(1.2rem, 2.5vw, 2rem)",
        boxShadow: "var(--shadow-float)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <span className="muted" style={{ fontSize: "0.88rem" }}>
            {tour.pricing === "person" ? "Per adult traveler" : "Private vehicle charter"}
          </span>
          <div className="price" style={{ marginTop: "0.2rem" }}>
            <strong>{formatCurrency(pricingCalc.baseAdultRate)}</strong>
            <small> / {tour.pricing === "person" ? "guest" : "group"}</small>
          </div>
        </div>

        <StatusBadge status={tour.status} note={tour.statusNote} />
      </div>

      {!isBookable ? (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "var(--r-md)",
            background: "rgba(181, 72, 47, 0.1)",
            color: "var(--clay)",
            border: "1px solid rgba(181, 72, 47, 0.25)",
          }}
        >
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
            <Icon name="alert" size={20} style={{ flex: "none", marginTop: "0.1rem" }} aria-hidden="true" />
            <div>
              <p style={{ fontWeight: 700 }}>Departures Currently Closed</p>
              <p style={{ fontSize: "0.88rem", marginTop: "0.25rem", color: "var(--fg)" }}>
                {tour.status === "soldout"
                  ? "All reserved departures for this season are fully booked."
                  : tour.status === "cancelled"
                  ? "This route is temporarily suspended due to seasonal conditions."
                  : "Currently inactive. Join the waitlist or browse our open journeys."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
          {/* Departure Date Selector */}
          <div className="field">
            <label htmlFor="departure-date" className="field-label">
              Departure Date
            </label>
            <select
              id="departure-date"
              className="select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {departureDates.map((item) => (
                <option key={item.dateStr} value={item.dateStr}>
                  {formatDateString(item.dateStr)} ({item.seatsLeft} seats left)
                </option>
              ))}
            </select>
          </div>

          {/* Package Selection */}
          {tour.packages.length > 1 && (
            <div className="field">
              <span className="field-label">Service Package</span>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {tour.packages.map((pkg) => (
                  <label
                    key={pkg.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "0.8rem 1rem",
                      borderRadius: "var(--r-md)",
                      border:
                        selectedPackageId === pkg.id
                          ? "2px solid var(--lagoon-800)"
                          : "1.5px solid var(--line)",
                      background:
                        selectedPackageId === pkg.id
                          ? "rgba(14, 43, 46, 0.04)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "border-color var(--dur-micro) ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={selectedPackageId === pkg.id}
                      onChange={() => setSelectedPackageId(pkg.id)}
                      style={{ marginTop: "0.2rem", accentColor: "var(--lagoon-800)" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600 }}>{pkg.name}</span>
                        {pkg.factor > 1.0 && (
                          <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)" }}>
                            +{Math.round((pkg.factor - 1) * 100)}%
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--fg-muted)", marginTop: "0.15rem" }}>
                        {pkg.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Guest Steppers */}
          {tour.pricing === "person" ? (
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Adults</div>
                  <div className="muted" style={{ fontSize: "0.82rem" }}>
                    Ages 13 and above
                  </div>
                </div>
                <Stepper
                  value={adults}
                  min={1}
                  max={tour.groupMax}
                  onChange={setAdults}
                  label="Adults"
                />
              </div>

              {tour.childrenAllowed && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Children</div>
                    <div className="muted" style={{ fontSize: "0.82rem" }}>
                      Ages 2–12 ({Math.round(tour.childRate * 100)}% of adult rate)
                    </div>
                  </div>
                  <Stepper
                    value={children}
                    min={0}
                    max={tour.groupMax - adults}
                    onChange={setChildren}
                    label="Children"
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Party Size</div>
                <div className="muted" style={{ fontSize: "0.82rem" }}>
                  Max charter capacity: {tour.groupMax} guests
                </div>
              </div>
              <Stepper
                value={adults}
                min={1}
                max={tour.groupMax}
                onChange={setAdults}
                label="Party size"
              />
            </div>
          )}

          {/* Optional Extras */}
          <div className="field">
            <span className="field-label">Enhance Your Journey (Optional)</span>
            <div style={{ display: "grid", gap: "0.4rem" }}>
              {EXTRAS.map((extra) => {
                const checked = selectedExtras.includes(extra.id);
                return (
                  <label key={extra.id} className="check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleExtra(extra.id)}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem" }}>
                        <span style={{ fontWeight: 500 }}>{extra.name}</span>
                        <span style={{ fontWeight: 600 }}>+{formatCurrency(extra.price)}</span>
                      </div>
                      <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>
                        {extra.description} ({extra.per === "person" ? "per guest" : "per booking"})
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div
            style={{
              paddingTop: "1rem",
              borderTop: "1.5px dashed var(--line-strong)",
              display: "grid",
              gap: "0.4rem",
              fontSize: "0.92rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
              <span>Base rate ({adults} adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""})</span>
              <span>{formatCurrency(pricingCalc.passengerTotal)}</span>
            </div>

            {pricingCalc.extrasTotal > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
                <span>Selected enhancements</span>
                <span>+{formatCurrency(pricingCalc.extrasTotal)}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: "1.2rem",
                fontWeight: 700,
                marginTop: "0.5rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--line)",
              }}
            >
              <span>Estimated Total</span>
              <span style={{ color: "var(--lagoon-800)" }}>{formatCurrency(pricingCalc.grandTotal)}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            type="button"
            className="btn btn-accent btn-block"
            onClick={handleProceed}
            style={{ minHeight: "52px" }}
          >
            <span>Proceed to Reservation</span>
            <Icon name="arrowRight" size={18} aria-hidden="true" />
          </button>

          <p className="muted" style={{ fontSize: "0.8rem", textAlign: "center" }}>
            Risk-free simulation &bull; No payment required &bull; Free cancellation preview
          </p>
        </div>
      )}
    </div>
  );
};
