import Link from "next/link";
import BrandPost from "@/components/BrandPost";
import EmptyBrand from "@/components/EmptyBrand";
import NoteBox from "@/components/NoteBox";
import { getActiveBrand } from "@/lib/active-brand";

const today = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function TodayPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="today" />;

  const r = brand.result;
  const first = brand.name?.trim().split(" ")[0] || "there";

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          morning briefing · {today}
        </p>
        <h1 className="mt-1 font-serif text-3xl leading-tight text-ink">
          Good morning, {first} <span className="sparkle text-xl">✦</span>
          <span className="sparkle sparkle-slow text-sm">✦</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted">{r.positioning}</p>
        {r.demo && (
          <p className="mt-2 rounded-xl bg-accent-soft/70 px-3.5 py-2 text-xs text-navy">
            Demo mode — add a funded ANTHROPIC_API_KEY (or NOUS_PORTAL_API_KEY) for
            a fully personalized briefing.
          </p>
        )}
      </header>

      <section>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="font-serif text-xl text-ink">Ready to post</h2>
          <Link href="/brand" className="text-xs text-primary hover:underline">
            your brand plan →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {r.samplePosts.map((p, i) => (
            <BrandPost key={i} post={p} tone={r.toneSummary} />
          ))}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-xl text-ink">Your focus this week</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {r.recommendations.map((rec) => (
            <li key={rec} className="flex gap-2 text-sm text-ink">
              <span className="text-primary">→</span>
              {rec}
            </li>
          ))}
        </ul>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-xl text-ink">Your pillars</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {r.pillars.map((p) => (
            <div key={p.name} className="rounded-xl bg-surface px-3.5 py-2.5">
              <p className="font-medium text-ink">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">{p.why}</p>
            </div>
          ))}
        </div>
      </section>

      <NoteBox />
    </div>
  );
}
