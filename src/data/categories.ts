import type { Category, BookingExtra } from "./types";

export const CATEGORIES: Category[] = [
  { id: "domestic", name: "Across Türkiye", blurb: "Valleys, coasts and cities a short hop from home.", icon: "home", image: "cappadocia-2" },
  { id: "international", name: "International", blurb: "Guided journeys across Europe, Asia and the Gulf.", icon: "globe", image: "paris-1" },
  { id: "cultural", name: "Culture & history", blurb: "Empires, temples and the stories between them.", icon: "landmark", image: "istanbul-2" },
  { id: "city", name: "City sightseeing", blurb: "The right streets, at the right hour, with a local.", icon: "city", image: "tokyo-1" },
  { id: "nature", name: "Nature & adventure", blurb: "Big landscapes, fresh air and a little adrenaline.", icon: "leaf", image: "bali-1" },
  { id: "hiking", name: "Mountains & hiking", blurb: "Trails graded honestly, from gentle to summit days.", icon: "mountain", image: "alps-2" },
  { id: "beach", name: "Beach & coast", blurb: "Warm water, slow lunches, long golden evenings.", icon: "wave", image: "antalya-2" },
  { id: "yacht", name: "Yacht & private boats", blurb: "Gulets, catamarans and day boats with a skipper.", icon: "anchor", image: "yacht-1" },
  { id: "cruise", name: "Cruises", blurb: "Fjords, straits and islands, unpacked once.", icon: "ship", image: "cruise-1" },
  { id: "family", name: "Family holidays", blurb: "Paced for small legs, planned for tired parents.", icon: "family", image: "family-1" },
  { id: "romantic", name: "Romance & honeymoon", blurb: "Sunsets reserved, tables for two, time slowed.", icon: "rings", image: "santorini-1" },
  { id: "luxury", name: "Luxury & VIP", blurb: "Private guides, rare access, suites with a view.", icon: "crown", image: "amalfi-1" },
  { id: "multiday", name: "Multi-day holidays", blurb: "Five days or more, every night arranged.", icon: "layers", image: "fjords-1" },
  { id: "weekend", name: "Weekend escapes", blurb: "Two or three days that feel like a week.", icon: "weekend", image: "cappadocia-3" },
  { id: "culinary", name: "Food & culinary", blurb: "Markets, kitchens and the tables locals choose.", icon: "fork", image: "food-1" },
  { id: "seasonal", name: "Seasonal & events", blurb: "Northern lights, winter markets, spring blossoms.", icon: "snowflake", image: "winter-1" },
];

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<string, Category>;

export const EXTRAS: BookingExtra[] = [
  { id: "transfer", name: "Private airport transfer", description: "Door-to-door pickup on arrival and departure.", price: 45, per: "booking" },
  { id: "insurance", name: "Travel protection", description: "Demo cover for cancellation, delays and medical.", price: 19, per: "person" },
  { id: "photo", name: "Photographer for an hour", description: "Edited photos delivered within a week.", price: 120, per: "booking" },
];

export const DEMO_NOTICE =
  "Demo site: tours, prices and availability are illustrative. No real bookings, payments or messages are made.";
