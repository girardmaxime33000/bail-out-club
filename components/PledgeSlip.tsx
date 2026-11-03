"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Swords, X, Zap } from "lucide-react";
import type { Bill } from "@/lib/types";
import { PATRON_HANDLE } from "@/lib/mock";
import { RARITY, rarityOf } from "@/lib/rarity";
import { eur } from "@/lib/format";
import { levelProgress, xpFor } from "@/lib/game";
import { useStore, type PledgeResult } from "@/lib/store";
import GoldBurst from "./GoldBurst";

export default function PledgeSlip({ bill: live, fraction, onClose }: { bill: Bill; fraction: number; onClose: () => void }) {
  const [bill] = useState(live); // snapshot: store updates must not rewrite the slip
  const { pledge, pledgeAmount, profile } = useStore();
  const [state, setState] = useState<"confirm" | "busy" | "done">("confirm");
  const [res, setRes] = useState<PledgeResult | null>(null);
  const [err, setErr] = useState("");

  const amount = pledgeAmount(bill, fraction);
  const completes = amount >= bill.amount - bill.funded;
  const r = RARITY[rarityOf(bill.grit)];
  const xp = xpFor(bill, amount, completes);
  const lp = levelProgress(profile.xp);

  async function confirm() {
    setState("busy"); setErr("");
    try {
      await new Promise((x) => setTimeout(x, 500));
      const out = await pledge(bill.id, fraction);
      setRes(out); setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Transaction refused."); setState("confirm");
    }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={state === "busy" ? undefined : onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className={`relative w-full max-w-md overflow-hidden rounded-t-3xl border bg-vault p-6 sm:rounded-3xl ${r.border} ${r.glow}`}>
        <AnimatePresence>{state === "done" && <GoldBurst />}</AnimatePresence>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-white/40 hover:text-white"><X size={18} /></button>

        <p className="eyebrow">Pledge slip</p>
        <p className="mt-3 line-clamp-2 text-sm text-white/60">“{bill.story}”</p>

        <div className="mt-5 flex items-end justify-between border-y border-edge py-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">{completes ? "Wipe entire balance" : "Partial pledge"}</p>
            <p className="num text-5xl font-black">{eur(amount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Remaining after</p>
            <p className="num text-xl font-bold text-white/80">{eur(bill.amount - bill.funded - amount)}</p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-white/50">Rarity bonus</dt><dd className={`num font-bold ${r.text}`}>{r.label} ×{r.mult}</dd></div>
          <div className="flex justify-between"><dt className="text-white/50">Reward</dt><dd className="num flex items-center gap-1 font-bold text-gold"><Zap size={13} /> +{xp} XP{completes && " (incl. +25 wipe bonus)"}</dd></div>
          <div className="flex justify-between"><dt className="text-white/50">Appears as</dt><dd className="font-mono text-xs text-white/70">{PATRON_HANDLE}</dd></div>
        </dl>

        {state === "done" && res ? (
          <div className="mt-6 text-center">
            <p className="font-display text-2xl font-black text-gold">{res.completed ? "Debt extinguished." : "Pledge locked in."}</p>
            <p className="num mt-1 text-sm text-white/50">+{res.xp} XP · LVL {lp.level} · {Math.round(lp.pct)}% to next</p>
            <button className="btn-gold mt-5 w-full" onClick={onClose}>Next bill</button>
          </div>
        ) : (
          <>
            {err && <p className="mt-3 text-sm text-hot">{err}</p>}
            <button className="btn-gold btn-shine mt-6 w-full py-4" disabled={state === "busy"} onClick={confirm}>
              {state === "busy" ? <><Loader2 size={16} className="animate-spin" /> Processing</> : <><Swords size={16} /> {completes ? "Slay debt" : "Confirm pledge"}</>}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
