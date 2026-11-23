"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArtworkImage } from "@/components/art/ArtworkImage";
import { Placard } from "@/components/art/Placard";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { Artwork } from "@/types";

const HERO_STYLES = [
  { name: "Cinematic", note: "Immersive artwork-led opening" },
  { name: "Horizontal", note: "Curated artwork rail" },
  { name: "Exhibition", note: "Full-screen gallery wall" },
  { name: "Artist", note: "Editorial artist feature" },
  { name: "Asymmetric", note: "Contemporary gallery composition" },
] as const;

const MODAL_STYLES = ["Immersive", "Editorial", "Museum", "Collector"] as const;
type ModalStyle = (typeof MODAL_STYLES)[number];

function ArtworkModal({
  artwork,
  style,
  onStyleChange,
  onClose,
}: {
  artwork: Artwork;
  style: ModalStyle;
  onStyleChange: (style: ModalStyle) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const image = <ArtworkImage artwork={artwork} className="h-full w-full border border-line" />;
  const details = (
    <div className="space-y-5">
      <div>
        <p className="font-body text-label uppercase tracking-[0.2em] text-gilt">{artwork.artist.name}</p>
        <h3 className="mt-3 font-display text-3xl italic leading-tight text-gesso sm:text-4xl">{artwork.title}</h3>
        <p className="mt-2 font-body text-sm text-ash">{artwork.year} · {artwork.movement.name}</p>
      </div>
      <div className="h-px w-16 bg-gilt/60" />
      <Placard artwork={artwork} />
      <p className="max-w-xl font-body text-sm leading-7 text-ash">{artwork.description}</p>
      <Link
        href={`/artworks/${artwork.slug}`}
        className="inline-flex border border-gilt px-6 py-3 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
      >
        View artwork details
      </Link>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-3 sm:p-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-modal-title"
        className="relative flex max-h-[94vh] w-full max-w-7xl flex-col overflow-y-auto border border-line bg-ink"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <div>
            <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-ash">Artwork viewing room</p>
            <p id="artwork-modal-title" className="mt-1 font-display text-lg italic text-gesso">{artwork.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 hidden font-body text-[0.6rem] uppercase tracking-[0.16em] text-ash sm:inline">Presentation</span>
            {MODAL_STYLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onStyleChange(item)}
                aria-pressed={style === item}
                className={`border px-3 py-2 font-body text-[0.6rem] uppercase tracking-[0.14em] transition-colors ${style === item ? "border-gilt bg-gilt text-ink" : "border-line text-ash hover:border-gilt hover:text-gesso"}`}
              >
                {item}
              </button>
            ))}
            <button type="button" onClick={onClose} aria-label="Close artwork viewer" className="ml-2 border border-line px-3 py-2 text-lg leading-none text-gesso transition-colors hover:border-gilt hover:text-gilt">×</button>
          </div>
        </div>

        {style === "Immersive" && (
          <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_300px]">
            <div className="flex min-h-[48vh] items-center justify-center bg-black/30 p-5 sm:p-10">{image}</div>
            <aside className="flex items-center border-t border-line p-6 lg:border-l lg:border-t-0 lg:p-9">{details}</aside>
          </div>
        )}
        {style === "Editorial" && (
          <div className="grid min-h-0 flex-1 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 flex items-center p-7 sm:p-12 lg:order-1">{details}</div>
            <div className="order-1 flex min-h-[42vh] items-center justify-center border-b border-line bg-black/25 p-6 sm:p-10 lg:order-2 lg:border-b-0 lg:border-l">{image}</div>
          </div>
        )}
        {style === "Museum" && (
          <div className="grid min-h-0 flex-1 bg-gesso text-ink lg:grid-cols-[1fr_340px]">
            <div className="flex min-h-[46vh] items-center justify-center bg-[#e9e4da] p-6 sm:p-12">{image}</div>
            <aside className="flex flex-col justify-center border-t border-black/10 p-7 sm:p-10 lg:border-l lg:border-t-0">
              <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-[#8b704b]">Exhibition label · {artwork.movement.name}</p>
              <h3 className="mt-5 font-display text-3xl italic leading-tight text-ink">{artwork.title}</h3>
              <p className="mt-2 font-body text-sm text-ink/65">{artwork.artist.name}, {artwork.year}</p>
              <div className="my-6 h-px w-12 bg-[#B08D57]" />
              <p className="font-body text-sm leading-7 text-ink/70">{artwork.materials}<br />{artwork.dimensions}<br />{artwork.movement.era}</p>
              <p className="mt-7 font-body text-sm leading-7 text-ink/70">{artwork.description}</p>
              <Link href={`/artworks/${artwork.slug}`} className="mt-8 self-start border border-ink px-5 py-3 font-body text-[0.65rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-gesso">Explore this work</Link>
            </aside>
          </div>
        )}
        {style === "Collector" && (
          <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_360px]">
            <div className="flex min-h-[45vh] items-center justify-center bg-black/25 p-6 sm:p-12">{image}</div>
            <aside className="border-t border-line p-7 sm:p-10 lg:border-l lg:border-t-0">
              <p className="font-body text-label uppercase tracking-[0.2em] text-gilt">Private collection view</p>
              <h3 className="mt-5 font-display text-3xl italic text-gesso">{artwork.title}</h3>
              <p className="mt-2 font-body text-sm text-ash">{artwork.artist.name} · {artwork.year}</p>
              <div className="my-7 border-y border-line py-5"><Placard artwork={artwork} /></div>
              <p className="font-body text-sm leading-7 text-ash">{artwork.description}</p>
              <p className="mt-7 border-l border-gilt pl-4 font-body text-xs leading-6 text-ash">Availability: {artwork.status}. For provenance, condition notes and acquisition enquiries, contact the gallery.</p>
              <Link href={`/artworks/${artwork.slug}`} className="mt-8 inline-flex border border-gilt px-5 py-3 font-body text-[0.65rem] uppercase tracking-[0.16em] text-gesso transition-colors hover:bg-gilt hover:text-ink">Enquire privately</Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export function HeroCarousel({ works }: { works: Artwork[] }) {
  const [activeStyle, setActiveStyle] = useState(0);
  const [activeWork, setActiveWork] = useState(0);
  const [modalStyle, setModalStyle] = useState<ModalStyle>("Immersive");
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const current = works[activeWork] ?? works[0];
  const previous = works[(activeWork - 1 + works.length) % works.length] ?? current;
  const next = works[(activeWork + 1) % works.length] ?? current;

  const closeViewer = useCallback(() => setIsOpen(false), []);
  const transition = reduceMotion ? "" : "transition-all duration-700 ease-out";

  if (!current) return null;

  const openViewer = () => {
    setModalStyle("Immersive");
    setIsOpen(true);
  };
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-ink">
        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12 lg:pt-10">
          <div className="flex flex-col justify-between gap-5 border-b border-line pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-gilt">The Pronlart collection</p>
              <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.98] text-gesso">Art deserves <em className="font-normal">room</em> to breathe.</h1>
            </div>
            <p className="max-w-xs font-body text-sm leading-6 text-ash">Original paintings, sculpture and bronze. A considered journey through artists, movements and material.</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-ash">Explore five ways to experience the gallery</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Hero presentation styles">
              {HERO_STYLES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveStyle(index)}
                  aria-pressed={activeStyle === index}
                  className={`border px-3 py-2 font-body text-[0.6rem] uppercase tracking-[0.14em] transition-colors sm:px-4 ${activeStyle === index ? "border-gilt bg-gilt text-ink" : "border-line text-ash hover:border-gilt hover:text-gesso"}`}
                >
                  <span className="mr-1.5 opacity-60">0{index + 1}</span>{item.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`relative mt-5 min-h-[min(780px,calc(100svh-5rem))] overflow-hidden border border-line sm:min-h-[min(860px,calc(100svh-5rem))] ${transition}`}>
            {activeStyle === 0 && (
              <div className="absolute inset-0 isolate min-h-[min(780px,calc(100svh-5rem))] bg-[#100d09]">
                <div
                  className="absolute inset-0 z-0 scale-[1.02] bg-cover bg-center"
                  role="img"
                  aria-label="Grand classical sculpture gallery"
                  style={{ backgroundImage: "url('https://cdn.sanity.io/images/cctd4ker/production/3513bc5d23fe1cc24c46f03d1b3900cd3caa26ee-5120x2880.jpg?auto=format&fit=clip&q=75&w=1800')" }}
                />
                <div aria-hidden className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(13,10,7,.72),rgba(13,10,7,.34)_48%,rgba(13,10,7,.68)),linear-gradient(0deg,rgba(10,8,6,.62),transparent_34%,rgba(10,8,6,.36))]" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pb-20 pt-24 text-center sm:px-10">
                  <p className="font-body text-[0.65rem] uppercase tracking-[0.34em] text-gesso/80">Pronlart · Art &amp; timeless expression</p>
                  <h2 className="mt-7 max-w-5xl font-display text-[clamp(3.1rem,8.4vw,7.4rem)] font-normal uppercase leading-[0.91] tracking-[-0.045em] text-[#fbf8f1] drop-shadow-[0_3px_24px_rgba(0,0,0,.3)]">
                    Where art lives<br />beyond time
                  </h2>
                  <p className="mt-7 max-w-xl font-body text-sm leading-7 text-white/90 sm:text-base">
                    A gallery where imagination, emotion, and stories<br className="hidden sm:block" /> come alive through every artwork.
                  </p>
                  <Link href="/gallery" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 px-7 py-3 font-body text-sm text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#17130f]">
                    Discover the Art
                  </Link>
                </div>
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 sm:bottom-8 sm:left-10">
                  <span className="h-px w-8 bg-gilt" />
                  <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-white/70">Featured collection</span>
                </div>
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 sm:bottom-8 sm:right-10">
                  <button type="button" onClick={() => setActiveWork((activeWork - 1 + works.length) % works.length)} aria-label="Previous featured artwork" className="grid h-10 w-10 place-items-center rounded-full border border-white/45 text-white transition-colors hover:bg-white hover:text-ink">←</button>
                  <span className="min-w-12 text-center font-body text-[0.62rem] tabular-nums tracking-[0.18em] text-white/80">0{activeWork + 1} / 0{works.length}</span>
                  <button type="button" onClick={() => setActiveWork((activeWork + 1) % works.length)} aria-label="Next featured artwork" className="grid h-10 w-10 place-items-center rounded-full border border-white/45 text-white transition-colors hover:bg-white hover:text-ink">→</button>
                </div>
              </div>
            )}

            {activeStyle === 1 && (
              <div className="absolute inset-0 grid bg-[#100f0d] lg:grid-cols-[0.8fr_1.2fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                  <div><p className="font-body text-label uppercase tracking-[0.2em] text-gilt">02 / Horizontal art rail</p><h2 className="mt-5 font-display text-4xl italic text-gesso sm:text-5xl">Collected moments.</h2><p className="mt-4 max-w-sm font-body text-sm leading-7 text-ash">Move through a handpicked selection of original works, each with its own story.</p></div>
                  <div className="mt-8"><Placard artwork={current} /><button onClick={openViewer} className="mt-7 border border-gilt px-5 py-3 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">Open artwork</button></div>
                </div>
                <div className="flex min-h-[360px] items-center gap-4 overflow-hidden border-t border-line p-5 sm:p-8 lg:border-l lg:border-t-0">
                  {[previous, current, next].map((artwork, index) => (
                    <button key={artwork.id} onClick={() => setActiveWork(works.findIndex((work) => work.id === artwork.id))} className={`group flex h-full min-w-[52%] flex-col justify-center text-left ${index === 1 ? "opacity-100" : "opacity-45 hover:opacity-80"}`}>
                      <ArtworkImage artwork={artwork} className={`w-full border border-line ${index === 1 ? "max-h-[430px]" : "max-h-[340px]"}`} />
                      <span className="mt-4 font-display text-xl italic text-gesso">{artwork.title}</span><span className="mt-1 font-body text-[0.6rem] uppercase tracking-[0.16em] text-ash">{artwork.artist.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeStyle === 2 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090807] px-6 py-10 text-center">
                <p className="font-body text-label uppercase tracking-[0.2em] text-gilt">03 / Full-screen exhibition</p>
                <div className="mt-7 flex h-[55%] w-full max-w-3xl items-center justify-center"><ArtworkImage artwork={current} className="h-full max-w-full border border-line" /></div>
                <h2 className="mt-7 font-display text-3xl italic text-gesso sm:text-5xl">{current.title}</h2><p className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-ash">{current.artist.name} · {current.year}</p>
                <div className="mt-7 flex items-center gap-5"><button onClick={() => setActiveWork((activeWork - 1 + works.length) % works.length)} aria-label="Previous artwork" className="border border-line px-4 py-2 text-gesso hover:border-gilt">←</button><span className="font-body text-[0.65rem] tabular-nums tracking-[0.2em] text-ash">0{activeWork + 1} / 0{works.length}</span><button onClick={() => setActiveWork((activeWork + 1) % works.length)} aria-label="Next artwork" className="border border-line px-4 py-2 text-gesso hover:border-gilt">→</button><button onClick={openViewer} className="ml-2 border border-gilt px-4 py-2 font-body text-[0.6rem] uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">View details</button></div>
              </div>
            )}

            {activeStyle === 3 && (
              <div className="absolute inset-0 grid bg-[#100f0d] lg:grid-cols-2">
                <div className="flex flex-col justify-center p-8 sm:p-14"><p className="font-body text-label uppercase tracking-[0.2em] text-gilt">04 / Artist spotlight</p><p className="mt-8 font-body text-xs uppercase tracking-[0.18em] text-ash">Featured artist</p><h2 className="mt-3 font-display text-5xl italic leading-tight text-gesso sm:text-6xl">{current.artist.name}</h2><p className="mt-5 max-w-md font-body text-base leading-7 text-ash">{current.artist.statement ?? current.description}</p><div className="mt-8 border-t border-line pt-5"><Placard artwork={current} /></div><button onClick={openViewer} className="mt-8 self-start border border-gilt px-6 py-3 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">Discover the work</button></div>
                <div className="relative flex min-h-[390px] items-center justify-center border-t border-line p-8 lg:border-l lg:border-t-0"><div className="h-full max-h-[550px] w-full max-w-lg"><ArtworkImage artwork={current} className="h-full w-full border border-line" /></div><span className="absolute bottom-8 right-8 font-body text-[0.6rem] uppercase tracking-[0.2em] text-ash">Artist no. 0{activeWork + 1}</span></div>
              </div>
            )}

            {activeStyle === 4 && (
              <div className="absolute inset-0 grid bg-[#0d0c0a] lg:grid-cols-[0.65fr_1fr_0.65fr]">
                <div className="hidden flex-col justify-center border-r border-line p-8 lg:flex"><p className="font-body text-label uppercase tracking-[0.18em] text-gilt">05 / Asymmetric gallery</p><p className="mt-5 font-display text-3xl italic leading-tight text-gesso">A dialogue between form and feeling.</p><p className="mt-4 font-body text-sm leading-7 text-ash">A shifting arrangement of works, curated to invite discovery.</p></div>
                <div className="flex flex-col items-center justify-center p-7 sm:p-12"><p className="mb-5 font-body text-label uppercase tracking-[0.18em] text-gilt lg:hidden">05 / Asymmetric gallery</p><div className="w-full max-w-lg"><ArtworkImage artwork={current} className="w-full border border-line" /></div><h2 className="mt-5 text-center font-display text-3xl italic text-gesso">{current.title}</h2><p className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-ash">{current.artist.name} · {current.year}</p><button onClick={openViewer} className="mt-6 border border-gilt px-6 py-3 font-body text-label uppercase tracking-[0.16em] text-gesso hover:bg-gilt hover:text-ink">View the piece</button></div>
                <div className="hidden flex-col justify-end gap-5 border-l border-line p-8 lg:flex"><div className="h-40 w-28 self-end opacity-60"><ArtworkImage artwork={next} className="h-full w-full" /></div><div><p className="font-body text-label uppercase tracking-[0.16em] text-ash">Also in focus</p><p className="mt-2 font-display text-xl italic text-gesso">{next.title}</p><p className="mt-1 font-body text-xs text-ash">{next.artist.name}</p></div><Link href="/gallery" className="mt-4 border-t border-line pt-4 font-body text-label uppercase tracking-[0.16em] text-gesso hover:text-gilt">Browse all works ↗</Link></div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-xs text-ash">{HERO_STYLES[activeStyle].note}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveWork((activeWork - 1 + works.length) % works.length)} className="border border-line px-4 py-2 font-body text-xs text-gesso hover:border-gilt" aria-label="Previous featured artwork">←</button>
              <span className="min-w-14 text-center font-body text-[0.65rem] tabular-nums tracking-[0.16em] text-ash">0{activeWork + 1} / 0{works.length}</span>
              <button onClick={() => setActiveWork((activeWork + 1) % works.length)} className="border border-line px-4 py-2 font-body text-xs text-gesso hover:border-gilt" aria-label="Next featured artwork">→</button>
            </div>
          </div>
        </div>
      </section>
      {isOpen && <ArtworkModal artwork={current} style={modalStyle} onStyleChange={setModalStyle} onClose={closeViewer} />}
    </>
  );
}
