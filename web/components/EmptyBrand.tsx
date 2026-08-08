import Link from "next/link";

export default function EmptyBrand({ what }: { what: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {what}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          Nothing here yet <span className="sparkle text-xl">✦</span>
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Start with the Advisor. Add your socials and answer ten quick questions,
          and your whole dashboard fills in.
        </p>
      </div>
      <Link
        href="/advisor"
        className="btn-glow rounded-full px-6 py-2.5 text-sm font-medium"
      >
        Start with the Advisor →
      </Link>
    </div>
  );
}
