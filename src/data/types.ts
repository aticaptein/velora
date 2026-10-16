export type CategoryId =
  | "domestic" | "international" | "cultural" | "city" | "nature" | "hiking" | "beach"
  | "yacht" | "cruise" | "family" | "romantic" | "luxury" | "multiday" | "weekend"
  | "culinary" | "seasonal";

export type Tier = "essential" | "signature" | "luxury";

/** Tour-level booking state. Only `available` and `limited` are bookable. */
export type TourStatus = "available" | "limited" | "soldout" | "cancelled" | "inactive";

export type IconName =
  | "search" | "heart" | "heartFill" | "menu" | "close" | "arrowRight" | "arrowLeft" | "arrowUpRight"
  | "calendar" | "users" | "clock" | "pin" | "check" | "x" | "info" | "plus" | "minus" | "star"
  | "compass" | "mountain" | "wave" | "anchor" | "ship" | "family" | "rings" | "crown" | "layers"
  | "weekend" | "fork" | "snowflake" | "city" | "landmark" | "leaf" | "globe" | "home" | "sliders"
  | "chevronDown" | "chevronLeft" | "chevronRight" | "ticket" | "shield" | "phone" | "mail"
  | "sun" | "alert" | "trash" | "expand" | "route" | "camera" | "car" | "grid" | "list";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  icon: IconName;
  image: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: "Türkiye" | "Europe" | "Asia" | "Middle East" | "Scandinavia";
  tagline: string;
  intro: string;
  /** Distinct identity per destination */
  accent: string;
  ink: string;
  images: string[];
  bestTime: string;
  pace: string;
  idealFor: string;
  moments: { title: string; body: string }[];
}

export interface ItineraryStop {
  title: string;
  body: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  /** multiplier applied to the base price */
  factor: number;
}

export interface Tour {
  slug: string;
  title: string;
  destination: string;
  categories: CategoryId[];
  tier: Tier;
  status: TourStatus;
  statusNote?: string;
  /** EUR. Per adult when pricing = "person", per boat/vehicle when "group". */
  price: number;
  pricing: "person" | "group";
  childRate: number; // fraction of adult price (person pricing)
  childrenAllowed: boolean;
  days: number;
  durationLabel: string;
  groupMax: number;
  rating: number;
  reviews: number;
  images: string[];
  summary: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryStop[];
  included: string[];
  excluded: string[];
  info: string[];
  packages: TourPackage[];
  /** departures every N days */
  cadence: number;
  season?: "spring" | "summer" | "autumn" | "winter" | "all";
  featured?: boolean;
}

export interface Departure {
  date: string; // ISO yyyy-mm-dd
  seatsLeft: number;
  capacity: number;
}

export interface BookingExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  per: "person" | "booking";
}

export interface Traveller {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  requests: string;
}

export interface Booking {
  reference: string;
  tourSlug: string;
  tourTitle: string;
  date: string;
  adults: number;
  children: number;
  packageId: string;
  extras: string[];
  traveller: Traveller;
  total: number;
  createdAt: string;
  status: "confirmed" | "cancelled";
  cancelledAt?: string;
  refund?: number;
}
