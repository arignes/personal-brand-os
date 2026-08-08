"use client";

import { useState } from "react";
import type { Draft } from "@/lib/mock";

const formatLabels: Record<string, string> = {
  text: "text post",
  carousel: "carousel",
  photo: "photo",
  thread: "thread",
};

export default function BriefingDraft({ draft }: { draft: Draft }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "skipped">(
    "pending",
  );

  if (status === "skipped") return null;

  return (
    <article className="card-glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-[17px] leading-snug text-ink">
          {draft.topic}
        </p>
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[11px] text-muted">
          {formatLabels[draft.format]}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted">
        <span className="font-medium text-faint">why now · </span>
        {draft.rationale}
      </p>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2.5 text-xs font-medium text-primary hover:underline"
      >
        {open ? "Hide draft" : "Show draft"}
      </button>

      {open && (
        <div className="mt-2 rounded-xl bg-linear-to-br from-surface to-blush/50 px-3.5 py-3">
          <p className="font-serif text-[15px] font-medium leading-snug text-ink">
            {draft.hooks[0]}
          </p>
          <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
            {draft.body}
          </p>
          <p className="mt-2.5 border-t border-line/70 pt-2 text-[11px] text-faint">
            <span className="font-medium">hook · </span>
            {draft.engagementHook}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {status === "approved" ? (
          <span className="flex-1 rounded-full bg-surface py-2 text-center text-sm font-medium text-olive">
            Approved · scheduled
          </span>
        ) : (
          <button
            onClick={() => setStatus("approved")}
            className="btn-glow flex-1 rounded-full py-2 text-sm font-medium"
          >
            Approve & schedule
          </button>
        )}
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
