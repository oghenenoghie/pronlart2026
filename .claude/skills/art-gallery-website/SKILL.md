---
name: art-gallery-website
description: >
  Full project context for a cinematic art & painting gallery website — a curated
  marketplace where collectors browse and buy original artworks, artists upload and
  sell work, and visitors explore art through movements (Renaissance → Bronze).
  Built on Next.js App Router + TypeScript + Tailwind + shadcn/ui + Neon Postgres, with a
  layered motion system (CSS → Motion → GSAP → optional Three.js/WebGL). Use this skill
  whenever working on the gallery in any way: building or styling pages and components,
  the cinematic scroll-driven exhibition, the artwork viewer / museum-label pattern,
  movement ("art classes") pages, artist profiles, the shop/enquire/sell flows, Neon
  schema/queries, Neon Auth, the media pipeline, or deployment. Trigger even without a project
  name — any mention of the painting gallery, art marketplace, movement/class pages,
  the cinematic exhibition, museum-label metadata, or Artwork/Artist/Movement entities
  qualifies. Reference this before generating any code so palette, type, entities and
  conventions stay consistent.
---

# Art & Painting Gallery — Cinematic Marketplace

A gallery-grade website that brings artists and collectors together around **original
artworks**. Three product surfaces share one design language:

1. **The gallery / shop** — browse and buy original paintings, sculpture, bronze and carving; each work has a museum-quality detail page.
2. **Movements ("art classes")** — thirteen movement pages that explain and curate art by period and idea; they double as the education/discovery layer.
3. **Sell & archive** — artists submit work to sell; sold and past works live on in a permanent archive.

**The thesis:** competitors show art as e-commerce *cards*; this site shows art as
*art*. It wins on **atmosphere and findability** — the browsing experience should feel
like walking a spotlit museum, while the metadata reads like a wall placard.

Keep three principles in view on every screen:

1. **The artwork is the hero.** Chrome recedes; the image dominates; colour lives almost entirely inside the artwork itself.
2. **The museum label is the unit of trust.** Artist · title · year · medium · dimensions · price/POA, set like a gallery placard — consistent everywhere a work appears.
3. **Motion has a purpose or it's cut.** Slow, cinematic, restrained. Never bounce, never flashy. Everything respects `prefers-reduced-motion`.

---

## Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Components by default |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix) | Filters, dialogs, sheets, tabs |
| Smooth scroll | **Lenis** | The base layer that makes the whole site feel cinematic |
| Motion (primary) | **Motion / Framer Motion** | Page + section reveals, text, modals, gallery hover |
| Motion (choreography) | **GSAP + ScrollTrigger** | Pinned sections, horizontal exhibition, scroll-driven camera. **Signature moments only.** |
| Motion (3D) | **Three.js + React Three Fiber + Drei** | **Optional, lazy-loaded.** Framed-painting scene, one hero moment. Never the whole site. |
| Data | **Neon (serverless Postgres)** | System of record — catalogue, enquiries, sell submissions. `@neondatabase/serverless` HTTP driver via `lib/db.ts` |
| Auth | **Neon Auth (Managed Better Auth)** | `/admin/*` sign-in. Called directly over its REST API in `lib/auth/server.ts` — the `@neondatabase/auth` SDK requires Next.js 16+, and this app is on 14 |
| Media | **Neon Postgres (`images` table, bytea)** | Hi-res artwork stored as raw bytes in the same database as everything else — no separate object-storage service. Uploaded via `app/api/media/upload`, served via `app/api/images/[id]`, through `next/image`'s built-in optimizer |
| Payments | Stripe (intl) + Paystack/Flutterwave (NG) + Tap/MyFatoorah (GCC) | Behind a single `PaymentProvider` seam |
| Email | Resend | Enquiry, purchase, sell-submission notifications |
| Search | Postgres FTS + `pg_trgm` (launch) → Meilisearch/Typesense (scale) | Title, artist, movement, medium |
| Hosting / CI | Vercel + GitHub Actions | Lint · typecheck · build green from commit one |

