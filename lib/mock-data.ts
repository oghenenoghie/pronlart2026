import type { Artist, Artwork, Medium } from "@/types";
import { MOVEMENTS, getMovementBySlug } from "@/lib/movements";

/**
 * Placeholder catalogue for building the UI before Supabase is wired up
 * (build order step 2). Shape matches the real Artwork/Artist/Medium
 * tables so lib/data.ts can swap this for live queries without touching
 * any component.
 */

const MEDIUMS: Record<string, Medium> = {
  oil: { id: "oil", slug: "oil-on-canvas", name: "Oil on canvas" },
  acrylic: { id: "acrylic", slug: "acrylic-on-canvas", name: "Acrylic on canvas" },
  bronze: { id: "bronze-cast", slug: "cast-bronze", name: "Cast bronze" },
  wood: { id: "carved-wood", slug: "carved-wood", name: "Carved wood" },
  marble: { id: "marble", slug: "marble", name: "Marble" },
};

const ARTISTS: Record<string, Artist> = {
  amara: {
    id: "amara-okafor",
    slug: "amara-okafor",
    name: "Amara Okafor",
    statement: "Working between figuration and memory.",
    bio: "Amara Okafor paints from memory rather than reference, building each canvas from the residue of a scene rather than its likeness. Her work has shown in group exhibitions across Lagos and London.",
    status: "active",
  },
  lucien: {
    id: "lucien-vasseur",
    slug: "lucien-vasseur",
    name: "Lucien Vasseur",
    statement: "A study of light as it falls, not as it's remembered.",
    bio: "Lucien Vasseur trained in the classical tradition before turning to the coast, where he now paints outdoors in a single sitting whenever the light allows. His interiors and harbours share a quiet, observational patience.",
    status: "active",
  },
  ines: {
    id: "ines-moretti",
    slug: "ines-moretti",
    name: "Inès Moretti",
    statement: "Bronze as a record of the hand that shaped it.",
    bio: "Inès Moretti works across bronze and marble, favouring direct carving and hand-patination over maquettes and moulds. Each piece keeps visible trace of the process that made it.",
    status: "active",
  },
  tomas: {
    id: "tomas-eriksson",
    slug: "tomas-eriksson",
    name: "Tomas Eriksson",
    statement: "Geometry borrowed from the built world.",
    bio: "Tomas Eriksson draws on architecture and industrial form, working across oil painting and carved wood to find the geometry underneath a subject.",
    status: "active",
  },
};

export const MOCK_ARTISTS: Artist[] = Object.values(ARTISTS);

