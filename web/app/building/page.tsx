"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  "Reading your socials",
  "Researching your niche",
  "Analyzing your audience",
  "Defining your voice",
  "Writing your first posts",
];

export default function BuildingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(0);

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? sessionStorage.getItem("advisor_intake") : null;
    if (!raw) {
      router.replace("/advisor");
      return;
    }
    started.current = Date.now();
    let cancelled = false;

    // Advance the visible steps on a gentle cadence while the work runs.
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep((s) => Math.max(s, i + 1)), (i + 1) * 1100),
    );

    fetch("/api/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw,
    })
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          if (!cancelled) setError(d.error || "Something went wrong.");
          return;
        }
        sessionStorage.removeItem("advisor_intake");
        // Keep the screen up for a minimum so it never flashes.
        const wait = Math.max(0, 2600 - (Date.now() - started.current));
        setTimeout(() => {
          if (!cancelled) router.push("/");
        }, wait);
      })
      .catch(() => {
        if (!cancelled) setError("Could not reach the analyzer.");
      });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-serif text-2xl text-ink">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted">{error}</p>
        <Link
          href="/advisor"
          className="rounded-full border border-line px-5 py-2 text-sm text-ink hover:bg-surface"
        >
          Back to the Advisor
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-7 text-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          building your brand
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          Setting things up <span className="sparkle text-xl">✦</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted">This takes a few seconds.</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2.5">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={s}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all ${
                done ? "card-glass" : active ? "bg-surface" : "opacity-40"
              }`}
            >
              <span className={done ? "text-olive" : "text-primary"}>
                {done ? "✓" : active ? "◍" : "○"}
              </span>
              <span className="text-sm text-ink">{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
