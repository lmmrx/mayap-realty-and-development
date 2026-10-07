export type PropertyType = "house-and-lot" | "condo" | "other";

export type ListingStatus = "available" | "reserved" | "sold-out";

export interface Listing {
  slug: string;
  title: string;
  type: PropertyType;
  location: string;
  city: string;
  developer: string;
  priceFrom: number;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  lotArea: number | null;
  status: ListingStatus;
  featured: boolean;
  summary: string;
  description: string[];
  features: string[];
  images: string[];
}

export interface NewsPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
  category: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  property?: string;
  createdAt: string;
  read: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  contactEmail: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}
