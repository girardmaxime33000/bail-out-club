"use client";

import { Flame, Gavel, Wrench, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { Bill, Category } from "@/lib/types";
import { RARITY, rarityOf } from "@/lib/rarity";
import { eur, timeAgo } from "@/lib/format";
import { xpFor } from "@/lib/game";
import GritMeter from "./GritMeter";

const ICONS: Record<Category, typeof Zap> = { Utility: Zap, Fine: Gavel, Repair: Wrench };
const OPTIONS = [{ f: 0.25, label: "25%" }, { f: 0.5, label: "50%" }, { f: 1, label: "WIPE" }];

export default function MarketCard({
  bill, onPick, readOnly = false, pledgeAmount,
}: {
  bill: Bill; onPick?: (bill: Bill, fraction: number) => void; readOnly?: boolean;
  pledgeAmount?: (bill: Bill, fraction: number) => number;
}) {
  const r = RARITY[rarityOf(bill.grit)];
  const Icon = ICONS[bill.category];
  const pct = Math.min(100, (bill.funded / bill.amount) * 100);
  const done = bill.status === "extinguished";
  const amtFor = (f: number) => pledgeAmount ? pledgeAmount(bill, f) : Math.round(bill.amount * f);

  return (
    <motion.article layout whileHover={readOnly ? undefined : { y: -4 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-panel to-vault p-5 ${r.border} ${r.glow}`}>
      {rarityOf(bill.grit) === "legendary" && (
        <div className="pointer-events-none absolute inset-0 animate-shine bg-[linear-gradient(110deg,transparent_40%,rgba(245,184,61,0.10)_50%,transparent_60%)] bg-[length:200%_100%]" />
      )}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="chip border-white/10 bg-white/5 text-white/70"><Icon size={11} /> {bill.category}</span>
          <span className={`chip ${r.chip}`}>{rarityOf(bill.grit) === "legendary" && <Flame size={11} />}{r.label}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-white/40">
          {!done && <span className="h-1.5 w-1.5 animate-glow rounded-full bg-live" />}
          <span suppressHydrationWarning>{timeAgo(bill.createdAt)}</span>
        </span>
      </div>

      <p className="relative mt-4 flex-1 text-[15px] leading-snug text-white/85">“{bill.story}”</p>

      <div className="relative mt-5 flex items-end justify-between">
        <p className="num text-4xl font-black leading-none tracking-tight">{eur(bill.amount)}</p>
        <p className="num text-right text-xs text-white/40">
          <span className="font-bold text-white/80">{eur(bill.funded)}</span> funded
        </p>
      </div>

      <div className="relative mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className={`h-full rounded-full ${r.bar}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
        </div>
        <div className="num mt-1 flex justify-between text-[11px] text-white/40">
          <span>{Math.round(pct)}%</span><span>{eur(bill.amount - bill.funded)} left</span>
        </div>
      </div>

      <div className="relative mt-4"><GritMeter value={bill.grit} /></div>

      <div className="relative mt-5">
        {done ? (
          <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-gold">
            Extinguished by an Anonymous Whale
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map((o) => {
              const amt = amtFor(o.f), wipe = o.f === 1;
              return (
                <button key={o.label} disabled={readOnly} onClick={() => onPick?.(bill, o.f)}
                  className={`group relative overflow-hidden rounded-xl px-2 py-2.5 text-center transition active:scale-95 disabled:opacity-60 ${
                    wipe ? "btn-shine bg-gradient-to-b from-gold-soft to-gold text-ink" : "border border-edge bg-white/[0.04] hover:border-gold/60 hover:bg-gold/10"}`}>
                  <span className={`block text-[10px] font-bold uppercase tracking-widest ${wipe ? "text-ink/70" : "text-white/40 group-hover:text-gold"}`}>{o.label}</span>
                  <span className="num block text-base font-black">{eur(amt)}</span>
                  <span className={`num block text-[10px] font-semibold ${wipe ? "text-ink/70" : "text-gold"}`}>+{xpFor(bill, amt, o.f === 1)} XP</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}
