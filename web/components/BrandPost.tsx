"use client";

import { useState } from "react";
import Carousel from "@/components/Carousel";

interface Slide {
  kind: "cover" | "point" | "cta";
  headline: string;
  body: string;
}

export default function BrandPost({
  post,
  tone = "",
}: {
  post: { channel: string; hook: string; body: string; why?: string };
  tone?: string;
}) {
  const [status, setStatus] = useState<"pending" | "approved" | "skipped">("pending");
  const [copied, setCopied] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgNote, setImgNote] = useState<string | null>(null);
  const [carLoading, setCarLoading] = useState(false);
  const [carousel, setCarousel] = useState<{ architecture: string; slides: Slide[] } | null>(null);
  const [carNote, setCarNote] = useState<string | null>(null);

  if (status === "skipped") return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${post.hook}\n\n${post.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const genImage = async () => {
    setImgLoading(true);
    setImgNote(null);
    const prompt = `A beautiful, high-quality editorial image to accompany a ${post.channel} post about: "${post.hook}". Style: clean minimalist magazine aesthetic, soft natural lighting, warm cream and muted burgundy palette, tasteful and modern, generous negative space, refined art direction. One strong subject or scene, photographic or polished 3D render. Absolutely no text, no letters, no words, no logos, no watermark, no charts.`;
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) setImageUrl(data.image);
      else setImgNote(data.message || data.error || "Could not generate an image.");
    } catch {
      setImgNote("Could not reach the image service.");
    } finally {
      setImgLoading(false);
    }
  };

  const genCarousel = async () => {
    setCarLoading(true);
    setCarNote(null);
    try {
      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: post.hook, tone }),
      });
      const data = await res.json();
      if (res.ok) setCarousel(data);
      else setCarNote(data.message || data.error || "Could not build a carousel.");
    } catch {
      setCarNote("Could not reach the carousel service.");
    } finally {
      setCarLoading(false);
    }
  };

  return (
    <article className="card-glass rounded-2xl p-4">
      <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-medium text-ink">
        {post.channel}
      </span>
      <p className="mt-2.5 font-serif text-[15px] font-medium text-ink">{post.hook}</p>
      <p className="mt-1.5 whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
        {post.body}
      </p>
      {post.why && (
        <div className="mt-2.5 rounded-lg border border-accent/60 bg-accent-soft/50 px-3.5 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-navy">
            why this works
          </p>
          <p className="mt-0.5 text-sm text-ink">{post.why}</p>
        </div>
      )}
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
          onClick={copy}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <button
          onClick={() => setStatus("skipped")}
          className="px-2 py-2 text-sm text-faint hover:text-muted"
        >
          Skip
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={genImage}
          disabled={imgLoading}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-ink hover:bg-surface disabled:opacity-60"
        >
          {imgLoading
            ? "Generating image…"
            : imageUrl
              ? "Regenerate image"
              : "Reference image"}
        </button>
        <button
          onClick={genCarousel}
          disabled={carLoading}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-ink hover:bg-surface disabled:opacity-60"
        >
          {carLoading ? "Building carousel…" : carousel ? "Rebuild carousel" : "Make carousel"}
        </button>
      </div>
      {carNote && <p className="mt-2 text-xs text-navy">{carNote}</p>}
      {carousel && (
        <Carousel architecture={carousel.architecture} slides={carousel.slides} />
      )}
      <div className="mt-2">
        {imgNote && <p className="text-xs text-navy">{imgNote}</p>}
        {imageUrl && (
          <div className="mt-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Reference visual for this post"
              className="w-full rounded-xl border border-line"
            />
            <a
              href={imageUrl}
              download="reference.png"
              className="mt-2 inline-block text-xs text-primary hover:underline"
            >
              Download image ↓
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