export function getArtistBySlug(slug: string): Artist | undefined {
  return MOCK_ARTISTS.find((a) => a.slug === slug);
}

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    slug: "quiet-harbour",
    title: "Quiet Harbour",
    artist: ARTISTS.lucien,
    movement: getMovementBySlug("impressionism")!,
    medium: MEDIUMS.oil,
    year: 2023,
    dimensions: "120 × 90 cm",
    materials: "Oil on canvas",
    description:
      "Painted over three sessions at first light, chasing the same stretch of water as the tide and cloud cover changed the colour of everything.",
    price: 85_000_00,
    currency: "NGN",
    status: "available",
    featured: true,
    images: [{ path: "quiet-harbour.jpg", alt: "Quiet Harbour by Lucien Vasseur", isPrimary: true, width: 1600, height: 1200 }],
  },
  {
    id: "2",
    slug: "figures-in-red",
    title: "Figures in Red",
    artist: ARTISTS.amara,
    movement: getMovementBySlug("expressionism")!,
    medium: MEDIUMS.acrylic,
    year: 2024,
    dimensions: "150 × 110 cm",
    materials: "Acrylic on canvas",
    description:
      "Two figures rendered in a single dominant red, the composition built from memory rather than reference.",
    price: null,
    currency: "NGN",
    status: "available",
    featured: true,
    images: [{ path: "figures-in-red.jpg", alt: "Figures in Red by Amara Okafor", isPrimary: true, width: 1400, height: 1750 }],
  },
  {
    id: "3",
    slug: "study-in-bronze-i",
    title: "Study in Bronze I",
    artist: ARTISTS.ines,
    movement: getMovementBySlug("bronze")!,
    medium: MEDIUMS.bronze,
    year: 2022,
    dimensions: "45 × 20 × 18 cm",
    materials: "Cast bronze, hand patina",
    description: "First in a series of seated figures, cast in a single pour and patinated by hand over several weeks.",
    price: 420_000_00,
    currency: "NGN",
    edition: "1/5",
    status: "reserved",
    featured: false,
    images: [{ path: "study-in-bronze-i.jpg", alt: "Study in Bronze I by Inès Moretti", isPrimary: true, width: 1200, height: 1600 }],
  },
  {
    id: "4",
    slug: "fractured-plane",
    title: "Fractured Plane",
    artist: ARTISTS.tomas,
    movement: getMovementBySlug("cubism")!,
    medium: MEDIUMS.oil,
    year: 2021,
    dimensions: "100 × 100 cm",
    materials: "Oil on canvas",
    description: "A single still-life broken into simultaneous viewpoints across a square canvas.",
    price: 210_000_00,
    currency: "NGN",
    status: "sold",
    featured: false,
    images: [{ path: "fractured-plane.jpg", alt: "Fractured Plane by Tomas Eriksson", isPrimary: true, width: 1400, height: 1400 }],
  },
  {
    id: "5",
    slug: "the-long-room",
    title: "The Long Room",
    artist: ARTISTS.lucien,
    movement: getMovementBySlug("renaissance")!,
    medium: MEDIUMS.oil,
    year: 2020,
    dimensions: "90 × 130 cm",
    materials: "Oil on canvas",
    description: "A study of interior light in the manner of the old masters, built up in thin, successive glazes.",
    price: 310_000_00,
    currency: "NGN",
    status: "available",
    featured: true,
    images: [{ path: "the-long-room.jpg", alt: "The Long Room by Lucien Vasseur", isPrimary: true, width: 1600, height: 1150 }],
  },
  {
    id: "6",
    slug: "seated-form",
    title: "Seated Form",
    artist: ARTISTS.ines,
    movement: getMovementBySlug("sculpture")!,
    medium: MEDIUMS.marble,
    year: 2019,
    dimensions: "60 × 30 × 30 cm",
    materials: "Carrara marble",
    description: "Carved directly, without a maquette — the final form found in the stone rather than planned ahead of it.",
    price: null,
    currency: "NGN",
    status: "available",
    featured: false,
    images: [{ path: "seated-form.jpg", alt: "Seated Form by Inès Moretti", isPrimary: true, width: 1200, height: 1500 }],
  },
  {
    id: "7",
    slug: "dream-corridor",
    title: "Dream Corridor",
    artist: ARTISTS.amara,
    movement: getMovementBySlug("surrealism")!,
    medium: MEDIUMS.oil,
    year: 2023,
    dimensions: "80 × 100 cm",
    materials: "Oil on canvas",
    description: "A corridor that does not exist, assembled from the logic of half-remembered dreams.",
    price: 175_000_00,
    currency: "NGN",
    status: "available",
    featured: false,
    images: [{ path: "dream-corridor.jpg", alt: "Dream Corridor by Amara Okafor", isPrimary: true, width: 1500, height: 1200 }],
  },
  {
    id: "8",
    slug: "grain-and-hand",
    title: "Grain and Hand",
    artist: ARTISTS.tomas,
    movement: getMovementBySlug("woodwork")!,
    medium: MEDIUMS.wood,
    year: 2022,
    dimensions: "55 × 25 × 15 cm",
    materials: "Carved iroko",
    description: "The grain of the wood dictated the final silhouette as much as the chisel did.",
    price: 95_000_00,
    currency: "NGN",
    status: "available",
    featured: false,
    images: [{ path: "grain-and-hand.jpg", alt: "Grain and Hand by Tomas Eriksson", isPrimary: true, width: 1300, height: 1600 }],
  },
];

export function getFeaturedArtworks(): Artwork[] {
  return MOCK_ARTWORKS.filter((a) => a.featured);
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return MOCK_ARTWORKS.find((a) => a.slug === slug);
}

export const MOVEMENTS_WITH_COUNTS = MOVEMENTS.map((movement) => ({
  ...movement,
  artworkCount: MOCK_ARTWORKS.filter((a) => a.movement.slug === movement.slug).length,
}));

export const ARTISTS_WITH_COUNTS = MOCK_ARTISTS.map((artist) => ({
  ...artist,
  artworkCount: MOCK_ARTWORKS.filter((a) => a.artist.slug === artist.slug).length,
}));
