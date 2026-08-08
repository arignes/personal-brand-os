"use client";

import { useState } from "react";
import type { Draft } from "@/lib/mock";

const channelStyles: Record<string, string> = {
  linkedin: "bg-accent-soft text-navy",
  x: "bg-blush text-ink",
};

export default function DraftCard({ draft }: { draft: Draft }) {
  const [hook, setHook] = useState(0);
  const [body, setBody] = useState(draft.body);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "skipped">(
    "pending",
  );

  if (status === "skipped") return null;

  return (
    <article className="card-glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${channelStyles[draft.channel]}`}
        >
          {draft.channel === "linkedin" ? "LinkedIn" : "X"} · {draft.format}
        </span>
        {draft.voiceCheck.passed ? (
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-olive">
            voice check ✓
          </span>
        ) : (
          <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] text-ink">
            voice unverified
          </span>
        )}
      </div>

      <p className="mt-2.5 text-xs uppercase tracking-wide text-faint">
        pick a hook
      </p>
      <div className="mt-1.5 flex flex-col gap-1.5">
        {draft.hooks.map((h, i) => (
          <button
            key={i}
            onClick={() => setHook(i)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
              hook === i
                ? "border-primary bg-surface text-ink"
                : "border-line text-muted hover:bg-surface"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          className="mt-3 w-full resize-none rounded-xl border border-primary/40 bg-card px-4 py-3 font-serif text-[15px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ) : (
        <div className="mt-3 whitespace-pre-line rounded-xl bg-surface px-4 py-3 font-serif text-[15px] leading-relaxed text-ink">
          <p className="font-medium">{draft.hooks[hook]}</p>
          {"\n"}
          {body}
        </div>
      )}
      <p className="mt-2 text-xs text-faint">{draft.voiceCheck.note}</p>

      <div className="mt-3.5 flex items-center gap-2">
        {status === "approved" ? (
          <span className="flex-1 rounded-full bg-surface py-2 text-center text-sm font-medium text-olive">
            Approved · scheduled
          </span>
        ) : (
          <button
            onClick={() => setStatus("approved")}
            className="btn-glow flex-1 rounded-full py-2 text-sm font-medium"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => setEditing((e) => !e)}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
        >
          {editing ? "Done" : "Edit"}
        </button>
        <button
          onClick={() => setStatus("skipped")}
          className="px-2 py-2 text-sm text-faint hover:text-muted"
        >
          Skip
        </button>
      </div>
    </article>
  );
}