**Money is never a float.** Store integer minor units + a per-currency exponent
(`NGN=2`, `USD=2`, `KWD=3`, `JPY=0`); format at the edge only. A work with no fixed
price is `price = null` and renders as **"Price on request."**

**3D is a progressive enhancement, not a dependency.** The site is fully usable, fast
and beautiful with zero WebGL. Load R3F/Drei only for the signature framed-painting
scene, `dynamic(() => …, { ssr: false })`, gated behind reduced-motion **and** a
capability check. If it can't load, the static hero image is the fallback.

---

## Design system — "Gallery"

Subject world: a spotlit contemporary museum after hours — warm near-black walls,
raked light on canvas, gilt frame edges, hand-set wall placards, faint film grain.
Feel: **hushed, cinematic, editorial.** Typographic character follows the elegant
art-portfolio lineage (Red Art and similar gallery themes): a high-contrast display
serif over a quiet sans, with metadata set like a placard.

House rules (hard constraints — carried from your other projects):
**borders only — no box-shadows, no gradients, no glassmorphism.** Depth comes from
*light on the artwork* (in the 3D/hero layer), never from drop-shadowed UI cards.

### Palette (Tailwind tokens)

| Token | Value | Role |
|---|---|---|
| `ink` | `#0B0A08` | Gallery wall — page background, dark sections |
| `gesso` | `#F4F1EA` | Primary text on `ink`; also the "white-cube" surface colour |
| `ash` | `#A8A39A` | Secondary text, captions, placard metadata |
| `gilt` | `#B08D57` | Frame-gold accent — hairline rules, active state, key CTA. **Used sparingly.** |
| `line` | `rgba(244,241,234,0.12)` | Hairline borders on dark |

Colour otherwise comes **only** from the artwork photography and functional status
chips (available / reserved / sold). Deliberately not the AI-default cream+terracotta.

**White-cube inversion** (for classes/reading sections that want a bright wall): swap
`bg-ink text-gesso` → `bg-gesso text-ink`, borders → `rgba(11,10,8,0.12)`. Same tokens,
inverted roles — keep both modes token-driven, never one-off hexes.

### Typography (via `next/font/google`)

| Role | Typeface | Weights | Used for |
|---|---|---|---|
| **Display** | Playfair Display | 500, 700, 800 (+ italic) | Hero, artwork titles, movement titles |
| **Body / UI** | Inter | 400, 500, 600 | Paragraphs, nav, buttons, filters |
| **Quiet display** (optional) | Cormorant Garamond | 300, 400 | Oversized, low-weight hero lines when a lighter touch is wanted |

Museum-placard metadata is **not** a separate font — it's letter-spaced uppercase
Inter for the labels and Playfair *italic* for the title line. That contrast (tracked
sans caps ↔ high-contrast serif italic) is the signature. Never set fine-art metadata
in a monospace — it reads techy, not curated.

```ts
// lib/fonts.ts
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
export const playfair  = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["500","700","800"], style: ["normal","italic"], display: "swap" });
export const inter     = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400","500","600"], display: "swap" });
export const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-quiet", weight: ["300","400"], display: "swap" });
```

### Type scale

```
display-xl  clamp(3rem, 8vw, 7rem)      Playfair 500   hero / featured artwork title (large, quiet)
display-lg  clamp(2rem, 5vw, 4rem)      Playfair 700   section + movement titles
h2          clamp(1.5rem, 3vw, 2.25rem) Playfair 600
h3          1.25rem                      Inter 600
lede        1.25rem / 1.7               Inter 400      intro paragraphs, movement summaries
body        1.0625rem / 1.7            Inter 400
label       0.75rem uppercase 0.18em   Inter 500      eyebrows, nav, placard field labels
placard     0.875rem                    Inter 400 + Playfair italic   museum label (see pattern)
```

