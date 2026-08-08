import DraftCard from "@/components/DraftCard";
import { drafts } from "@/lib/mock";

export default function ReviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          review
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          {drafts.length} drafts waiting
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Edit lightly and approve. Nothing publishes without you.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {drafts.map((d) => (
          <DraftCard key={d.id} draft={d} />
        ))}
      </div>
    </div>
  );
}
