"use client";

import { useState } from "react";

export default function CalendarPost({
  time,
  post,
}: {
  time: string;
  post: { channel: string; hook: string; body: string; why?: string };
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${post.hook}\n\n${post.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-blush/50"
      >
        <span className="font-serif text-sm text-primary">{time}</span>
        <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] font-medium text-ink">
          {post.channel}
        </span>
        <span className="flex-1 truncate text-sm text-ink">{post.hook}</span>
        <span className="text-faint">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="px-3 pb-3">
          <div className="rounded-lg bg-card px-3.5 py-3">
            <p className="font-serif text-[15px] font-medium text-ink">{post.hook}</p>
            <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
              {post.body}
            </p>
          </div>
          {post.why && (
            <div className="mt-2 rounded-lg border border-accent/60 bg-accent-soft/50 px-3.5 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy">
                why this works
              </p>
              <p className="mt-0.5 text-sm text-ink">{post.why}</p>
            </div>
          )}
          <button
            onClick={copy}
            className="mt-2 rounded-full border border-line px-4 py-1.5 text-sm text-ink hover:bg-card"
          >
            {copied ? "Copied ✓" : "Copy post"}
          </button>
        </div>
      )}
    </div>
  );
}
