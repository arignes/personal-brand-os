import { marketingFunnel, platforms, stats } from "@/lib/mock";

const funnelWidths = [100, 84, 70, 52, 34, 20];

function fmt(n: number) {
  return n.toLocaleString("en-GB");
}

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          stats · {stats.week}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          The numbers <span className="sparkle text-xl">✦</span>
        </h1>
      </div>

      {platforms.map((p) => (
        <section key={p.name} className="card-glass rounded-2xl p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 font-serif text-xl text-ink">
              <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} />
              {p.name}
            </h2>
            <p className="text-sm text-muted">
              <span className="font-serif text-xl text-primary">
                {fmt(p.followers)}
              </span>{" "}
              followers <span className="text-olive">+{p.followerDelta}</span>
            </p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {p.metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-surface px-2 py-2.5">
                <p className="font-serif text-lg text-ink">
                  {fmt(m.value)}
                  {m.suffix ?? ""}
                </p>
                <p className="text-[11px] leading-tight text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-xl text-ink">Marketing funnel</h2>
        <p className="mt-0.5 text-xs text-faint">
          Built from the metrics above. Each stage shows the conversion from the
          one before it.
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {marketingFunnel.map((s, i) => {
            const prev = marketingFunnel[i - 1];
            const conv = prev
              ? (s.value / prev.value) * 100
              : null;
            const convLabel =
              conv === null
                ? null
                : conv >= 10
                  ? `${Math.round(conv)}%`
                  : `${conv.toFixed(1)}%`;
            return (
              <div key={s.stage}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">{s.stage}</span>
                  <span className="text-muted">
                    <span className="font-serif text-base text-primary">
                      {fmt(s.value)}
                    </span>
                    {convLabel && (
                      <span className="ml-2 text-xs text-faint">
                        {convLabel} of prev
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-9 w-full rounded-lg bg-surface">
                  <div
                    className="flex h-9 items-center rounded-lg bg-linear-to-r from-primary to-ink px-3"
                    style={{ width: `${funnelWidths[i]}%` }}
                  >
                    <span className="truncate text-[11px] text-paper/90">
                      {s.note}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[11px] text-faint">from {s.source}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Pillar balance</h2>
        <div className="mt-3 flex flex-col gap-3">
          {stats.pillarMix.map((p) => (
            <div key={p.pillar}>
              <div className="flex justify-between text-xs text-muted">
                <span>{p.pillar}</span>
                <span>
                  {p.actual}% <span className="text-faint">/ {p.target}% target</span>
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-primary to-ink"
                  style={{ width: `${p.actual}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="card-glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-olive">top post</p>
          <p className="mt-1 font-serif text-base text-ink">{stats.topPost.title}</p>
          <p className="mt-1 text-xs text-muted">{stats.topPost.note}</p>
        </div>
        <div className="card-glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-primary">
            underperformer
          </p>
          <p className="mt-1 font-serif text-base text-ink">
            {stats.bottomPost.title}
          </p>
          <p className="mt-1 text-xs text-muted">{stats.bottomPost.note}</p>
        </div>
      </section>

      <section className="card-glass rounded-2xl p-4">
        <h2 className="font-serif text-lg text-ink">Suggestions</h2>
        <p className="mt-0.5 text-xs text-faint">
          The system proposes, you approve. Brand files never change on their own.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {stats.suggestions.map((s) => (
            <div
              key={s}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3.5 py-2.5"
            >
              <p className="text-sm text-ink">{s}</p>
              <div className="flex shrink-0 gap-1.5">
                <button className="btn-glow rounded-full px-3 py-1 text-xs font-medium">
                  Approve
                </button>
                <button className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                  Skip
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
