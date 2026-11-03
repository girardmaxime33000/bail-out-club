"use client";

import { Crown, Timer } from "lucide-react";
import { useStore } from "@/lib/store";
import { PATRON_HANDLE } from "@/lib/mock";
import { levelFromXp, tierOf } from "@/lib/game";
import { eur } from "@/lib/format";
import CountUp from "./CountUp";

const PODIUM = [
  { idx: 1, h: "h-28", ring: "border-zinc-300/50 text-zinc-300" },
  { idx: 0, h: "h-40", ring: "border-gold text-gold" },
  { idx: 2, h: "h-20", ring: "border-orange-300/50 text-orange-300" },
];

export default function Leaderboard() {
  const { lords, profile } = useStore();
  const top = lords.slice(0, 3), rest = lords.slice(3);
  const me = lords.findIndex((l) => l.handle === PATRON_HANDLE);
  const ahead = me > 0 ? lords[me - 1] : null;
  const gap = ahead ? ahead.total - lords[me].total : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Shadow Lords Hall</p>
          <h1 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">Spleen Impact Score</h1>
          <p className="mt-2 text-sm text-white/50">Euros erased from ordinary lives. Identities sealed.</p>
        </div>
        <span className="chip border-hot/40 bg-hot/10 text-hot"><Timer size={12} /> Season 01 · ends in 12d</span>
      </div>

      <div className="mt-10 grid grid-cols-3 items-end gap-3">
        {PODIUM.map((p, i) => {
          const l = top[p.idx]; if (!l) return <div key={i} />;
          return (
            <div key={l.handle} className="text-center">
              {p.idx === 0 && <Crown size={26} className="mx-auto mb-1 animate-floaty text-gold" />}
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 bg-vault font-display text-xl font-black ${p.ring}`}>{p.idx + 1}</div>
              <p className="mt-2 truncate font-mono text-xs">{l.handle}</p>
              <p className="num text-lg font-black text-gold"><CountUp prefix="€" value={l.total} /></p>
              <div className={`mt-2 rounded-t-xl border border-b-0 bg-gradient-to-b from-white/[0.08] to-transparent ${p.h} ${p.ring.split(" ")[0]}`} />
            </div>
          );
        })}
      </div>

      <ol className="card divide-y divide-edge overflow-hidden">
        {rest.map((l, i) => {
          const t = tierOf(l.total), you = l.handle === PATRON_HANDLE;
          return (
            <li key={l.handle} className={`flex items-center gap-4 px-4 py-4 ${you ? "bg-gold/10" : ""}`}>
              <span className="num w-7 text-lg font-black text-white/30">{i + 4}</span>
              <span className="flex-1 truncate font-mono text-sm">{l.handle}{you && <span className="ml-2 text-[10px] font-bold uppercase text-gold">You</span>}</span>
              <span className={`chip hidden sm:inline-flex ${t.cls}`}>{t.label}</span>
              <span className="num hidden text-xs text-white/40 sm:block">{l.wipes} pledges</span>
              <span className="num w-24 text-right text-lg font-black text-gold">{eur(l.total)}</span>
            </li>
          );
        })}
      </ol>

      <div className="card mt-6 flex flex-wrap items-center justify-between gap-3 border-gold/30 p-5">
        <div>
          <p className="eyebrow">Your standing</p>
          {me >= 0 ? (
            <p className="mt-1 text-sm text-white/70">
              Rank <span className="num font-black text-white">#{me + 1}</span> · LVL {levelFromXp(profile.xp)}
              {ahead && <> · <span className="num font-bold text-gold">{eur(gap + 1)}</span> to overtake <span className="font-mono">{ahead.handle}</span></>}
            </p>
          ) : (
            <p className="mt-1 text-sm text-white/70">Unranked. One pledge puts you on the board as <span className="font-mono">{PATRON_HANDLE}</span>.</p>
          )}
        </div>
        <a href="/vault" className="btn-gold btn-shine">Climb the ranks</a>
      </div>
    </div>
  );
}
