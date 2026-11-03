"use client";

import { Flame, Gavel, Receipt, Wrench, Zap } from "lucide-react";
import type { Bill, Category } from "@/lib/types";
import GritMeter from "./GritMeter";
import GoldBurst from "./GoldBurst";

const ICONS: Record<Category, typeof Zap> = { Utility: Zap, Fine: Gavel, Repair: Wrench };

export default function BillCard({
  bill, onWipe, burst,
}: { bill: Bill; onWipe?: () => void; burst?: boolean }) {
  const Icon = ICONS[bill.category] ?? Receipt;
  const done = bill.status === "extinguished";
  return (
    <article className="relative flex min-h-[26rem] flex-col justify-between overflow-hidden border border-edge bg-vault p-7 shadow-[0_30px_80px_-30px_rgba(212,166,74,0.25)]">
      {burst && <GoldBurst />}
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 eyebrow"><Icon size={13} /> {bill.category}</span>
          {bill.grit >= 9 && <Flame size={14} className="text-gold" />}
        </div>
        <p className="mt-6 font-serif text-6xl leading-none">€{bill.amount.toLocaleString()}</p>
        <p className="mt-6 text-base leading-relaxed text-white/75">“{bill.story}”</p>
      </div>
      <div className="mt-8 space-y-5">
        <GritMeter value={bill.grit} size="sm" />
        {done ? (
          <p className="border border-gold/40 bg-gold/5 px-4 py-3 text-center text-xs uppercase tracking-widest text-gold">
            Extinguished by an Anonymous Whale
          </p>
        ) : (
          <button className="btn-gold w-full py-4" onClick={onWipe}>Slay Debt</button>
        )}
      </div>
    </article>
  );
}
