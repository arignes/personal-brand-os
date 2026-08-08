import DownloadPdf from "@/components/DownloadPdf";
import EmptyBrand from "@/components/EmptyBrand";
import { getActiveBrand } from "@/lib/active-brand";

export default async function BrandPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="brand" />;
  const r = brand.result;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          brand plan
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          {brand.name ? `${brand.name}'s brand` : "Your brand"}{" "}
          <span className="sparkle text-xl">✦</span>
        </h1>
        <div className="mt-3">
          <DownloadPdf name={brand.name} result={brand.result} />
        </div>
      </div>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Positioning</h2>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          {r.positioning}
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-faint">tone</p>
        <p className="text-sm text-muted">{r.toneSummary}</p>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Your audience</h2>
        <p className="mt-2 text-sm text-muted">{r.audience.summary}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {r.audience.segments.map((s) => (
            <span key={s} className="rounded-full bg-surface px-3 py-1.5 text-xs text-ink">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Content pillars</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {r.pillars.map((p) => (
            <div key={p.name} className="rounded-xl bg-surface px-3.5 py-2.5">
              <p className="font-medium text-ink">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">{p.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">What to focus on</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {r.recommendations.map((rec) => (
            <li key={rec} className="flex gap-2 text-sm text-ink">
              <span className="text-primary">→</span>
              {rec}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
