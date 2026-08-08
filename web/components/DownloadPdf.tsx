"use client";

import { jsPDF } from "jspdf";
import type { AdvisorResult } from "@/lib/advisor";

export default function DownloadPdf({
  name,
  result,
}: {
  name: string;
  result: AdvisorResult;
}) {
  const build = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const M = 48; // margin
    const W = doc.internal.pageSize.getWidth() - M * 2;
    const H = doc.internal.pageSize.getHeight();
    let y = M;

    const space = (n: number) => {
      y += n;
      if (y > H - M) {
        doc.addPage();
        y = M;
      }
    };
    const heading = (t: string) => {
      space(18);
      doc.setFont("times", "bold");
      doc.setFontSize(15);
      doc.setTextColor(114, 8, 8);
      doc.text(t, M, y);
      y += 6;
    };
    const para = (t: string, size = 10.5, gray = false) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(gray ? 120 : 40, gray ? 100 : 40, gray ? 95 : 40);
      const lines = doc.splitTextToSize(t, W) as string[];
      for (const line of lines) {
        space(size + 4);
        doc.text(line, M, y);
      }
    };

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(161, 7, 40);
    doc.text(`${name || "Your"} — Brand Plan`, M, y);
    y += 10;

    heading("Positioning");
    para(result.positioning);
    heading("Tone of voice");
    para(result.toneSummary);

    heading("Audience");
    para(result.audience.summary);
    result.audience.segments.forEach((s) => para(`• ${s}`, 10.5, true));

    heading("Content pillars");
    result.pillars.forEach((p) => {
      para(`• ${p.name}`, 11);
      para(p.why, 10, true);
    });

    heading("What to focus on");
    result.recommendations.forEach((r) => para(`→ ${r}`));

    heading("Sample posts");
    result.samplePosts.forEach((p, i) => {
      para(`${i + 1}. [${p.channel}] ${p.hook}`, 11);
      para(p.body, 10, true);
      if (p.why) para(`Why it works: ${p.why}`, 9, true);
      space(6);
    });

    doc.save(`${(name || "brand").replace(/\s+/g, "-").toLowerCase()}-brand-plan.pdf`);
  };

  return (
    <button
      onClick={build}
      className="btn-glow rounded-full px-5 py-2 text-sm font-medium"
    >
      Download PDF ↓
    </button>
  );
}
