import type { Movement } from "@/types";

export const MOVEMENTS: Movement[] = [
  {
    id: "renaissance",
    slug: "renaissance",
    name: "Renaissance",
    era: "14th–17th century",
    summary: "Realism, proportion and the study of human anatomy.",
    blurb:
      "A rebirth of classical ideals — artists turned to anatomy, perspective and proportion to render the human figure with a fidelity the medieval world had set aside. Light and form became tools of observation as much as devotion.",
    sort: 1,
  },
  {
    id: "baroque",
    slug: "baroque",
    name: "Baroque",
    era: "17th–18th century",
    summary: "Drama, rich detail and emotional movement.",
    blurb:
      "Baroque painters chased motion and feeling — deep shadow, theatrical light and dense, gestural composition pull the eye through a scene the way a stage direction would.",
    sort: 2,
  },
  {
    id: "rococo",
    slug: "rococo",
    name: "Rococo",
    era: "18th century",
    summary: "Light, elegant, ornamental and decorative.",
    blurb:
      "A lighter, more playful successor to Baroque grandeur — pastel palettes, curling ornament and scenes of leisure replaced high drama with charm and wit.",
    sort: 3,
  },
  {
    id: "impressionism",
    slug: "impressionism",
    name: "Impressionism",
    era: "1860s–1880s",
    summary: "Fleeting light and everyday scenes in open brushwork.",
    blurb:
      "Painted outdoors, fast, in pursuit of a moment of light before it changed — visible brushwork and everyday subject matter broke with the academy's polish in favour of sensation.",
    sort: 4,
  },
  {
    id: "post-impressionism",
    slug: "post-impressionism",
    name: "Post-Impressionism",
    era: "1880s–1900s",
    summary: "Personal expression, symbolism and structured form.",
    blurb:
      "Where Impressionism chased the optical moment, its successors pushed toward structure, symbol and interior feeling — colour and form used expressively rather than descriptively.",
    sort: 5,
  },
  {
    id: "expressionism",
    slug: "expressionism",
    name: "Expressionism",
    era: "early 20th century",
    summary: "Raw feeling through bold colour and distortion.",
    blurb:
      "Distortion, saturated colour and urgent mark-making in service of emotional truth over optical accuracy — the world rendered as it feels, not as it looks.",
    sort: 6,
  },
  {
    id: "cubism",
    slug: "cubism",
    name: "Cubism",
    era: "1907–1920s",
    summary: "Geometric form and simultaneous viewpoints.",
    blurb:
      "Objects broken into geometric facets and reassembled from multiple viewpoints at once — a rejection of the single fixed perspective that had governed painting since the Renaissance.",
    sort: 7,
  },
  {
    id: "surrealism",
    slug: "surrealism",
    name: "Surrealism",
    era: "1920s–1950s",
    summary: "Dream logic and unexpected juxtaposition.",
    blurb:
      "The logic of dreams rendered with painterly precision — familiar objects in impossible arrangements, drawing on the unconscious as a source of imagery.",
    sort: 8,
  },
  {
    id: "abstract-art",
    slug: "abstract-art",
    name: "Abstract Art",
    era: "20th century–present",
    summary: "Non-representational form — colour and shape first.",
    blurb:
      "Colour, shape and gesture stand on their own, without reference to the visible world — meaning built from composition and material rather than depiction.",
    sort: 9,
  },
  {
    id: "contemporary-art",
    slug: "contemporary-art",
    name: "Contemporary Art",
    era: "1970s–present",
    summary: "Present-day practice across many media and ideas.",
    blurb:
      "A living, plural practice spanning painting, installation and beyond — contemporary work engages the present moment directly, in whatever medium the idea demands.",
    sort: 10,
  },
  {
    id: "sculpture",
    slug: "sculpture",
    name: "Sculpture",
    era: "Ongoing",
    summary: "Three-dimensional work in varied materials.",
    blurb:
      "Form realised in space rather than on a plane — stone, wood, metal and cast material shaped by hand, chisel and mould across every era of art history.",
    sort: 11,
  },
  {
    id: "woodwork",
    slug: "woodwork",
    name: "Woodwork / Carving",
    era: "Ongoing",
    summary: "Traditional carving and woodworking craft.",
    blurb:
      "A craft tradition of carving, joinery and grain — patient, tool-driven work that treats wood's own character as part of the finished piece.",
    sort: 12,
  },
  {
    id: "bronze",
    slug: "bronze",
    name: "Bronze",
    era: "Ongoing",
    summary: "Bronze casting and patination.",
    blurb:
      "Lost-wax casting and hand-worked patina turn molten metal into permanent form — a process as old as antiquity, still central to sculptural practice today.",
    sort: 13,
  },
];

export function getMovementBySlug(slug: string): Movement | undefined {
  return MOVEMENTS.find((m) => m.slug === slug);
}
