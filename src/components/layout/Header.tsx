import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wordmark } from "../common/Wordmark";
import { Icon } from "../common/Icon";
import { useFavorites } from "../../context/FavoritesContext";

interface HeaderProps {
  initialTone?: "light" | "dark";
}

export const Header: React.FC<HeaderProps> = ({ initialTone = "dark" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count } = useFavorites();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const currentTone = scrolled ? "dark" : isHome ? "light" : initialTone;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.classList.remove("is-locked");
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add("is-locked");
    } else {
      document.body.classList.remove("is-locked");
    }
  };

  const navLinks = [
    { to: "/tours", label: "Explore Tours" },
    { to: "/destinations", label: "Destinations" },
    { to: "/about", label: "The Philosophy" },
    { to: "/manage-booking", label: "My Bookings" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className="site-header"
        data-scrolled={scrolled ? "true" : "false"}
        data-tone={currentTone}
      >
        <div className="wrap header-inner">
          <Link to="/" className="brand" aria-label="VELORA homepage">
            <Wordmark showTagline={!scrolled} />
          </Link>

          <nav className="primary-nav" aria-label="Primary navigation">
            <ul role="list">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={location.pathname === link.to ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <Link
              to="/tours"
              className="icon-btn"
              aria-label="Search all tours"
            >
              <Icon name="search" size={20} aria-hidden="true" />
            </Link>

            <Link
              to="/favorites"
              className="icon-btn header-fav"
              aria-label={`Saved journeys (${count})`}
            >
              <Icon name={count > 0 ? "heartFill" : "heart"} size={20} aria-hidden="true" />
              {count > 0 && <span className="fav-count">{count}</span>}
            </Link>

            <Link to="/tours" className="btn btn-accent btn-sm">
              <span>Book Journey</span>
              <Icon name="arrowUpRight" size={16} aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="icon-btn menu-toggle"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <div
        id="mobile-navigation"
        className="mobile-menu"
        hidden={!mobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-menu-top">
          <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
            <Wordmark showTagline={false} />
          </Link>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleMobileMenu}
            aria-label="Close navigation"
          >
            <Icon name="close" size={24} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={location.pathname === link.to ? "page" : undefined}
            >
              <span>{link.label}</span>
              <Icon name="arrowRight" size={22} aria-hidden="true" />
            </Link>
          ))}
          <Link to="/favorites">
            <span>Saved Journeys</span>
            <small>{count} saved</small>
          </Link>
        </nav>

        <div className="menu-foot">
          <Link
            to="/tours"
            className="btn btn-accent btn-block"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Explore All 30 Journeys</span>
            <Icon name="arrowRight" size={18} aria-hidden="true" />
          </Link>
          <p className="kicker" style={{ textAlign: "center", color: "var(--seaglass)" }}>
            The Art of Travel — Across 13 Global Regions
          </p>
        </div>
      </div>
    </>
  );
};
