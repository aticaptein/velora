import React from "react";
import { HeroSection } from "../components/home/HeroSection";
import { CategoryScroller } from "../components/home/CategoryScroller";
import { FeaturedSection } from "../components/home/FeaturedSection";
import { DestinationShowcase } from "../components/home/DestinationShowcase";
import { YachtSpotlight } from "../components/home/YachtSpotlight";
import { SeasonalSection } from "../components/home/SeasonalSection";
import { StorySection } from "../components/home/StorySection";
import { PhilosophySection } from "../components/home/PhilosophySection";
import { NewsletterSection } from "../components/home/NewsletterSection";
import { DemoNotice } from "../components/common/DemoNotice";

export const HomePage: React.FC = () => {
  return (
    <>
      <div className="wrap" style={{ paddingTop: "1rem" }}>
        <DemoNotice compact />
      </div>
      <HeroSection />
      <CategoryScroller />
      <FeaturedSection />
      <DestinationShowcase />
      <YachtSpotlight />
      <SeasonalSection />
      <StorySection />
      <PhilosophySection />
      <NewsletterSection />
    </>
  );
};
