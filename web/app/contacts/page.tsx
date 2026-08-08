import EmptyBrand from "@/components/EmptyBrand";
import SegmentFinder from "@/components/SegmentFinder";
import { getActiveBrand } from "@/lib/active-brand";

export default async function ContactsPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="contacts" />;
  const segments = brand.result.audience.segments;
  const niche =
    [brand.intake.focus, brand.intake.q.pillars, brand.intake.q.identity]
      .filter(Boolean)
      .join(" ")
      .slice(0, 120) || "personal brand";

  // Only search the platforms this person actually provided.
  const s = brand.intake.socials;
  const platforms = [
    s.linkedin ? "linkedin" : null,
    s.instagram ? "instagram" : null,
    s.x ? "x" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          contacts
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          Who to reach <span className="sparkle text-xl">✦</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Your audience segments. Hit &ldquo;Find real people&rdquo; to pull actual
          profiles (LinkedIn first) you can start a conversation with.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {segments.map((seg, i) => (
          <SegmentFinder key={i} segment={seg} niche={niche} platforms={platforms} />
        ))}
      </div>
    </div>
  );
}
