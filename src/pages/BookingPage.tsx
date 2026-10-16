import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { TOURS } from "../data/tours";
import { EXTRAS } from "../data/categories";
import { useBookings, type SimulatedBooking } from "../context/BookingContext";
import { Stepper } from "../components/common/Stepper";
import { TierBadge } from "../components/common/TierBadge";
import { ResponsiveImage } from "../components/common/ResponsiveImage";
import { Icon } from "../components/common/Icon";
import { formatCurrency, formatDateString } from "../lib/format";
import { DemoNotice } from "../components/common/DemoNotice";
import { gsap, isReducedMotion } from "../lib/motion";

export const BookingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createBooking, cancelBooking } = useBookings();

  const tour = TOURS.find((t) => t.slug === slug);

  // Read initial query params
  const paramDate = searchParams.get("date") || "";
  const paramAdults = Number(searchParams.get("adults")) || 2;
  const paramChildren = Number(searchParams.get("children")) || 0;
  const paramPkg = searchParams.get("pkg") || "";
  const paramExtras = searchParams.get("extras") ? searchParams.get("extras")!.split(",") : [];

  // Form states
  const [departureDate, setDepartureDate] = useState(paramDate);
  const [packageId, setPackageId] = useState(paramPkg || tour?.packages[0]?.id || "essential");
  const [adults, setAdults] = useState(paramAdults);
  const [children, setChildren] = useState(paramChildren);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(paramExtras);

  // Passenger details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Validation & Confirmation states
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string; departureDate?: string }>({});
  const [confirmedBooking, setConfirmedBooking] = useState<SimulatedBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate realistic departure dates if none passed
  const departureDates = useMemo(() => {
    if (!tour) return [];
    const dates: string[] = [];
    const base = new Date();
    base.setDate(base.getDate() + 3);
    for (let i = 0; i < 8; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i * (tour.cadence || 3));
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, [tour]);

  useEffect(() => {
    if (!departureDate && departureDates.length > 0) {
      setDepartureDate(departureDates[0]);
    }
  }, [departureDate, departureDates]);

  if (!tour) {
    return (
      <div className="wrap section" style={{ textAlign: "center", paddingBlock: "8rem" }}>
        <h1 className="h-xl">Journey Not Found</h1>
        <p className="muted" style={{ marginBlock: "1rem" }}>
          We could not locate this journey for reservation.
        </p>
        <Link to="/tours" className="btn btn-accent">
          <span>Explore All Journeys</span>
        </Link>
      </div>
    );
  }

  const isBookable = tour.status === "available" || tour.status === "limited";

  if (!isBookable) {
    return (
      <div className="wrap section" style={{ maxWidth: "640px", marginInline: "auto", textAlign: "center" }}>
        <div style={{ padding: "3rem", background: "var(--salt-50)", borderRadius: "var(--r-lg)", border: "1.5px solid var(--line)" }}>
          <Icon name="alert" size={48} style={{ color: "var(--clay)", marginInline: "auto" }} aria-hidden="true" />
          <h1 className="h-lg" style={{ marginTop: "1rem" }}>Booking Currently Closed</h1>
          <p className="muted" style={{ marginTop: "0.8rem", lineHeight: 1.6 }}>
            "{tour.title}" is currently {tour.status}. We cannot accept new reservations for this route at this time.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/tours" className="btn btn-accent">
              <span>Find Alternative Journeys</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activePackage =
    tour.packages.find((p) => p.id === packageId) || tour.packages[0];
  const packageFactor = activePackage?.factor || 1.0;

  // Calculation
  const pricingCalc = useMemo(() => {
    const baseAdultRate = tour.price * packageFactor;
    const baseChildRate = baseAdultRate * (tour.childRate || 0.6);

    let passengerTotal = 0;
    if (tour.pricing === "person") {
      passengerTotal = adults * baseAdultRate + children * baseChildRate;
    } else {
      passengerTotal = tour.price * packageFactor;
    }

    let extrasTotal = 0;
    const resolvedExtras: { id: string; name: string; price: number }[] = [];
    for (const extraId of selectedExtras) {
      const extra = EXTRAS.find((e) => e.id === extraId);
      if (extra) {
        const itemPrice = extra.per === "person" ? extra.price * (adults + children) : extra.price;
        extrasTotal += itemPrice;
        resolvedExtras.push({ id: extra.id, name: extra.name, price: itemPrice });
      }
    }

    const grandTotal = Math.round(passengerTotal + extrasTotal);

    return {
      baseAdultRate: Math.round(baseAdultRate),
      baseChildRate: Math.round(baseChildRate),
      passengerTotal: Math.round(passengerTotal),
      resolvedExtras,
      extrasTotal: Math.round(extrasTotal),
      grandTotal,
    };
  }, [tour, packageFactor, adults, children, selectedExtras]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full legal name.";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your contact email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    if (!phone.trim()) {
      newErrors.phone = "Please enter a phone number for emergency contact.";
    }

    if (!departureDate) {
      newErrors.departureDate = "Please select an available departure date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = createBooking({
        tourSlug: tour.slug,
        tourTitle: tour.title,
        destination: tour.destination,
        departureDate,
        adults,
        children,
        packageId,
        packageName: activePackage?.name || "Standard",
        packageFactor,
        extras: pricingCalc.resolvedExtras,
        totalPrice: pricingCalc.grandTotal,
        passenger: {
          fullName,
          email,
          phone,
          dietary,
          requests: specialRequests,
        },
      });

      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  const confirmBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (confirmedBooking && !isReducedMotion() && confirmBoxRef.current) {
      gsap.fromTo(
        confirmBoxRef.current,
        { scale: 0.94, autoAlpha: 0, y: 24 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.65, ease: "back.out(1.5)" }
      );
      gsap.fromTo(
        ".confirm-badge-icon",
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.5, delay: 0.2, ease: "back.out(2)" }
      );
    }
  }, [confirmedBooking]);

  // If already confirmed: show confirmation screen
  if (confirmedBooking) {
    const isCancelled = confirmedBooking.status === "cancelled";

    return (
      <div className="booking-confirmation-page wrap section" style={{ maxWidth: "780px", marginInline: "auto" }}>
        <div
          ref={confirmBoxRef}
          style={{
            background: "var(--salt-50)",
            border: `2px solid ${isCancelled ? "var(--clay)" : "var(--st-available)"}`,
            borderRadius: "var(--r-lg)",
            padding: "clamp(2rem, 5vw, 3.5rem)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              className="confirm-badge-icon"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: isCancelled ? "rgba(181, 72, 47, 0.15)" : "rgba(47, 107, 79, 0.15)",
                color: isCancelled ? "var(--clay)" : "var(--st-available)",
                display: "grid",
                placeItems: "center",
                marginInline: "auto",
                marginBottom: "1rem",
              }}
            >
              <Icon name={isCancelled ? "x" : "check"} size={32} aria-hidden="true" />
            </div>

            <p className="kicker" style={{ color: isCancelled ? "var(--clay)" : "var(--st-available)" }}>
              {isCancelled ? "BOOKING CANCELLED" : "RESERVATION CONFIRMED (DEMO)"}
            </p>

            <h1 className="h-xl" style={{ marginTop: "0.2rem" }}>
              {isCancelled ? "This reservation has been cancelled" : "Your Journey is Held"}
            </h1>

            <p className="muted" style={{ marginTop: "0.6rem" }}>
              Booking Reference:{" "}
              <strong style={{ fontSize: "1.3rem", color: "var(--lagoon-800)", letterSpacing: "0.08em" }}>
                {confirmedBooking.reference}
              </strong>
            </p>
          </div>

          <DemoNotice compact />

          <div
            style={{
              marginBlock: "2rem",
              padding: "1.5rem",
              borderRadius: "var(--r-md)",
              background: "var(--white)",
              border: "1px solid var(--line)",
              display: "grid",
              gap: "0.8rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "0.6rem" }}>
              <span className="muted">Journey</span>
              <strong>{confirmedBooking.tourTitle}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "0.6rem" }}>
              <span className="muted">Departure</span>
              <strong>{formatDateString(confirmedBooking.departureDate)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "0.6rem" }}>
              <span className="muted">Party</span>
              <span>
                {confirmedBooking.adults} Adult{confirmedBooking.adults > 1 ? "s" : ""}
                {confirmedBooking.children > 0 ? `, ${confirmedBooking.children} Child${confirmedBooking.children > 1 ? "ren" : ""}` : ""}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "0.6rem" }}>
              <span className="muted">Package</span>
              <strong>{confirmedBooking.packageName}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "0.6rem" }}>
              <span className="muted">Lead Traveler</span>
              <span>{confirmedBooking.passenger.fullName} ({confirmedBooking.passenger.email})</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.4rem", fontSize: "1.15rem", fontWeight: 700 }}>
              <span>Total Simulated Amount</span>
              <span style={{ color: "var(--lagoon-800)" }}>{formatCurrency(confirmedBooking.totalPrice)}</span>
            </div>
          </div>

          {/* Cancellation or Manage options */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => window.print()}
            >
              <Icon name="ticket" size={18} aria-hidden="true" />
              <span>Print Confirmation</span>
            </button>

            {!isCancelled ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  cancelBooking(confirmedBooking.reference);
                  setConfirmedBooking((prev) => prev ? { ...prev, status: "cancelled" } : null);
                }}
              >
                <Icon name="trash" size={18} aria-hidden="true" />
                <span>Simulate Cancellation</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => navigate("/tours")}
              >
                <span>Browse Other Journeys</span>
              </button>
            )}

            <Link to="/manage-booking" className="btn btn-ghost">
              <span>View All Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tours">Tours</Link></li>
            <li><Link to={`/tours/${tour.slug}`}>{tour.title}</Link></li>
            <li><span aria-current="page">Reservation</span></li>
          </ol>
        </nav>

        <h1 className="h-xl">Reserve Your Place</h1>
        <p className="lede">
          Complete your guest and departure details. Simulated reservation with instant reference code.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice />
        </div>
      </div>

      <div className="wrap">
        <form onSubmit={handleBookingSubmit} noValidate>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 0.9fr)",
              gap: "clamp(2rem, 4vw, 4rem)",
              alignItems: "start",
            }}
          >
            {/* Passenger & Preferences Form Column */}
            <div style={{ display: "grid", gap: "2.5rem" }}>
              {/* Error Summary if form has errors */}
              {Object.keys(errors).length > 0 && (
                <div className="error-summary" role="alert" aria-labelledby="error-summary-title">
                  <h2 id="error-summary-title">Please correct the following errors:</h2>
                  <ul role="list" style={{ marginTop: "0.5rem", display: "grid", gap: "0.25rem" }}>
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>
                        <a href="#passenger-form" style={{ textDecoration: "underline" }}>
                          {err}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 1: Departure Date & Package */}
              <section
                style={{
                  background: "var(--salt-50)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  borderRadius: "var(--r-lg)",
                  border: "1.5px solid var(--line)",
                }}
              >
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "1.2rem" }}>
                  1. Departure &amp; Service Tier
                </h2>

                <div style={{ display: "grid", gap: "1.25rem" }}>
                  <div className="field">
                    <label htmlFor="booking-departure-date" className="field-label">
                      Departure Date *
                    </label>
                    <select
                      id="booking-departure-date"
                      className="select"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      aria-invalid={Boolean(errors.departureDate)}
                    >
                      {departureDates.map((d) => (
                        <option key={d} value={d}>
                          {formatDateString(d)} (Guaranteed Departure)
                        </option>
                      ))}
                    </select>
                    {errors.departureDate && (
                      <span className="error-text">
                        <Icon name="alert" size={16} aria-hidden="true" />
                        {errors.departureDate}
                      </span>
                    )}
                  </div>

                  {tour.packages.length > 1 && (
                    <div className="field">
                      <span className="field-label">Selected Service Package</span>
                      <div style={{ display: "grid", gap: "0.6rem" }}>
                        {tour.packages.map((pkg) => (
                          <label
                            key={pkg.id}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "0.75rem",
                              padding: "0.9rem 1.2rem",
                              borderRadius: "var(--r-md)",
                              border:
                                packageId === pkg.id
                                  ? "2px solid var(--lagoon-800)"
                                  : "1.5px solid var(--line)",
                              background:
                                packageId === pkg.id
                                  ? "rgba(14, 43, 46, 0.04)"
                                  : "transparent",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name="booking-pkg"
                              value={pkg.id}
                              checked={packageId === pkg.id}
                              onChange={() => setPackageId(pkg.id)}
                              style={{ marginTop: "0.2rem", accentColor: "var(--lagoon-800)" }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 600 }}>{pkg.name}</span>
                                {pkg.factor > 1 && (
                                  <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)" }}>
                                    +{Math.round((pkg.factor - 1) * 100)}%
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize: "0.85rem", color: "var(--fg-muted)", marginTop: "0.2rem" }}>
                                {pkg.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Step 2: Guest Details */}
              <section
                id="passenger-form"
                style={{
                  background: "var(--salt-50)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  borderRadius: "var(--r-lg)",
                  border: "1.5px solid var(--line)",
                }}
              >
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "1.2rem" }}>
                  2. Lead Traveler Details
                </h2>

                <div style={{ display: "grid", gap: "1.25rem" }}>
                  <div className="field">
                    <label htmlFor="lead-fullname" className="field-label">
                      Full Legal Name *
                    </label>
                    <input
                      id="lead-fullname"
                      type="text"
                      className="input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Siobhan Davies"
                      aria-invalid={Boolean(errors.fullName)}
                      required
                    />
                    {errors.fullName && (
                      <span className="error-text">
                        <Icon name="alert" size={16} aria-hidden="true" />
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    <div className="field">
                      <label htmlFor="lead-email" className="field-label">
                        Email Address *
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. siobhan@meridian.com"
                        aria-invalid={Boolean(errors.email)}
                        required
                      />
                      {errors.email && (
                        <span className="error-text">
                          <Icon name="alert" size={16} aria-hidden="true" />
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="lead-phone" className="field-label">
                        Contact Phone Number *
                      </label>
                      <input
                        id="lead-phone"
                        type="tel"
                        className="input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +44 20 7946 0912"
                        aria-invalid={Boolean(errors.phone)}
                        required
                      />
                      {errors.phone && (
                        <span className="error-text">
                          <Icon name="alert" size={16} aria-hidden="true" />
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="dietary-needs" className="field-label">
                      Dietary Preferences / Allergies (Optional)
                    </label>
                    <input
                      id="dietary-needs"
                      type="text"
                      className="input"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="e.g. Vegetarian, Gluten-free, Nut allergy"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="special-requests" className="field-label">
                      Special Requests or Celebration Notes (Optional)
                    </label>
                    <textarea
                      id="special-requests"
                      className="textarea"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Anniversary celebration, ground-floor room preference, or accessibility notes..."
                      style={{ minHeight: "90px" }}
                    />
                  </div>
                </div>
              </section>

              {/* Step 3: Add-on Enhancements */}
              <section
                style={{
                  background: "var(--salt-50)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  borderRadius: "var(--r-lg)",
                  border: "1.5px solid var(--line)",
                }}
              >
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "1.2rem" }}>
                  3. Travel Enhancements
                </h2>

                <div style={{ display: "grid", gap: "0.5rem" }}>
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
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                            <span style={{ fontWeight: 600 }}>{extra.name}</span>
                            <span style={{ fontWeight: 700 }}>+{formatCurrency(extra.price)}</span>
                          </div>
                          <span className="muted" style={{ fontSize: "0.85rem", display: "block" }}>
                            {extra.description} ({extra.per === "person" ? "per guest" : "per booking"})
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sidebar Order Summary */}
            <aside
              style={{
                position: "sticky",
                top: "calc(var(--header-h) + 1.5rem)",
                background: "var(--salt-50)",
                border: "1.5px solid var(--line-strong)",
                borderRadius: "var(--r-lg)",
                padding: "clamp(1.5rem, 3vw, 2rem)",
                boxShadow: "var(--shadow-float)",
              }}
              aria-label="Order summary"
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ width: "80px", height: "65px", borderRadius: "var(--r-md)", overflow: "hidden", flex: "none" }}>
                  <ResponsiveImage
                    name={tour.images[0] || "hero-cappadocia"}
                    alt={tour.title}
                    sizes="80px"
                  />
                </div>
                <div>
                  <TierBadge tier={tour.tier} />
                  <h3 style={{ fontSize: "1.1rem", marginTop: "0.3rem" }}>{tour.title}</h3>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>{tour.destination}</span>
                </div>
              </div>

              {/* Party counts adjustments */}
              {tour.pricing === "person" ? (
                <div style={{ display: "grid", gap: "0.8rem", paddingBottom: "1.2rem", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Adults</div>
                      <div className="muted" style={{ fontSize: "0.8rem" }}>{formatCurrency(pricingCalc.baseAdultRate)} / each</div>
                    </div>
                    <Stepper
                      value={adults}
                      min={1}
                      max={tour.groupMax}
                      onChange={setAdults}
                      label="Adult travelers"
                    />
                  </div>

                  {tour.childrenAllowed && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Children</div>
                        <div className="muted" style={{ fontSize: "0.8rem" }}>{formatCurrency(pricingCalc.baseChildRate)} / each</div>
                      </div>
                      <Stepper
                        value={children}
                        min={0}
                        max={tour.groupMax - adults}
                        onChange={setChildren}
                        label="Child travelers"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ paddingBottom: "1.2rem", borderBottom: "1px solid var(--line)" }}>
                  <div className="muted" style={{ fontSize: "0.9rem" }}>Private Charter Package</div>
                  <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(pricingCalc.passengerTotal)}</strong>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: "grid", gap: "0.5rem", paddingBlock: "1.2rem", fontSize: "0.92rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
                  <span>Passage total</span>
                  <span>{formatCurrency(pricingCalc.passengerTotal)}</span>
                </div>

                {pricingCalc.resolvedExtras.map((ex) => (
                  <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-muted)" }}>
                    <span>{ex.name}</span>
                    <span>+{formatCurrency(ex.price)}</span>
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    marginTop: "0.6rem",
                    paddingTop: "0.8rem",
                    borderTop: "1.5px dashed var(--line)",
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: "var(--lagoon-800)" }}>{formatCurrency(pricingCalc.grandTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-accent btn-block"
                style={{ minHeight: "54px" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" aria-hidden="true" />
                    <span>Processing Simulation...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Simulated Booking</span>
                    <Icon name="arrowRight" size={18} aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="muted" style={{ fontSize: "0.78rem", textAlign: "center", marginTop: "0.8rem" }}>
                Demo environment: no credit card charged. Instant confirmation.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};
