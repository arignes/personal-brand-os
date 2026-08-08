"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/advisor", label: "Advisor" },
  { href: "/", label: "Today" },
  { href: "/calendar", label: "Calendar" },
  { href: "/contacts", label: "Contacts" },
  { href: "/playbook", label: "Playbook" },
  { href: "/brand", label: "Brand" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-line/60 bg-paper/65 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl text-ink">
          arina<span className="text-primary">.</span>
          <span className="ml-2 text-xs tracking-[0.2em] text-faint uppercase">
            brand os
          </span>
        </Link>
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "btn-glow font-medium"
                    : "text-muted hover:bg-surface"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
