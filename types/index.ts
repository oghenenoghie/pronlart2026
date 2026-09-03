export type ArtworkStatus = "available" | "reserved" | "sold";

export type ArtworkImage = {
  path: string;
  alt: string;
  isPrimary: boolean;
  width: number;
  height: number;
};

export type Artist = {
  id: string;
  slug: string;
  name: string;
  portrait?: string;
  statement?: string;
  bio?: string;
  links?: Record<string, string>;
  status: "active" | "archived";
};

export type Movement = {
  id: string;
  slug: string;
  name: string;
  era: string;
  summary: string;
  blurb: string;
  heroImage?: string;
  sort: number;
};

export type Medium = {
  id: string;
  slug: string;
  name: string;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  artist: Artist;
  movement: Movement;
  medium: Medium;
  year: number;
  dimensions: string;
  materials: string;
  description: string;
  /** integer minor units; null = price on request */
  price: number | null;
  currency: string;
  edition?: string;
  status: ArtworkStatus;
  images: ArtworkImage[];
  featured: boolean;
};

export type EnquiryType = "purchase" | "enquiry";

export type EnquiryInput = {
  type: EnquiryType;
  artworkSlug: string;
  name: string;
  email: string;
  message?: string;
  /** integer minor units; only meaningful for an offer against a POA work */
  offer?: number;
};

export type SiteImage = {
  path: string;
  alt: string;
  width: number;
  height: number;
};

export type SellSubmissionInput = {
  artistName: string;
  artistEmail: string;
  title: string;
  movement: string;
  medium: string;
  dimensions: string;
  askingPrice?: string;
  message?: string;
};
