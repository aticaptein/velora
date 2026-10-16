import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, setupParallax, revealOnScroll, isReducedMotion } from "../../lib/motion";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { Icon } from "../common/Icon";

export const StorySection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      revealOnScroll(".story-header", {
        trigger: containerRef.current,
        y: 30,
        duration: 0.85,
      });

      // Animate each chapter individually as it enters viewport
      gsap.utils.toArray<HTMLElement>(".story-chapter").forEach((chapter) => {
        gsap.fromTo(
          chapter,
          { y: 45, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 82%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );

        // Continuous image parallax on chapter images
        const img = chapter.querySelector<HTMLElement>(".story-img img");
        if (img) {
          setupParallax(img, chapter, 16);
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section" aria-labelledby="story-heading">
      <div className="wrap">
        <div className="story-header" style={{ maxWidth: "720px", marginBottom: "4rem" }}>
          <p className="kicker">MANIFESTO</p>
          <h2 id="story-heading" className="display" style={{ marginTop: "0.4rem" }}>
            Why We Reject the Whistlestop Tour
          </h2>
          <p className="lede" style={{ marginTop: "1.2rem", color: "var(--fg-muted)" }}>
            Mass tourism measures success by ticks on a checklist. VELORA designs for the quiet moments that happen when you stay long enough to watch the shadows lengthen.
          </p>
        </div>

        {/* 3 Story Chapters */}
        <div style={{ display: "grid", gap: "clamp(3rem, 6vw, 6rem)" }}>
          {/* Chapter 1 */}
          <div
            className="story-chapter"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
              gap: "clamp(2rem, 4vw, 4rem)",
              alignItems: "center",
            }}
          >
            <div style={{ order: 2 }}>
              <span className="kicker" style={{ color: "var(--saffron)" }}>CHAPTER 01</span>
              <h3 style={{ fontSize: "var(--step-3)", fontWeight: 380, marginTop: "0.4rem" }}>
                Small Groups, Native Guides
              </h3>
              <p style={{ marginTop: "1rem", lineHeight: 1.65, color: "var(--fg-muted)" }}>
                When you travel in a coach of fifty, you carry your own bubble everywhere. VELORA caps ordinary departures at 12 to 14 guests, and private departures at your own party. You walk into neighborhood bakeries and tea gardens as guests, not as an invasion.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link to="/about" className="text-link">
                  <span>Read our group size ethics</span>
                  <Icon name="arrowRight" size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div
              className="story-img"
              style={{
                order: 1,
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-float)",
                aspectRatio: "16 / 11",
              }}
            >
              <ResponsiveImage
                name="story-guide"
                alt="Local guide sharing historic anecdotes in a historic Mediterranean lane"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="parallax-img"
              />
            </div>
          </div>

          {/* Chapter 2 */}
          <div
            className="story-chapter"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
              gap: "clamp(2rem, 4vw, 4rem)",
              alignItems: "center",
            }}
          >
            <div>
              <span className="kicker" style={{ color: "var(--seaglass-400)" }}>CHAPTER 02</span>
              <h3 style={{ fontSize: "var(--step-3)", fontWeight: 380, marginTop: "0.4rem" }}>
                Fair Compensation &amp; Real Preservation
              </h3>
              <p style={{ marginTop: "1rem", lineHeight: 1.65, color: "var(--fg-muted)" }}>
                We pay boat crews, drivers, licensed docents, and family hosts well above industry baselines. A portion of every seat booked funds local restoration projects — from olive terracing in Greece to trail maintenance in the Bernese Oberland.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link to="/about" className="text-link">
                  <span>How your booking supports locals</span>
                  <Icon name="arrowRight" size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div
              className="story-img"
              style={{
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-float)",
                aspectRatio: "16 / 11",
              }}
            >
              <ResponsiveImage
                name="culinary-rome"
                alt="Family dinner table overlooking a Tuscan hill village"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="parallax-img"
              />
            </div>
          </div>

          {/* Chapter 3 */}
          <div
            className="story-chapter"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
              gap: "clamp(2rem, 4vw, 4rem)",
              alignItems: "center",
            }}
          >
            <div style={{ order: 2 }}>
              <span className="kicker" style={{ color: "var(--saffron)" }}>CHAPTER 03</span>
              <h3 style={{ fontSize: "var(--step-3)", fontWeight: 380, marginTop: "0.4rem" }}>
                Time for Unscripted Wonder
              </h3>
              <p style={{ marginTop: "1rem", lineHeight: 1.65, color: "var(--fg-muted)" }}>
                Every VELORA itinerary leaves unprogrammed afternoons. Sit at a harbour bar in Symi, wander an antiquarian bookstore in Kyoto, or listen to water dripping in an ancient cistern. The best travel stories are the ones neither of us planned.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link to="/tours" className="btn btn-sm">
                  <span>Discover our itineraries</span>
                  <Icon name="arrowRight" size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div
              className="story-img"
              style={{
                order: 1,
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-float)",
                aspectRatio: "16 / 11",
              }}
            >
              <ResponsiveImage
                name="nature-bali"
                alt="Lush green tropical terrace in early morning light"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="parallax-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