### The museum label (signature typographic pattern)

Everywhere a work appears — card, detail, exhibition, archive — its metadata is set
identically, like a placard beside the canvas:

```
ARTIST NAME                     ← label: Inter 500, uppercase, tracked, ash
Artwork Title, 2024             ← Playfair italic, gesso
Oil on canvas                   ← body-sm, ash
120 × 90 cm                     ← body-sm, ash, tabular-nums
₦ 850,000   ·   On request      ← Inter 500; POA when price is null
```

Build it once as `<Placard work={…} />` and reuse it. `tabular-nums` on dimensions and price.

### Structure, motion, signature

- **Generous negative space.** Art needs a matte. Wide margins; one focal work per viewport in hero/exhibition contexts.
- **Hairline rules** (`gilt` at low opacity) separate sections and frame placards like a drawing sheet. No filled dividers.
- **Film grain:** a single fixed overlay at ~3–4% opacity, `mix-blend-mode: screen`, `pointer-events: none`. Extremely subtle — it should be felt, not seen. Ship it off `prefers-reduced-motion`? No — grain is static, keep it; it's transforms that get cut.
- **Custom cursor (desktop only):** a small dot with slight lag via `requestAnimationFrame` (never React state at 60fps); shifts to an "EXPLORE" state over artwork. Disabled on touch and under reduced-motion.
- **Signature moment:** the home page is a **scroll-driven cinematic exhibition** — each major work enters, holds under raked light, and hands off to the next as you scroll. Optionally the featured hero is a real 3D framed canvas (R3F) with a slow spotlight; everything else is Motion/GSAP over flat `next/image`.

### Motion hierarchy (use the lightest tool that works)

| Level | Tool | For |
|---|---|---|
| 1 | CSS / Tailwind | hover, buttons, menus, focus, small state |
| 2 | Motion (Framer) | page transitions, text + section reveals, cards, modals, gallery hover |
| 3 | GSAP + ScrollTrigger | pinned sections, horizontal exhibition, scroll-driven camera/light |
| 4 | Three.js / R3F + Drei | framed-painting scene, spotlight, one hero moment (lazy, optional) |
| 5 | WebGL shader | signature artwork→artwork dissolve transition only |

Reveal defaults: `opacity 0→1`, `y 24px→0`, `duration 0.6–0.9s`, cinematic `easeOut`,
`viewport once, amount 0.15`. Slower and calmer than a SaaS site — but never so slow it
feels broken. **Every animation respects `useReducedMotion()`**: fades stay, distances
collapse to 0, 3D falls back to the static image, pinned scroll releases.

