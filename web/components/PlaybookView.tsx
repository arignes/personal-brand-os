"use client";

import { useState } from "react";

interface GuideSection {
  title: string;
  intro: string;
  steps: string[];
}

export default function PlaybookView() {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<GuideSection[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/playbook", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections);
        setDemo(!!data.demo);
      } else {
        setError(data.error || "Could not build your playbook.");
      }
    } catch {
      setError("Could not reach the playbook service.");
    } finally {
      setLoading(false);
    }
  };

  if (!sections) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted">
          A complete, personalized guide for running your brand: how to post, what
          to create, how to earn press, and a first-30-days routine. Built on proven
          marketing methodology, written for your brand.
        </p>
        <button
          onClick={generate}
          disabled={loading}
          className="btn-glow rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Writing your playbook…" : "Generate my playbook"}
        </button>
        {error && <p className="text-sm text-primary">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {demo && (
        <p className="rounded-xl bg-accent-soft/70 px-3.5 py-2 text-xs text-navy">
          Demo mode — add a funded LLM key for the full personalized playbook.
        </p>
      )}
      {sections.map((s, i) => (
        <section key={i} className="card-glass rounded-2xl p-4">
          <h2 className="font-serif text-xl text-ink">
            <span className="text-primary">{i + 1}.</span> {s.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted">{s.intro}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {s.steps.map((step, j) => (
              <li key={j} className="flex gap-2 text-sm text-ink">
                <span className="text-primary">→</span>
                {step}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button
        onClick={generate}
        disabled={loading}
        className="rounded-full border border-line py-2.5 text-sm text-ink hover:bg-surface disabled:opacity-60"
      >
        {loading ? "Rewriting…" : "Regenerate"}
      </button>
    </div>
  );
}
