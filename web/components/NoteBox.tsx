"use client";

import { useState } from "react";

export default function NoteBox() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  const save = () => {
    if (!note.trim()) return;
    setSaved([note.trim(), ...saved]);
    setNote("");
  };

  return (
    <div className="card-glass rounded-2xl p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-faint">
        quick note · feeds next week&apos;s suggestions
      </p>
      <div className="mt-2 flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="e.g. threads feel dead lately"
          className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none"
        />
        <button
          onClick={save}
          className="btn-glow rounded-full px-4 py-2 text-sm font-medium"
        >
          Save
        </button>
      </div>
      {saved.length > 0 && (
        <ul className="mt-2.5 flex flex-col gap-1">
          {saved.map((s, i) => (
            <li key={i} className="text-xs text-muted">
              ✓ {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
