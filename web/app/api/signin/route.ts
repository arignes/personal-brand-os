import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// POST { email } — sets the account cookie so a returning person loads their brand.
export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("pb_email", email.trim().toLowerCase(), {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return res;
}

// DELETE — sign out (clear the cookie) so a new person starts fresh.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("pb_email", "", { maxAge: 0, path: "/" });
  return res;
}
