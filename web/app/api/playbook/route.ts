import { NextResponse } from "next/server";
import { getActiveBrand } from "@/lib/active-brand";
import { generatePlaybook } from "@/lib/playbook";

export const dynamic = "force-dynamic";

export async function POST() {
  const brand = await getActiveBrand();
  if (!brand) {
    return NextResponse.json({ error: "no_brand" }, { status: 404 });
  }
  try {
    const playbook = await generatePlaybook(brand);
    return NextResponse.json(playbook);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
