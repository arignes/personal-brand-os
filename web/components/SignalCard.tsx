"use client";

import { useState } from "react";
import type { Signal } from "@/lib/mock";

const laneStyles: Record<string, string> = {
  mine: "bg-blush text-ink",
  adjacent: "bg-accent-soft text-navy",
};

const actionLabels: Record<string, string> = {
  REPLY: "reply",
  CONTENT: "content idea",
  CONTACT: "contact",
};

export default function SignalCard({ signal }: { signal: Signal }) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [angle, setAngle] = useState(signal.angle);
  const [drafting, setDrafting] = useState(false);
  const [draftedAngle, setDraftedAngle] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState<string | null>(null);

  if (dismissed) return null;

  const isReal = !signal.angle && !!signal.url;

  const draftAngle = async () => {
    setDrafting(true);
    setDraftNote(null);
    try {
      const res = await fetch("/api/draft-angle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          author: signal.author,
          source: signal.source,
          text: signal.text,
          action: signal.action,
        }),
      });
      const data = await res.json();
      if (res.ok) setDraftedAngle(data.angle);
      else setDraftNote(data.message || data.error || "Could not draft an angle.");
    } catch {
      setDraftNote("Could not reach the drafting service.");
    } finally {
      setDrafting(false);
    }
  };

  const copyAngle = async () => {
    try {
      await navigator.clipboard.writeText(angle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (isReal) {
    return (
      <article className="card-glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${laneStyles[signal.lane]}`}
          >
            {signal.lane === "mine" ? "my lane" : "adjacent"} ·{" "}
            {actionLabels[signal.action]}
          </span>
          <span className="font-serif text-xl text-primary">
            {signal.score.toFixed(1)}
          </span>
        </div>
        <p className="mt-2.5 text-sm font-medium text-ink">
          {signal.author ? `${signal.author} · ` : ""}
          {signal.source}
          {signal.age ? ` · ${signal.age}` : ""}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {signal.text.length > 240 ? signal.text.slice(0, 240) + "…" : signal.text}
        </p>
        {signal.whyRelevant && (
          <p className="mt-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted">
            <span className="font-medium text-faint">why it surfaced · </span>
            {signal.whyRelevant}
          </p>
        )}
        {draftedAngle && (
          <blockquote className="mt-2 rounded-xl bg-linear-to-br from-surface to-blush/50 px-3.5 py-2.5 font-serif text-[15px] italic leading-snug text-ink">
            {draftedAngle}
          </blockquote>
        )}
        {draftNote && <p className="mt-2 text-xs text-navy">{draftNote}</p>}
        <div className="mt-3.5 flex items-center gap-2">
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow flex-1 rounded-full py-2 text-center text-sm font-medium"
          >
            Open post ↗
          </a>
          <button
            onClick={draftAngle}
            disabled={drafting}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface disabled:opacity-60"
          >
            {drafting ? "Drafting…" : draftedAngle ? "Redraft" : "Draft angle"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-2 py-2 text-sm text-faint hover:text-muted"
          >
            Skip
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="card-glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${laneStyles[signal.lane]}`}
        >
          {signal.lane === "mine" ? "my lane" : "adjacent"} ·{" "}
          {actionLabels[signal.action]}
        </span>
        <span className="font-serif text-xl text-primary">
          {signal.score.toFixed(1)}
        </span>
      </div>
      <p className="mt-2.5 text-sm font-medium text-ink">
        {signal.author} · {signal.source} · {signal.age}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        &ldquo;{signal.text}&rdquo;
      </p>
      {editing ? (
        <textarea
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-xl border border-primary/40 bg-card px-3.5 py-2.5 font-serif text-[15px] italic leading-snug text-ink focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ) : (
        <blockquote className="mt-3 rounded-xl bg-linear-to-br from-surface to-blush/50 px-3.5 py-2.5 font-serif text-[15px] italic leading-snug text-ink">
          {angle}
        </blockquote>
      )}
      {signal.caveat && (
        <p className="mt-2 text-xs text-navy">⚠ {signal.caveat}</p>
      )}
      <div className="mt-3.5 flex items-center gap-2">
        <button
          onClick={copyAngle}
          className="btn-glow flex-1 rounded-full py-2 text-sm font-medium"
        >
          {copied ? "Copied ✓" : "Use angle"}
        </button>
        <button
          onClick={() => setEditing((e) => !e)}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
        >
          {editing ? "Done" : "Edit"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-2 py-2 text-sm text-faint hover:text-muted"
        >
          Skip
        </button>
      </div>
    </article>
  );
}
