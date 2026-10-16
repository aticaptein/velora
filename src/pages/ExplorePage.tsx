import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TOURS } from "../data/tours";
import { CATEGORIES } from "../data/categories";
import { DESTINATIONS } from "../data/destinations";
import type { CategoryId, Tier } from "../data/types";
import { TourGrid } from "../components/tour/TourGrid";
import { Icon } from "../components/common/Icon";
import { formatCurrency } from "../lib/format";
import { DemoNotice } from "../components/common/DemoNotice";

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters initial values
  const urlCategory = searchParams.get("category") || "";
  const urlDestination = searchParams.get("destination") || "";
  const urlQuery = searchParams.get("q") || "";
  const urlTier = searchParams.get("tier") || "";
  const urlDuration = searchParams.get("duration") || "";
  const urlSort = searchParams.get("sort") || "featured";

  const [keyword, setKeyword] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedDestination, setSelectedDestination] = useState<string>(urlDestination);
  const [selectedTier, setSelectedTier] = useState<string>(urlTier);
  const [durationRange, setDurationRange] = useState<string>(urlDuration);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>(urlSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedDestination(urlDestination);
    setKeyword(urlQuery);
    setSelectedTier(urlTier);
    setDurationRange(urlDuration);
    setSortBy(urlSort || "featured");
  }, [urlCategory, urlDestination, urlQuery, urlTier, urlDuration, urlSort]);

  // Update URL parameters when filters change
  const updateParams = (updates: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    setSearchParams(nextParams, { replace: true });
  };

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    updateParams({ q: val });
  };

  const handleCategoryChange = (val: string) => {
    const nextVal = selectedCategory === val ? "" : val;
    setSelectedCategory(nextVal);
    updateParams({ category: nextVal });
  };

  const handleDestinationChange = (val: string) => {
    setSelectedDestination(val);
    updateParams({ destination: val });
  };

  const handleTierChange = (val: string) => {
    setSelectedTier(val);
    updateParams({ tier: val });
  };

  const handleDurationChange = (val: string) => {
    setDurationRange(val);
    updateParams({ duration: val });
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    updateParams({ sort: val });
  };

  const resetAllFilters = () => {
    setKeyword("");
    setSelectedCategory("");
    setSelectedDestination("");
    setSelectedTier("");
    setDurationRange("");
    setMaxPrice(10000);
    setSortBy("featured");
    setSearchParams({}, { replace: true });
  };

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    return TOURS.filter((tour) => {
      // Keyword search (title, summary, destination, highlights)
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesTitle = tour.title.toLowerCase().includes(query);
        const matchesSummary = tour.summary.toLowerCase().includes(query);
        const matchesDest = tour.destination.toLowerCase().includes(query);
        const matchesHighlights = tour.highlights.some((h) =>
          h.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesSummary && !matchesDest && !matchesHighlights) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        if (!tour.categories.includes(selectedCategory as CategoryId)) {
          return false;
        }
      }

      // Destination filter
      if (selectedDestination) {
        if (tour.destination.toLowerCase() !== selectedDestination.toLowerCase()) {
          return false;
        }
      }

      // Tier filter
      if (selectedTier) {
        if (tour.tier !== (selectedTier as Tier)) {
          return false;
        }
      }

      // Duration filter
      if (durationRange === "short" && tour.days > 3) return false;
      if (durationRange === "medium" && (tour.days < 4 || tour.days > 7)) return false;
      if (durationRange === "long" && tour.days < 8) return false;

      // Price filter
      if (tour.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
          return a.days - b.days;
        case "duration-desc":
          return b.days - a.days;
        case "rating":
          return b.rating - a.rating;
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [
    keyword,
    selectedCategory,
    selectedDestination,
    selectedTier,
    durationRange,
    maxPrice,
    sortBy,
  ]);

  const hasActiveFilters = Boolean(
    keyword ||
      selectedCategory ||
      selectedDestination ||
      selectedTier ||
      durationRange ||
      maxPrice < 10000
  );

  return (
    <div className="explore-page" style={{ paddingBottom: "var(--sp-9)" }}>
      {/* Page Header */}
      <div className="page-hero wrap">
        <nav className="crumbs" aria-label="Breadcrumbs">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><span aria-current="page">Explore Tours</span></li>
          </ol>
        </nav>

        <h1 className="display">Discover All Journeys</h1>
        <p className="lede">
          From weekend city breaks to multi-day alpine treks and private gulet charters. Filter by destination, style, pace, or budget.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <DemoNotice compact />
        </div>
      </div>

      <div className="wrap">
        {/* Search Bar & Mobile Filter Toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "1rem",
            marginBottom: "2rem",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--fg-muted)",
                pointerEvents: "none",
              }}
            >
              <Icon name="search" size={20} aria-hidden="true" />
            </span>
            <input
              type="search"
              className="input"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="Search by keyword, route, experience (e.g. 'balloon', 'hike', 'yacht')..."
              style={{ paddingLeft: "2.8rem" }}
              aria-label="Search journeys by keyword"
            />
            {keyword && (
              <button
                type="button"
                className="icon-btn"
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "36px",
                  height: "36px",
                }}
                onClick={() => handleKeywordChange("")}
                aria-label="Clear keyword search"
              >
                <Icon name="close" size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            aria-expanded={mobileFilterOpen}
            aria-label="Toggle filter sidebar"
          >
            <Icon name="sliders" size={18} aria-hidden="true" />
            <span>Filters {hasActiveFilters ? `(Active)` : ""}</span>
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)" }}>
              Active filters:
            </span>

            {selectedCategory && (
              <span className="chip" style={{ background: "var(--salt-50)" }}>
                <span>Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => handleCategoryChange(selectedCategory)}
                  aria-label={`Remove category filter`}
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Icon name="close" size={14} aria-hidden="true" />
                </button>
              </span>
            )}

            {selectedDestination && (
              <span className="chip" style={{ background: "var(--salt-50)" }}>
                <span>Destination: {selectedDestination}</span>
                <button
                  type="button"
                  onClick={() => handleDestinationChange("")}
                  aria-label="Remove destination filter"
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Icon name="close" size={14} aria-hidden="true" />
                </button>
              </span>
            )}

            {selectedTier && (
              <span className="chip" style={{ background: "var(--salt-50)" }}>
                <span>Tier: {selectedTier}</span>
                <button
                  type="button"
                  onClick={() => handleTierChange("")}
                  aria-label="Remove tier filter"
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Icon name="close" size={14} aria-hidden="true" />
                </button>
              </span>
            )}

            {durationRange && (
              <span className="chip" style={{ background: "var(--salt-50)" }}>
                <span>Duration: {durationRange}</span>
                <button
                  type="button"
                  onClick={() => handleDurationChange("")}
                  aria-label="Remove duration filter"
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Icon name="close" size={14} aria-hidden="true" />
                </button>
              </span>
            )}

            {maxPrice < 10000 && (
              <span className="chip" style={{ background: "var(--salt-50)" }}>
                <span>Up to {formatCurrency(maxPrice)}</span>
                <button
                  type="button"
                  onClick={() => setMaxPrice(10000)}
                  aria-label="Reset max price"
                  style={{ display: "grid", placeItems: "center" }}
                >
                  <Icon name="close" size={14} aria-hidden="true" />
                </button>
              </span>
            )}

            <button
              type="button"
              className="text-link"
              onClick={resetAllFilters}
              style={{ fontSize: "0.85rem", minHeight: "32px", color: "var(--danger)" }}
            >
              Reset all
            </button>
          </div>
        )}

        {/* Main Content Layout with Responsive Filter Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobileFilterOpen
              ? "minmax(280px, 320px) 1fr"
              : "1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Filters Sidebar */}
          {mobileFilterOpen && (
            <aside
              style={{
                background: "var(--salt-50)",
                border: "1.5px solid var(--line)",
                borderRadius: "var(--r-lg)",
                padding: "1.5rem",
                display: "grid",
                gap: "1.5rem",
              }}
              aria-label="Search and filter options"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Filter Journeys</h2>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters panel"
                >
                  <Icon name="close" size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Destination Filter */}
              <div className="field">
                <label htmlFor="filter-dest" className="field-label">
                  Destination
                </label>
                <select
                  id="filter-dest"
                  className="select"
                  value={selectedDestination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                >
                  <option value="">All Destinations</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d.slug} value={d.name}>
                      {d.name} ({d.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier Filter */}
              <div className="field">
                <label htmlFor="filter-tier" className="field-label">
                  Service Tier
                </label>
                <select
                  id="filter-tier"
                  className="select"
                  value={selectedTier}
                  onChange={(e) => handleTierChange(e.target.value)}
                >
                  <option value="">All Tiers</option>
                  <option value="essential">Essential</option>
                  <option value="signature">Signature</option>
                  <option value="luxury">Luxury &amp; VIP</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div className="field">
                <label htmlFor="filter-duration" className="field-label">
                  Duration
                </label>
                <select
                  id="filter-duration"
                  className="select"
                  value={durationRange}
                  onChange={(e) => handleDurationChange(e.target.value)}
                >
                  <option value="">Any Duration</option>
                  <option value="short">1 to 3 Days (Weekend / Excursion)</option>
                  <option value="medium">4 to 7 Days (Week escape)</option>
                  <option value="long">8+ Days (Multi-day grand tour)</option>
                </select>
              </div>

              {/* Price Filter Slider */}
              <div className="field">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label htmlFor="filter-price" className="field-label">
                    Max Price
                  </label>
                  <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {formatCurrency(maxPrice)}
                  </span>
                </div>
                <input
                  id="filter-price"
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ accentColor: "var(--lagoon-800)", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--fg-muted)" }}>
                  <span>€100</span>
                  <span>€10,000+</span>
                </div>
              </div>

              {/* Category Pills inside sidebar */}
              <div className="field">
                <span className="field-label">Travel Category</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className="chip"
                        style={{
                          fontSize: "0.82rem",
                          minHeight: "34px",
                          padding: "0.2rem 0.65rem",
                          background: isSelected ? "var(--lagoon-800)" : "transparent",
                          color: isSelected ? "var(--salt)" : "var(--fg)",
                        }}
                      >
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetAllFilters}
              >
                <span>Reset all filters</span>
              </button>
            </aside>
          )}

          {/* Tours Results Column */}
          <div>
            {/* Results Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                Showing{" "}
                <span style={{ color: "var(--saffron)", fontWeight: 700 }}>
                  {filteredTours.length}
                </span>{" "}
                of {TOURS.length} journeys
              </div>

              {/* Sorting Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <label htmlFor="sort-by-select" style={{ fontSize: "0.9rem", color: "var(--fg-muted)" }}>
                  Sort by:
                </label>
                <select
                  id="sort-by-select"
                  className="select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  style={{ minHeight: "40px", padding: "0.4rem 2rem 0.4rem 0.8rem", fontSize: "0.9rem" }}
                >
                  <option value="featured">Curator's choice</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration-asc">Duration: Short to Long</option>
                  <option value="duration-desc">Duration: Long to Short</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>
            </div>

            {/* Tour Cards Grid */}
            <TourGrid
              tours={filteredTours}
              onResetFilters={resetAllFilters}
              emptyMessage="No tours match your current combination of filters. Try broadening your dates or categories."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
