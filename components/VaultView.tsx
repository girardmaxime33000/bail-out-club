"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Flame, LayoutGrid, Layers, Sparkles, TrendingUp } from "lucide-react";
import { CATEGORIES, type Bill, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/format";
import MarketCard from "./MarketCard";
import SwipeFeed from "./SwipeFeed";
import PledgeSlip from "./PledgeSlip";
import PatronHUD from "./PatronHUD";
import CountUp from "./CountUp";

type Sort = "hot" | "biggest" | "newest" | "closing";
const SORTS: { id: Sort; label: string; icon: typeof Flame }[] = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "biggest", label: "Biggest", icon: TrendingUp },
  { id: "newest", label: "New", icon: Sparkles },
  { id: "closing", label: "Almost funded", icon: Layers },
];

export default function VaultView() {
  const { bills, ready, pledgeAmount, totalErased } = useStore();
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<Sort>("hot");
  const [view, setView] = useState<"grid" | "swipe">("grid");
  const [slip, setSlip] = useState<{ bill: Bill; fraction: number } | null>(null);

  const active = useMemo(() => bills.filter((b) => b.status === "active"), [bills]);
  const list = useMemo(() => {
    const l = active.filter((b) => cat === "All" || b.category === cat);
    const key: Record<Sort, (b: Bill) => number> = {
      hot: (b) => b.grit, biggest: (b) => b.amount,
      newest: (b) => new Date(b.createdAt).getTime(), closing: (b) => b.funded / b.amount,
    };
    return [...l].sort((a, b) => key[sort](b) - key[sort](a));
  }, [active, cat, sort]);

  const waiting = active.reduce((s, b) => s + (b.amount - b.funded), 0);
  if (!ready) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The Vault</p>
          <h1 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">Choose who breathes today.</h1>
        </div>
        <div className="flex gap-6 text-right">
          <div><p className="num text-2xl font-black text-gold">{eur(waiting)}</p><p className="text-[10px] uppercase tracking-widest text-white/40">Awaiting patrons</p></div>
          <div className="hidden sm:block"><p className="text-2xl font-black text-live"><CountUp prefix="€" value={totalErased} /></p><p className="text-[10px] uppercase tracking-widest text-white/40">Erased all-time</p></div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["All", ...CATEGORIES] as const).map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`chip shrink-0 ${cat === c ? "border-gold bg-gold text-ink" : "border-edge bg-white/[0.03] text-white/60 hover:border-white/30"}`}>{c}</button>
              ))}
            </div>
            <div className="flex rounded-full border border-edge p-0.5">
              {([["grid", LayoutGrid], ["swipe", Layers]] as const).map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)} aria-label={v}
                  className={`rounded-full p-2 ${view === v ? "bg-white/10 text-gold" : "text-white/40"}`}><Icon size={14} /></button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-4 overflow-x-auto border-b border-edge text-sm">
            {SORTS.map((s) => (
              <button key={s.id} onClick={() => setSort(s.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 font-semibold ${sort === s.id ? "border-gold text-gold" : "border-transparent text-white/40 hover:text-white"}`}>
                <s.icon size={13} /> {s.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {view === "swipe" ? (
              <SwipeFeed bills={list} onPick={(bill, fraction) => setSlip({ bill, fraction })} />
            ) : list.length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {list.map((b) => <MarketCard key={b.id} bill={b} pledgeAmount={pledgeAmount} onPick={(bill, fraction) => setSlip({ bill, fraction })} />)}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="font-display text-2xl font-black">The pool is dry.</p>
                <p className="mt-2 text-sm text-white/50">Everyone is breathing. Check back.</p>
              </div>
            )}
          </div>
        </section>
        <div className="lg:sticky lg:top-28 lg:self-start"><PatronHUD /></div>
      </div>

      <AnimatePresence>
        {slip && <PledgeSlip key={slip.bill.id + slip.fraction} bill={slip.bill} fraction={slip.fraction} onClose={() => setSlip(null)} />}
      </AnimatePresence>
    </div>
  );
}
