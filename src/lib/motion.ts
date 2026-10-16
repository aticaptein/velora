import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register all required plugins once at module initialization
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrollToPlugin);

export { gsap, ScrollTrigger, SplitText, Flip, ScrollToPlugin };

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Configure default GSAP settings for silky, luxury motion
 */
gsap.defaults({
  duration: 0.85,
  ease: "power2.out",
});

/**
 * Animate elements on scroll with progressive stagger and autoAlpha reveal
 */
export function revealOnScroll(
  elements: string | Element | Element[] | NodeListOf<Element>,
  options: {
    trigger?: string | Element | null;
    y?: number;
    stagger?: number;
    delay?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  if (isReducedMotion()) return null;

  const {
    trigger,
    y = 32,
    stagger = 0.08,
    delay = 0,
    duration = 0.9,
    start = "top 86%",
  } = options;

  return gsap.fromTo(
    elements,
    {
      autoAlpha: 0,
      y,
    },
    {
      autoAlpha: 1,
      y: 0,
      stagger,
      delay,
      duration,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: trigger as Element | string,
            start,
            toggleActions: "play none none none",
            once: true,
          }
        : undefined,
    }
  );
}

/**
 * Batched scroll entrance for grids, card lists, and multi-item rows
 * Uses ScrollTrigger.batch for peak performance and natural viewport responsiveness
 */
export function batchReveal(
  targets: string | Element[],
  options: {
    interval?: number;
    batchMax?: number;
    y?: number;
    stagger?: number;
    start?: string;
  } = {}
) {
  if (isReducedMotion()) return [];

  const {
    interval = 0.08,
    batchMax = 4,
    y = 35,
    stagger = 0.12,
    start = "top 88%",
  } = options;

  return ScrollTrigger.batch(targets, {
    interval,
    batchMax,
    start,
    once: true,
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          stagger,
          duration: 0.85,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    },
  });
}

/**
 * Continuous scrubbed parallax effect for backdrop or editorial imagery
 */
export function setupParallax(
  element: Element | string,
  container: Element | string | null,
  yPercent = 14
) {
  if (isReducedMotion() || !container) return null;

  return gsap.fromTo(
    element,
    { yPercent: -yPercent / 2 },
    {
      yPercent: yPercent / 2,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
}

/**
 * Line or word split text reveal with overflow mask for editorial typography
 */
export function splitTextReveal(
  element: Element | string,
  options: {
    type?: "lines" | "words" | "lines, words";
    stagger?: number;
    duration?: number;
    delay?: number;
    trigger?: Element | string;
    start?: string;
  } = {}
) {
  if (isReducedMotion()) return null;

  const {
    type = "lines",
    stagger = 0.1,
    duration = 0.9,
    delay = 0,
    trigger,
    start = "top 85%",
  } = options;

  try {
    const split = SplitText.create(element, {
      type,
      linesClass: "velora-split-line",
      wordsClass: "velora-split-word",
      mask: "lines",
      autoSplit: true,
    });

    const targetNodes = type.includes("words") ? split.words : split.lines;

    gsap.fromTo(
      targetNodes,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: trigger
          ? {
              trigger,
              start,
              toggleActions: "play none none none",
              once: true,
            }
          : undefined,
      }
    );

    return split;
  } catch (e) {
    console.warn("SplitText initialization notice:", e);
    return null;
  }
}

/**
 * Interactive card hover 3D tilt using gsap.quickTo for 60fps performance
 */
export function setupCardTilt(cardEl: HTMLElement) {
  if (isReducedMotion()) return () => {};

  const xTo = gsap.quickTo(cardEl, "rotationY", { duration: 0.4, ease: "power2.out" });
  const yTo = gsap.quickTo(cardEl, "rotationX", { duration: 0.4, ease: "power2.out" });
  const scaleTo = gsap.quickTo(cardEl, "scale", { duration: 0.35, ease: "power2.out" });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -6; // Max 6 deg
    const rotY = ((x - centerX) / centerX) * 6;  // Max 6 deg

    xTo(rotY);
    yTo(rotX);
  };

  const handleMouseEnter = () => {
    scaleTo(1.02);
  };

  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
    scaleTo(1);
  };

  cardEl.addEventListener("mousemove", handleMouseMove);
  cardEl.addEventListener("mouseenter", handleMouseEnter);
  cardEl.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    cardEl.removeEventListener("mousemove", handleMouseMove);
    cardEl.removeEventListener("mouseenter", handleMouseEnter);
    cardEl.removeEventListener("mouseleave", handleMouseLeave);
  };
}
