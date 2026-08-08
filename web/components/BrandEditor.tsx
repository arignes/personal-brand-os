"use client";

import { useState } from "react";
import type { AdvisorResult } from "@/lib/advisor";
import DownloadPdf from "@/components/DownloadPdf";

const inputCls =
  "w-full rounded-lg border border-primary/40 bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary";

export default function BrandEditor({
  name,
  initial,
}: {
  name: string;
  initial: AdvisorResult;
}) {
  const [r, setR] = useState<AdvisorResult>(initial);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [regen, setRegen] = useState<number | null>(null);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/brand", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ result: r }),
      });
      if (res.ok) {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setR(initial);
    setEditing(false);
  };

  const regenPost = async (i: number) => {
    setRegen(i);
    try {
      const res = await fetch("/api/regenerate-post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: r.samplePosts[i].hook,
          tone: r.toneSummary,
          channel: r.samplePosts[i].channel,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const posts = [...r.samplePosts];
        posts[i] = data;
        setR({ ...r, samplePosts: posts });
      }
    } finally {
      setRegen(null);
    }
  };

  const setPost = (i: number, key: "hook" | "body", val: string) => {
    const posts = [...r.samplePosts];
    posts[i] = { ...posts[i], [key]: val };
    setR({ ...r, samplePosts: posts });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="btn-glow rounded-full px-5 py-2 text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={cancel}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="btn-glow rounded-full px-5 py-2 text-sm font-medium"
            >
              Edit brand
            </button>
            <DownloadPdf name={name} result={r} />
          </>
        )}
        {saved && <span className="text-sm text-olive">Saved ✓</span>}
      </div>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Positioning</h2>
        {editing ? (
          <textarea
            className={`${inputCls} mt-2`}
            rows={3}
            value={r.positioning}
            onChange={(e) => setR({ ...r, positioning: e.target.value })}
          />
        ) : (
          <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
            {r.positioning}
          </p>
        )}
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-faint">tone</p>
        {editing ? (
          <textarea
            className={`${inputCls} mt-1`}
            rows={2}
            value={r.toneSummary}
            onChange={(e) => setR({ ...r, toneSummary: e.target.value })}
          />
        ) : (
          <p className="text-sm text-muted">{r.toneSummary}</p>
        )}
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Your audience</h2>
        {editing ? (
          <textarea
            className={`${inputCls} mt-2`}
            rows={3}
            value={r.audience.summary}
            onChange={(e) =>
              setR({ ...r, audience: { ...r.audience, summary: e.target.value } })
            }
          />
        ) : (
          <p className="mt-2 text-sm text-muted">{r.audience.summary}</p>
        )}
        <div className="mt-2.5 flex flex-col gap-1.5">
          {r.audience.segments.map((s, i) =>
            editing ? (
              <input
                key={i}
                className={inputCls}
                value={s}
                onChange={(e) => {
                  const segs = [...r.audience.segments];
                  segs[i] = e.target.value;
                  setR({ ...r, audience: { ...r.audience, segments: segs } });
                }}
              />
            ) : (
              <span key={i} className="rounded-full bg-surface px-3 py-1.5 text-xs text-ink">
                {s}
              </span>
            ),
          )}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Content pillars</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {r.pillars.map((p, i) => (
            <div key={i} className="rounded-xl bg-surface px-3.5 py-2.5">
              {editing ? (
                <>
                  <input
                    className={inputCls}
                    value={p.name}
                    onChange={(e) => {
                      const pl = [...r.pillars];
                      pl[i] = { ...pl[i], name: e.target.value };
                      setR({ ...r, pillars: pl });
                    }}
                  />
                  <input
                    className={`${inputCls} mt-1.5`}
                    value={p.why}
                    onChange={(e) => {
                      const pl = [...r.pillars];
                      pl[i] = { ...pl[i], why: e.target.value };
                      setR({ ...r, pillars: pl });
                    }}
                  />
                </>
              ) : (
                <>
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.why}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">What to focus on</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {r.recommendations.map((rec, i) =>
            editing ? (
              <input
                key={i}
                className={inputCls}
                value={rec}
                onChange={(e) => {
                  const recs = [...r.recommendations];
                  recs[i] = e.target.value;
                  setR({ ...r, recommendations: recs });
                }}
              />
            ) : (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="text-primary">→</span>
                {rec}
              </li>
            ),
          )}
        </ul>
      </section>

      <section>
        <h2 className="mb-2.5 font-serif text-xl text-ink">Sample posts</h2>
        <div className="flex flex-col gap-3">
          {r.samplePosts.map((post, i) => (
            <article key={i} className="card-glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-medium text-ink">
                  {post.channel}
                </span>
                <button
                  onClick={() => regenPost(i)}
                  disabled={regen === i}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                >
                  {regen === i ? "regenerating…" : "regenerate ↻"}
                </button>
              </div>
              {editing ? (
                <>
                  <input
                    className={`${inputCls} mt-2.5 font-serif font-medium`}
                    value={post.hook}
                    onChange={(e) => setPost(i, "hook", e.target.value)}
                  />
                  <textarea
                    className={`${inputCls} mt-1.5 font-serif`}
                    rows={4}
                    value={post.body}
                    onChange={(e) => setPost(i, "body", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <p className="mt-2.5 font-serif text-[15px] font-medium text-ink">
                    {post.hook}
                  </p>
                  <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
                    {post.body}
                  </p>
                </>
              )}
              {post.why && (
                <div className="mt-2.5 rounded-lg border border-accent/60 bg-accent-soft/50 px-3.5 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-navy">
                    why this works
                  </p>
                  <p className="mt-0.5 text-sm text-ink">{post.why}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
