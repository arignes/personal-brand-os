"use client";

import { useState } from "react";
import type { Contact } from "@/lib/mock";

const statusFlow: Record<string, string> = {
  DRAFTED: "drafted",
  APPROVED: "approved",
  SENT: "sent",
  REPLIED: "replied",
};

export default function ContactCard({ contact }: { contact: Contact }) {
  const [status, setStatus] = useState(contact.status);
  const [copied, setCopied] = useState(false);

  const copyOpener = async () => {
    try {
      await navigator.clipboard.writeText(contact.opener);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="card-glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            contact.channel === "linkedin"
              ? "bg-accent-soft text-navy"
              : "bg-blush text-ink"
          }`}
        >
          {contact.channel === "linkedin" ? "LinkedIn" : "X"}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            status === "REPLIED"
              ? "bg-surface text-olive"
              : status === "SENT"
                ? "bg-surface text-navy"
                : "bg-surface text-primary"
          }`}
        >
          {statusFlow[status]}
        </span>
      </div>
      <p className="mt-2.5 font-serif text-lg text-ink">{contact.name}</p>
      <p className="text-sm text-muted">
        {contact.handle} · {contact.title}
      </p>
      <p className="mt-2 text-xs text-faint">Why: {contact.why}</p>

      {contact.opener && status !== "REPLIED" && (
        <blockquote className="mt-3 rounded-xl bg-linear-to-br from-surface to-blush/50 px-3.5 py-2.5 font-serif text-[15px] italic leading-snug text-ink">
          {contact.opener}
        </blockquote>
      )}

      <div className="mt-3.5 flex items-center gap-2">
        {status === "DRAFTED" && (
          <>
            <button
              onClick={() => setStatus("APPROVED")}
              className="btn-glow flex-1 rounded-full py-2 text-sm font-medium"
            >
              Approve opener
            </button>
            <button className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface">
              Edit
            </button>
          </>
        )}
        {status === "APPROVED" && (
          <>
            <button
              onClick={copyOpener}
              className="btn-glow flex-1 rounded-full py-2 text-sm font-medium"
            >
              {copied ? "Copied ✓" : "Copy & open profile"}
            </button>
            <button
              onClick={() => setStatus("SENT")}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
            >
              Mark sent
            </button>
          </>
        )}
        {status === "SENT" && (
          <button
            onClick={() => setStatus("REPLIED")}
            className="flex-1 rounded-full border border-line py-2 text-sm text-ink hover:bg-surface"
          >
            Mark replied
          </button>
        )}
        {status === "REPLIED" && (
          <p className="text-sm text-olive">In conversation; nurture from here.</p>
        )}
      </div>
    </article>
  );
}
