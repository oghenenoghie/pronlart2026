"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "b-edge-holiday-modal-dismissed-2027";

export function HolidayModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) !== "1") {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeModal() {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // The modal can still be closed when storage is unavailable.
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="holiday-modal-title"
        aria-describedby="holiday-modal-description"
        aria-modal="true"
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#d6ad63]/80 bg-[#071b16] text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
        role="dialog"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_100%,rgba(220,177,103,0.24),transparent_42%),radial-gradient(ellipse_at_10%_0%,rgba(32,104,72,0.45),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#d6ad63]/20" />

        <button
          aria-label="Close Christmas and New Year greeting"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white transition hover:border-[#e7c27d] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#e7c27d]"
          onClick={closeModal}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative grid min-h-[520px] grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
          <div className="relative flex min-h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-[#173c2d] via-[#0b241c] to-[#07130f] md:min-h-full">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#e7c27d 0.7px, transparent 0.7px)", backgroundSize: "24px 24px" }} />
            <div className="absolute left-7 top-8 text-3xl text-[#e7c27d]">✳</div>
            <div className="absolute right-8 top-12 text-2xl text-[#e7c27d]">✧</div>
            <div className="relative flex flex-col items-center px-6 py-10">
              <div className="text-7xl leading-none text-[#d9b36f] drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">✦</div>
              <div className="mt-3 text-8xl leading-none text-[#d9b36f]">♟</div>
              <div className="mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#d9b36f] to-transparent" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#e8c98f]">A season of wonder</p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center text-xs tracking-[0.3em] text-[#d9b36f]/80">✧  ✦  ✧</div>
          </div>

          <div className="relative flex flex-col items-center justify-center px-7 py-14 sm:px-12 md:px-14">
            <div className="mb-7 flex items-center gap-3">
              <span className="text-4xl font-light text-[#d9b36f]">B</span>
              <span className="text-left text-sm font-medium uppercase leading-tight tracking-[0.24em] text-[#f4eee2]">B-EDGE<br /><span className="text-[9px] tracking-[0.48em] text-[#d9b36f]">ARTWORKS</span></span>
            </div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d9b36f]">Season's greetings</p>
            <h2 id="holiday-modal-title" className="font-display text-4xl leading-[1.08] text-[#f7f1e8] sm:text-5xl">
              Merry Christmas
              <span className="mt-2 block text-[#e4bd77]">&amp; Happy New Year 2027</span>
            </h2>
            <div className="my-7 flex w-full items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c69b55]" />
              <span className="text-xl text-[#d9b36f]">✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c69b55]" />
            </div>
            <p id="holiday-modal-description" className="max-w-lg text-sm leading-7 text-[#e9e3d8]/90 sm:text-base">
              Wishing you a season filled with creativity, inspiration and beautiful moments. May the New Year bring fresh perspectives and extraordinary art.
            </p>
            <a
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-gradient-to-r from-[#d4ad68] to-[#f0d49a] px-8 text-xs font-bold uppercase tracking-[0.16em] text-[#172018] shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#f0d49a] focus:ring-offset-2 focus:ring-offset-[#071b16]"
              href="/gallery"
              onClick={closeModal}
            >
              Explore the Gallery <span aria-hidden="true" className="ml-3 text-base">→</span>
            </a>
            <p className="mt-8 font-display text-sm italic text-[#e5c58d]">With warm wishes from B-EDGE Artworks</p>
          </div>
        </div>
      </section>
    </div>
  );
}
