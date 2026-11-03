"use client";

import { Crown } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Leaderboard() {
  const { lords } = useStore();
  const max = lords[0]?.total || 1;
  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Shadow Lords Hall</p>
      <h1 className="mt-2 font-serif text-4xl">Spleen Impact Score</h1>
      <p className="mt-2 text-sm text-white/50">Total euros erased from ordinary lives. Identities remain sealed.</p>
      <ol className="mt-10 divide-y divide-edge border-y border-edge">
        {lords.map((l, i) => (
          <li key={l.handle} className="relative flex items-center gap-4 px-2 py-5">
            <div className="absolute inset-y-0 left-0 bg-gold/5" style={{ width: `${(l.total / max) * 100}%` }} />
            <span className="relative w-8 font-serif text-2xl text-white/40">
              {i === 0 ? <Crown size={20} className="text-gold" /> : i + 1}
            </span>
            <span className="relative flex-1 font-mono text-sm">{l.handle}</span>
            <span className="relative text-xs text-white/40">{l.wipes} wiped</span>
            <span className="relative w-28 text-right font-serif text-2xl text-gold">€{l.total.toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
