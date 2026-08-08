import BrandEditor from "@/components/BrandEditor";
import EmptyBrand from "@/components/EmptyBrand";
import { getActiveBrand } from "@/lib/active-brand";

export default async function BrandPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="brand" />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          brand plan
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          {brand.name ? `${brand.name}'s brand` : "Your brand"}{" "}
          <span className="sparkle text-xl">✦</span>
        </h1>
      </div>
      <BrandEditor name={brand.name} initial={brand.result} />
    </div>
  );
}
