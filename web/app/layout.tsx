import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Personal Brand OS",
  description: "Signals, drafts and analytics for Arina's personal brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-28 -top-36 h-[26rem] w-[26rem] rounded-full bg-blush opacity-60 blur-3xl" />
          <div className="absolute -right-36 top-1/4 h-[30rem] w-[30rem] rounded-full bg-accent opacity-50 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-[22rem] w-[22rem] rounded-full bg-primary opacity-15 blur-3xl" />
          <div className="absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-accent-soft opacity-60 blur-3xl" />
        </div>
        <Nav />
        <main className="mx-auto w-full max-w-2xl px-4 pb-20 pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
