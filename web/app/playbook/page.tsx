import EmptyBrand from "@/components/EmptyBrand";
import PlaybookView from "@/components/PlaybookView";
import { getActiveBrand } from "@/lib/active-brand";

export default async function PlaybookPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="playbook" />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          playbook
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          {brand.name ? `${brand.name}'s playbook` : "Your playbook"}{" "}
          <span className="sparkle text-xl">✦</span>
        </h1>
      </div>
      <PlaybookView />
    </div>
  );
}
