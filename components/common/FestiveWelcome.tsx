"use client";

import { useEffect, useState } from "react";

export function FestiveWelcome() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 25_000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="festive-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Christmas and New Year greeting"
    >
      <section className="festive-card">
        <button
          type="button"
          className="festive-close"
          aria-label="Close greeting"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
        <div className="festive-spark festive-spark-one" aria-hidden="true">✦</div>
        <div className="festive-spark festive-spark-two" aria-hidden="true">✧</div>
        <p className="festive-kicker">Season’s greetings from B-Edge Artworks</p>
        <h2 className="festive-title">Merry Christmas</h2>
        <p className="festive-ampersand">&amp;</p>
        <h3 className="festive-subtitle">Happy New Year</h3>
        <p className="festive-message">May the season bring colour, beauty and inspiration.</p>
        <div className="festive-rule" aria-hidden="true" />
      </section>
    </div>
  );
}
