import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SkipLink } from "../common/SkipLink";
import { ToastContainer } from "../common/ToastContainer";
import { ScrollTrigger } from "../../lib/motion";

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    // Allow page-level GSAP choreographies to breathe cleanly without parent opacity flashes.
    // Coordinate ScrollTrigger.refresh() once route components have settled.
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => clearTimeout(refreshTimer);
  }, [pathname]);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};
