"use client";

import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "b-edge-holiday-modal-v2-dismissed-2027";

const snowflakes = [
  { left: "12%", delay: "-2s", duration: "9s", size: "3px" },
  { left: "27%", delay: "-6s", duration: "12s", size: "4px" },
  { left: "43%", delay: "-1s", duration: "10s", size: "2px" },
  { left: "61%", delay: "-8s", duration: "13s", size: "4px" },
  { left: "76%", delay: "-4s", duration: "11s", size: "3px" },
  { left: "89%", delay: "-3s", duration: "14s", size: "2px" },
];

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

  const closeModal = useCallback(() => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // The dialog remains dismissible when storage is unavailable.
    }
    setIsOpen(false);
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
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="holiday-backdrop fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="holiday-modal-title"
        aria-describedby="holiday-modal-description"
        aria-modal="true"
        className="holiday-card relative my-auto grid w-full max-w-5xl overflow-hidden rounded-[1.35rem] border border-[#c9a66b]/55 shadow-[0_35px_120px_rgba(0,0,0,0.62)] md:grid-cols-[0.92fr_1.08fr]"
        role="dialog"
      >
        <button
          aria-label="Close Christmas and New Year greeting"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/90 backdrop-blur transition hover:border-[#e7c98f] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#e7c98f]"
          onClick={closeModal}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="holiday-art relative flex min-h-[270px] items-center justify-center overflow-hidden px-7 py-12 sm:min-h-[340px] md:min-h-[610px]">
          <div className="holiday-glow absolute inset-0" />
          <div className="holiday-grid absolute inset-0 opacity-30" />
          <div className="absolute left-8 top-9 font-display text-3xl text-[#e8cb91]">✳</div>
          <div className="absolute right-14 top-16 font-display text-xl text-[#e8cb91]">✧</div>
          <div className="absolute bottom-24 left-12 font-display text-lg text-[#e8cb91]/80">✦</div>
          {snowflakes.map((flake) => (
            <span
              aria-hidden="true"
              key={flake.left}
              className="holiday-snow absolute top-[-12px] rounded-full bg-[#fff7df]"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
              }}
            />
          ))}

          <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.42em] text-[#e9d4a8]/80">B-EDGE ARTWORKS PRESENTS</p>
            <div className="relative flex h-[245px] w-[220px] items-end justify-center sm:h-[300px] sm:w-[260px]">
              <div className="absolute bottom-0 h-5 w-36 rounded-[50%] bg-black/35 blur-md" />
              <svg viewBox="0 0 260 310" className="relative z-10 h-full w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.38)]" fill="none" aria-label="Decorative Christmas tree" role="img">
                <path d="M130 42L80 112H105L58 177H99L42 244H218L161 177H202L155 112H180L130 42Z" fill="#174b38" stroke="#d4b579" strokeOpacity=".72" strokeWidth="1.5" />
                <path d="M130 67L91 119H112L73 174H111L61 232H199L149 174H187L148 119H169L130 67Z" fill="#1c5a42" />
                <path d="M130 244V284" stroke="#c79f61" strokeWidth="13" strokeLinecap="round" />
                <path d="M130 22L136 36L151 37L139 47L143 62L130 54L117 62L121 47L109 37L124 36L130 22Z" fill="#f1d99e" stroke="#fff0c9" strokeWidth="1.2" />
                <path d="M87 142C107 129 147 130 174 145M68 197C104 178 157 181 193 199" stroke="#d8b879" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M101 113L159 113M83 173L177 173M67 222L193 222" stroke="#d8b879" strokeOpacity=".5" strokeWidth="1.5" />
                <g fill="#e6c37e" stroke="#fff0c9" strokeWidth="1">
                  <circle cx="111" cy="130" r="6" /><circle cx="151" cy="157" r="7" />
                  <circle cx="92" cy="190" r="6" /><circle cx="168" cy="211" r="6" />
                  <circle cx="130" cy="91" r="5" /><circle cx="130" cy="184" r="5" />
                </g>
                <g fill="#f7ead0">
                  <circle cx="111" cy="128" r="1.5" /><circle cx="151" cy="155" r="1.8" />
                  <circle cx="92" cy="188" r="1.5" /><circle cx="168" cy="209" r="1.5" />
                </g>
              </svg>
              <span className="absolute bottom-[-8px] left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d9bb80] to-transparent" />
            </div>
            <p className="mt-7 font-display text-sm italic tracking-wide text-[#ead7b1]">A season of wonder, art &amp; new beginnings</p>
            <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.4em] text-[#d9bb80]">
              <span>✧</span><span>2026</span><span className="h-px w-8 bg-[#d9bb80]/60" /><span>2027</span><span>✧</span>
            </div>
          </div>
        </div>

        <div className="holiday-copy relative flex flex-col items-center justify-center px-7 py-14 text-center sm:px-12 md:px-14">
          <div className="pointer-events-none absolute inset-3 rounded-[1rem] border border-[#c9a66b]/15" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 flex items-center gap-3">
              <span className="font-display text-5xl font-light leading-none text-[#d9bb80]">B</span>
              <span className="text-left text-[12px] font-medium uppercase leading-[1.35] tracking-[0.25em] text-[#f4eee2]">
                B-EDGE<br /><span className="text-[9px] tracking-[0.46em] text-[#d9bb80]">ARTWORKS</span>
              </span>
            </div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d9bb80]">Season’s greetings</p>
            <h2 id="holiday-modal-title" className="font-display text-[2.55rem] font-medium leading-[1.08] tracking-[-0.035em] text-[#f8f2e8] sm:text-5xl">
              Merry Christmas
              <span className="mt-3 block text-[#e2c28a]">&amp; Happy New Year</span>
              <span className="mt-2 block text-[2rem] font-light tracking-[0.08em] text-[#e2c28a] sm:text-4xl">2027</span>
            </h2>
            <div className="my-7 flex w-full max-w-xs items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a66b]" />
              <span className="text-lg text-[#d9bb80]">✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a66b]" />
            </div>
            <p id="holiday-modal-description" className="max-w-md text-sm leading-7 text-[#eee7dc]/80 sm:text-[15px]">
              May your Christmas be filled with warmth, beauty and meaningful moments. Here’s to a New Year of fresh inspiration, bold creativity and extraordinary possibilities.
            </p>
            <a
              className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 border border-[#e1c38b] bg-gradient-to-r from-[#c5a16a] to-[#e9d2a2] px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17271f] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#f0d9a9] focus:ring-offset-2 focus:ring-offset-[#0b2119]"
              href="/gallery"
              onClick={closeModal}
            >
              Explore the Gallery <span aria-hidden="true" className="text-base">↗</span>
            </a>
            <p className="mt-9 font-display text-sm italic text-[#dfc18a]">With warm wishes from B-EDGE Artworks</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .holiday-backdrop {
          background: radial-gradient(ellipse at center, rgba(16, 34, 27, .72), rgba(0, 0, 0, .88));
          animation: holiday-fade-in .35s ease both;
        }
        .holiday-card {
          background: #0a2119;
          animation: holiday-rise-in .55s cubic-bezier(.2,.8,.2,1) both;
        }
        .holiday-art {
          background: linear-gradient(145deg, #173d2e 0%, #0c2b20 48%, #071710 100%);
        }
        .holiday-glow {
          background:
            radial-gradient(ellipse at 50% 48%, rgba(194, 157, 94, .18), transparent 42%),
            radial-gradient(ellipse at 15% 5%, rgba(49, 117, 79, .38), transparent 44%);
        }
        .holiday-grid {
          background-image: radial-gradient(rgba(229, 205, 159, .65) .65px, transparent .65px);
          background-size: 25px 25px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }
        .holiday-copy {
          background:
            radial-gradient(ellipse at 100% 0%, rgba(180, 137, 73, .13), transparent 38%),
            linear-gradient(145deg, #102b21, #071a13);
        }
        .holiday-snow {
          opacity: .72;
          animation: holiday-fall linear infinite;
        }
        @keyframes holiday-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes holiday-rise-in { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes holiday-fall { from { transform: translateY(-10px); opacity: 0; } 12% { opacity: .8; } to { transform: translateY(370px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .holiday-backdrop, .holiday-card, .holiday-snow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
