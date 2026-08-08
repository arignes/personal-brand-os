"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type Intake } from "@/lib/advisor";

const empty: Intake = {
  name: "",
  email: "",
  socials: { linkedin: "", instagram: "", x: "", other: "" },
  focus: "",
  q: {
    identity: "", audience: "", goals: "", pillars: "", services: "",
    tone: "", avoid: "", differentiator: "", success90: "", admire: "",
  },
};

export default function AdvisorPage() {
  const router = useRouter();
  const [form, setForm] = useState<Intake>(empty);
  const [returnEmail, setReturnEmail] = useState("");

  const signIn = async () => {
    if (!returnEmail.trim()) return;
    await fetch("/api/signin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: returnEmail }),
    });
    router.push("/");
  };

  const startFresh = async () => {
    await fetch("/api/signin", { method: "DELETE" });
    setForm(empty);
    setReturnEmail("");
  };

  // Stash the intake and hand off to the building screen, which runs the
  // analysis while its animation plays (so there's no long disabled button).
  const submit = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("advisor_intake", JSON.stringify(form));
    }
    router.push("/building");
  };

  const input =
    "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          brand advisor
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          Let&apos;s read your brand <span className="sparkle text-xl">✦</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Add your socials, your goals, and answer ten quick questions. We&apos;ll
          build your dashboard: a briefing, a plan, and your first posts.
        </p>
      </div>

      <div className="card-glass rounded-2xl p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-faint">
          already have a brand?
        </p>
        <div className="mt-2 flex gap-2">
          <input
            className={input}
            type="email"
            placeholder="Enter your email to load it"
            value={returnEmail}
            onChange={(e) => setReturnEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn()}
          />
          <button
            onClick={signIn}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-ink hover:bg-surface"
          >
            Load
          </button>
        </div>
        <button
          onClick={startFresh}
          className="mt-2 text-xs text-faint hover:text-muted"
        >
          New person? Start fresh
        </button>
      </div>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">You & your socials</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <input
            className={input}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={input}
            type="email"
            placeholder="Your email (saves your brand so you can come back)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {(["linkedin", "instagram", "x", "other"] as const).map((k) => (
              <input
                key={k}
                className={input}
                placeholder={
                  k === "x" ? "X / Twitter URL or @handle" : `${k[0].toUpperCase()}${k.slice(1)} URL`
                }
                value={form.socials[k]}
                onChange={(e) => setForm({ ...form, socials: { ...form.socials, [k]: e.target.value } })}
              />
            ))}
          </div>
          <textarea
            className={input}
            rows={3}
            placeholder="What do you want to post about? What's your focus and goals?"
            value={form.focus}
            onChange={(e) => setForm({ ...form, focus: e.target.value })}
          />
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Ten questions</h2>
        <p className="mt-0.5 text-xs text-faint">
          Skip any that don&apos;t apply. The more you answer, the sharper the read.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {QUESTIONS.map((qq, idx) => (
            <div key={qq.key}>
              <label className="text-sm font-medium text-ink">
                {idx + 1}. {qq.label}
              </label>
              <input
                className={`${input} mt-1`}
                placeholder={qq.placeholder}
                value={form.q[qq.key]}
                onChange={(e) => setForm({ ...form, q: { ...form.q, [qq.key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={submit}
        className="btn-glow rounded-full py-3 text-sm font-medium"
      >
        Build my brand
      </button>
    </div>
  );
}
