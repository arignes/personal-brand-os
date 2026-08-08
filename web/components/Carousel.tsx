"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

interface Slide {
  kind: "cover" | "point" | "cta";
  headline: string;
  body: string;
}

export default function Carousel({
  architecture,
  slides,
}: {
  architecture: string;
  slides: Slide[];
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [busy, setBusy] = useState(false);

  const download = async (i: number) => {
    const node = refs.current[i];
    if (!node) return;
    setBusy(true);
    try {
      const url = await toPng(node, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `slide-${i + 1}.png`;
      a.click();
    } catch {
      // ignore — download is best-effort
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-faint">
        carousel · {architecture} · {slides.length} slides
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {slides.map((s, i) => {
          const isCover = s.kind === "cover";
          const isCta = s.kind === "cta";
          const label = isCover ? "start here" : isCta ? "your turn" : `${i}`;
          return (
            <div key={i} className="flex shrink-0 flex-col gap-1.5">
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex h-[22rem] w-[17.5rem] flex-col rounded-2xl border border-line bg-[#FFFDFA] p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-6 rounded-full bg-primary" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-faint">
                    {label}
                  </span>
                </div>

                <p
                  className={`mt-4 font-serif font-medium leading-[1.1] text-ink ${
                    isCover ? "text-[28px]" : "text-[24px]"
                  }`}
                >
                  {s.headline}
                </p>

                <p className="mt-3 flex-1 text-[15px] leading-snug text-muted">
                  {s.body}
                </p>

                <div className="flex items-center justify-between border-t border-line pt-3">
                  <span className="font-serif text-sm text-primary">
                    {i + 1} / {slides.length}
                  </span>
                  {(isCover || isCta) && (
                    <span className="font-serif text-sm italic text-primary">
                      {isCover ? "swipe →" : "follow for more"}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => download(i)}
                disabled={busy}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                download ↓
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