```tsx
// components/motion/Reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Data model

Taxonomy is the backbone. Model it before building UI.

| Entity | Purpose | Key fields |
|---|---|---|
| **Artist** | A maker with a public profile | name, slug, portrait, statement, bio, links(jsonb), status(active\|archived) |
| **Movement** | The "art classes" taxonomy (see seed) | name, slug, era, summary, blurb, hero_image, sort |
| **Medium** | Painting, sculpture, bronze, carving… | name, slug (may pair with a Movement) |
| **Artwork** | A single original work | title, slug, artist→, movement→, medium→, year, dimensions(text), materials, description/story, price(bigint minor units, nullable=POA), currency, edition, status(available\|reserved\|sold), images[], featured(bool) |
| **Exhibition / Collection** | A curated, scroll-driven set | title, slug, curator_note, artwork_ids[], hero_image, published_at |
| **Enquiry / Order** | Purchase or POA enquiry | type(purchase\|enquiry\|sell), artwork→ (nullable for sell), name, email, message, offer(minor units, nullable), attachments[], status |
| **SellSubmission** | Artist-submitted work to list | artist name/email, title, movement, medium, dimensions, asking price, images[], status(pending\|accepted\|declined) |
| **Post** | Blog / journal / archive writing | title, slug, cover, body(mdx/portable text), published_at, tags[] |

`Artwork.images[]` shape: `{ path, alt, isPrimary, width, height }` (`path` is
`/api/images/{id}`, this app's own serving route; keep `width/height` to prevent layout
shift). One `isPrimary: true`.

Use Postgres: `bigint` for money; `jsonb` for artist links and flexible metadata;
`pg_trgm` GIN index on `artworks.title` for fuzzy search. Access control lives in the
app layer, not RLS: public pages only ever call the read functions in `lib/data.ts`;
writes go through `/admin/*` server actions gated by `requireAdmin()`
(`lib/admin-auth.ts`), which checks the signed-in Neon Auth user's `role = 'admin'`.

### Movement seed ("Art Classes")

Thirteen movements power `/movements` and every filter. Reworded, extend the blurbs
into full essays on each movement page.

| # | Movement | slug | One-line |
|---|---|---|---|
| 1 | Renaissance | `renaissance` | Realism, proportion and the study of human anatomy. |
| 2 | Baroque | `baroque` | Drama, rich detail and emotional movement. |
| 3 | Rococo | `rococo` | Light, elegant, ornamental and decorative. |
| 4 | Impressionism | `impressionism` | Fleeting light and everyday scenes in open brushwork. |
| 5 | Post-Impressionism | `post-impressionism` | Personal expression, symbolism and structured form. |
| 6 | Expressionism | `expressionism` | Raw feeling through bold colour and distortion. |
| 7 | Cubism | `cubism` | Geometric form and simultaneous viewpoints. |
| 8 | Surrealism | `surrealism` | Dream logic and unexpected juxtaposition. |
| 9 | Abstract Art | `abstract-art` | Non-representational form — colour and shape first. |
| 10 | Contemporary Art | `contemporary-art` | Present-day practice across many media and ideas. |
| 11 | Sculpture | `sculpture` | Three-dimensional work in varied materials. |
| 12 | Woodwork / Carving | `woodwork` | Traditional carving and woodworking craft. |
| 13 | Bronze | `bronze` | Bronze casting and patination. |

---

## Media pipeline (Neon Postgres → next/image)

The site lives or dies on image quality. Fine art must render crisp, colour-true and fast.

- **Upload:** `ImageUploadField` sends the raw file to `app/api/media/upload`, which checks the admin session, then inserts the bytes into the `images` table (`id uuid`, `data bytea`, `content_type`, `width`, `height`) via `lib/db.ts`'s `sql`. File bytes pass through our own server (no signed client-token handoff to a third party).
- **Deliver:** the upload route returns the new row's `id`; `Artwork.images[].path` and `Movement.heroImage` store `/api/images/{id}` — a route on this same app, not an absolute external URL. `app/api/images/[id]/route.ts` streams the bytes back with an immutable long-lived `Cache-Control` header (rows are never updated in place — a re-upload creates a new row/id). No `images.remotePatterns` needed in `next.config.mjs` since these are same-origin; Next's built-in Image Optimization API still handles `webp`/`avif` variants on top. `priority` only on the hero/LCP work; everything below the fold lazy-loads.
- **Colour fidelity:** never JPEG-crush originals; keep quality high on detail/zoom views — collectors judge on colour and surface. Preserve aspect ratio; no forced crops on the detail page (crops are fine for grid thumbs).
- **Zoom:** pinch/scroll zoom on the detail page (`react-medium-image-zoom` or a lightbox) so buyers can inspect brushwork — not yet built.
- **Trade-off, deliberate:** storing bytes in Postgres means every image byte is served from this app's single Neon region rather than a CDN edge, and the database grows with every upload. Chosen over Vercel Blob specifically to keep the whole stack on one connection string — no second service with its own token/env-var to misconfigure. Move to Cloudinary/imgproxy/S3 behind the same "store a path, serve via a route" convention if this ever becomes a bottleneck.

---

## Cinematic exhibition (the signature experience)

The home page is a scroll-driven walk past featured works, not a stack of cards.

- **Lenis** drives smooth scroll globally; **GSAP ScrollTrigger** pins each featured work while its placard reveals and the light shifts, then releases into the next.
- Structure the hero as: black → grain → light rises → featured artwork resolves (`opacity 0→1`, `scale 1.06→1`, `blur 12px→0`) → title fades in → placard appears. Subtle mouse parallax on the artwork only.
- **Optional 3D:** the single featured work can be a real framed canvas in R3F (thickness, frame, slow spotlight, faint camera drift). Lazy-load, `ssr:false`, reduced-motion and capability gated; static `next/image` is the guaranteed fallback.
- **Signature transition (level 5):** artwork→artwork handoff uses a WebGL displacement/dissolve shader ("paint dissolve") — reserved for this one place. Everywhere else, a plain cross-fade.

```tsx
// components/exhibition/FeaturedCanvas.tsx — lazy, optional 3D hero
"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
const Scene = dynamic(() => import("./PaintingScene"), { ssr: false });
export function FeaturedCanvas({ work }: { work: Artwork }) {
  const reduce = useReducedMotion();
  const canWebGL = typeof window !== "undefined" && !!document.createElement("canvas").getContext("webgl");
  if (reduce || !canWebGL) return <StaticHero work={work} />; // guaranteed fallback
  return <Scene work={work} />;
}
```

---

## Search & filtering

- **Launch:** Postgres FTS + `pg_trgm` `ILIKE` across title, artist, materials. Facets (movement, medium, availability, price band) are indexed columns → fast `WHERE`.
- **UX:** a facet rail on `/gallery` using shadcn `Accordion`/`Checkbox`; URL-synced filters (`?movement=impressionism&status=available`) — shareable + SEO-friendly. Sort by newest / price / artist.
- **Scale:** Meilisearch/Typesense for typo-tolerance as the catalogue grows.

---

## Routes

```
/                              Home — cinematic exhibition, featured works, movements, artists
/gallery                       Shop/browse all artworks (facet rail, URL-synced filters)
/artworks/[slug]               Artwork detail — museum label, story, zoom/3D, buy/enquire
/movements                     The "art classes" index (13 movements)
/movements/[slug]              Movement essay + curated works in that movement
/artists  /artists/[slug]      Artist index + profile (statement, works)
/exhibitions/[slug]            Scroll-driven curated exhibition
/archive                       Past & sold works (permanent record)
/sell                          Submit artwork to sell (reuses media pipeline)
/blog  /blog/[slug]            Journal
/about  /contact
/admin/*                       Neon Auth-gated (role=admin): artwork/artist/movement CRUD, media, enquiries, submissions
```

## Folder structure

```
app/
├── (site)/            layout, page (exhibition), gallery, artworks, movements, artists,
│                      exhibitions, archive, sell, blog, about, contact, loading.tsx, error.tsx
├── admin/             login (Neon Auth sign-in), (protected)/ — artworks, artists, movements, mediums, enquiries, submissions
└── api/               auth is called directly from server code (no proxy route — see lib/auth/server.ts); media/upload, images/[id], enquiry, sell-submit, checkout, revalidate
components/
├── ui/                shadcn primitives + Button/LinkButton (buttonClass) — the one CTA style, never inline the border-gilt classes again
├── admin/             AdminNav, ArtworkForm, ArtistForm, MovementForm, MediumForm, ImageUploadField (Neon `images` table), DeleteButton, StatusSelect
├── common/            Header (active link + mobile drawer), Footer, EmptyState, RouteError, Search, CustomCursor, Grain
├── art/               ArtworkCard, Placard, Gallery, Zoom, FacetRail, StatusChip
├── exhibition/        FeaturedCanvas, PaintingScene, ExhibitionScroll
└── motion/            Reveal, TextReveal, LenisProvider, Stagger (StaggerGroup/StaggerItem — grid/list reveal)
lib/                   db.ts (Neon client), data.ts (all reads + enquiry/submission writes), auth/server.ts (Neon Auth REST client), admin-auth.ts (requireAdmin), fonts.ts, money.ts, search.ts, payments.ts, utils.ts (cn, slugify, fieldClass, fieldLabelClass)
types/                 index.ts (Artwork, Artist, Movement, Exhibition, Enquiry…)
```

---

## Key flows

- **Buy / enquire:** priced works → checkout via `PaymentProvider` (Stripe/Paystack/Tap by region). POA works → enquiry form (Neon insert + Resend). Prefill artwork ref; on sale, flip status → `reserved`/`sold`.
- **Sell artwork:** public `SellSubmission` form (title, movement, medium, dimensions, asking price, images) → Storage upload + insert + Resend to admin. Admin accepts → becomes an Artwork.
- **Archive:** sold works stay live, marked `sold`, and flow into `/archive` — provenance + a trust signal, never deleted (append-only spirit).
- **Movement page:** essay (`lede` + body) + a curated, filterable grid of works in that movement — this is the "class."

---

## Conventions

- Server Components by default; `"use client"` only for state/effects/handlers/Motion/GSAP/R3F, pushed as low as possible.
- `cn()` (clsx + tailwind-merge) for all className merges; no inline styles except Motion `style`.
- Money through `lib/money.ts` (parse, add, format by currency exponent) — never raw arithmetic on prices in components.
- Every data route gets `loading.tsx`; every route group gets `error.tsx` (rendering shared `components/common/RouteError.tsx` with a route-specific message — never re-inline the markup).
- Every CTA is `Button`/`LinkButton` from `components/ui/button.tsx` (or `buttonClass()` for a non-`<button>`/`<Link>` element like a `mailto:` anchor) — never inline the border-gilt hover classes again. Every form field uses `lib/utils.ts`'s `fieldClass`/`fieldLabelClass`.
- Every page header (h1 + lede) wraps in `<Reveal>`; every card grid or list wraps in `<StaggerGroup>`/`<StaggerItem>` (`components/motion/Stagger.tsx`) so results reveal in a gentle stagger, not a hard pop-in.
- Every "no results" case renders `components/common/EmptyState.tsx` (heading + explanation + optional action) — never a bare line of text.
- `generateMetadata()` on every public page; per-artwork OG images + sitemap for SEO. Art is shared on social — OG images matter.
- Accessibility floor: visible keyboard focus, `useReducedMotion()` honoured, Radix a11y, alt text required on every artwork image, custom cursor never traps interaction.
- Performance floor: 60fps target; lazy-load 3D and below-fold media; GPU-friendly transforms only (`transform`/`opacity`, never animate layout); Lighthouse CI in the pipeline.
- Conventional commits; CI (lint + typecheck + build) green before merge; `.env.example` committed, secrets never.
- Deliver production-ready code that can be committed immediately.

## Build order

1. Repo + Next.js + Tailwind + fonts + tokens + Lenis provider + Grain; GitHub Actions + Vercel from commit one.
2. Neon schema + movement seed (13) + typed data-access layer (`lib/data.ts`).
3. Media pipeline (Storage + `next/image` loader) wired end-to-end before listing UI.
4. `Placard` + `ArtworkCard` + gallery list/detail + facet search (Postgres FTS).
5. Movement pages (essays + curated grids) — the "classes."
6. Cinematic exhibition home (Lenis + GSAP), then the optional 3D featured hero + shader transition.
7. Buy / enquire / sell flows (payments + Resend); artist profiles; archive.
8. Admin CRUD + auth (Neon Auth, `requireAdmin`). Polish: OG images, sitemap, Lighthouse CI, analytics.
