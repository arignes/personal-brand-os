"use client";

import { useState } from "react";

interface Person {
  name: string;
  source: string;
  url: string;
  snippet: string;
}

export default function SegmentFinder({
  segment,
  niche,
  platforms,
}: {
  segment: string;
  niche: string;
  platforms: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<Person[] | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const find = async () => {
    setLoading(true);
    setNote(null);
    // Query = the niche plus the first words of this segment, for relevance.
    const query = `${niche} ${segment.split(/\s+/).slice(0, 8).join(" ")}`.trim();
    try {
      const res = await fetch("/api/find-people", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, platforms }),
      });
      const data = await res.json();
      if (res.ok) {
        setPeople(data.people);
        if (!data.people?.length) setNote("No clear matches this time. Try again.");
      } else {
        setNote(data.message || data.error || "Could not search right now.");
      }
    } catch {
      setNote("Could not reach the search service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="card-glass rounded-2xl p-4">
      <p className="font-serif text-lg text-ink">{segment}</p>
      <p className="mt-1 text-sm text-muted">
        Find 5 people in this group each week. Reply to something they posted with a
        specific, useful thought before you ever pitch.
      </p>

      {people && people.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {people.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl bg-surface px-3 py-2 transition-colors hover:bg-blush/60"
            >
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  p.source === "linkedin" ? "bg-accent-soft text-navy" : "bg-blush text-ink"
                }`}
              >
                {p.source === "linkedin" ? "in" : p.source}
              </span>
              <span className="flex-1 truncate text-sm font-medium text-ink">
                {p.name}
              </span>
              <span className="text-faint">↗</span>
            </a>
          ))}
        </div>
      )}
      {note && <p className="mt-2 text-xs text-navy">{note}</p>}

      <div className="mt-3">
        <button
          onClick={find}
          disabled={loading}
          className="btn-glow rounded-full px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Searching…" : people ? "Find more" : "Find real people"}
        </button>
      </div>
    </article>
  );
}
