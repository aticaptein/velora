import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { DemoNotice } from "../components/common/DemoNotice";

interface FaqItem {
  q: string;
  a: string;
  category: "booking" | "groups" | "yachts" | "preparation";
}

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const faqs: FaqItem[] = [
    {
      category: "booking",
      q: "How does the reservation simulation work on VELORA?",
      a: "All bookings made on this website are client-side simulations. You receive an authentic booking reference code, date breakdown, and can test cancellation mechanics in 'My Bookings', but no real credit cards, payments, or third-party emails are generated.",
    },
    {
      category: "booking",
      q: "What is included in the stated prices?",
      a: "Our prices include all accommodations listed in the itinerary, licensed local guides, regional transit between cities, museum/monument entrance tickets, and meals indicated (typically all breakfasts and selected authentic regional dinners).",
    },
    {
      category: "groups",
      q: "How large are your standard group tours?",
      a: "We cap standard group departures at 12 to 14 travelers maximum. On private journeys and yacht charters, the party is exclusively your own traveling companions.",
    },
    {
      category: "groups",
      q: "What pace should I expect on a typical day?",
      a: "We do not believe in sunrise-to-midnight marathons. Most days involve an active morning (walking tour, archaeological site, or trail), followed by a leisurely 2-hour regional lunch and free unscheduled time before an evening gathering.",
    },
    {
      category: "yachts",
      q: "What is the difference between a gulet charter and a day boat?",
      a: "A traditional wooden gulet is a floating boutique hotel accommodating 8–12 guests across private en-suite cabins with a full crew (captain, chef, deckhand). Day boats and catamarans are daytime-only charters designed for coastal swimming, snorkeling, and sunset dining.",
    },
    {
      category: "yachts",
      q: "Do I need sailing experience to book a yacht experience?",
      a: "None whatsoever. All VELORA nautical itineraries are chartered with experienced local skippers and licensed crews who manage navigation, anchoring, and meals.",
    },
    {
      category: "preparation",
      q: "Are the hiking experiences physically strenuous?",
      a: "Each hiking itinerary clearly notes its grade. For instance, our Lycian Way walks are graded 'Moderate' (3–5 hours daily over coastal stony paths with regular swim breaks), while Swiss Alpine passes can be more demanding. Sturdy walking shoes with grip are essential.",
    },
    {
      category: "preparation",
      q: "Can children join your itineraries?",
      a: "Tours marked with our 'Family holidays' category or with 'childrenAllowed: true' are warmly prepared for younger travelers (ages 2–12), with child pricing applied at 50% to 70% of the adult rate.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const toggleFaq = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="faq-page" style={{ paddingBottom: "var(--sp-9)" }}>
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Frequently Asked Questions</span></li>
          </ol>
        </nav>

        <h1 className="display">Everything You Need to Know</h1>
        <p className="lede">
          Clear, straightforward answers about group sizes, booking simulations, private gulets, and preparing for departure.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "2rem" }}>
          {[
            { id: "all", label: "All Topics" },
            { id: "booking", label: "Booking & Payments" },
            { id: "groups", label: "Groups & Pacing" },
            { id: "yachts", label: "Yachts & Charters" },
            { id: "preparation", label: "Preparation & Families" },
          ].map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className="chip"
                style={{
                  background: active ? "var(--lagoon-800)" : "transparent",
                  color: active ? "var(--salt)" : "var(--fg)",
                  fontWeight: 600,
                }}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="wrap" style={{ maxWidth: "860px" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                style={{
                  background: "var(--salt-50)",
                  borderRadius: "var(--r-md)",
                  border: "1.5px solid var(--line)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.2rem 1.6rem",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "var(--fg)",
                  }}
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={isOpen ? "minus" : "plus"}
                    size={20}
                    style={{ flex: "none", color: "var(--saffron)" }}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 1.6rem 1.4rem 1.6rem",
                      color: "var(--fg-muted)",
                      lineHeight: 1.65,
                      fontSize: "1rem",
                      borderTop: "1px solid var(--line)",
                      paddingTop: "1rem",
                    }}
                  >
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            background: "rgba(238, 240, 234, 0.7)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--r-lg)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.3rem" }}>Have a unique question or itinerary in mind?</h2>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            Our concierge desks in Istanbul, Paris, and Tokyo are here to advise you.
          </p>
          <div style={{ marginTop: "1.2rem" }}>
            <Link to="/contact" className="btn btn-accent btn-sm">
              <span>Contact Concierge Desk</span>
              <Icon name="arrowRight" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
