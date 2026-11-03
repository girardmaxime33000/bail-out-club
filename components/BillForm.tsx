"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gavel, Loader2, Wrench, Zap } from "lucide-react";
import { CATEGORIES, type Bill, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { computeGrit, gritLabel } from "@/lib/grit";
import { RARITY, rarityOf } from "@/lib/rarity";
import MarketCard from "./MarketCard";
import CountUp from "./CountUp";

const sentenceCount = (s: string) => s.split(/[.!?]+/).filter((x) => x.trim()).length;
const CAT_ICON = { Utility: Zap, Fine: Gavel, Repair: Wrench };
const QUICK = [50, 100, 250, 500, 1000];
const IDEAS = [
  "Towed from my own street. They billed me for the tow truck's commute.",
  "Landlord invoiced me for the sadness of an empty wall. I rent it.",
  "Boiler died in January. The repairman called it 'seasonal'.",
];
const ETA: Record<string, string> = { common: "~2 days", rare: "~18 hours", epic: "~6 hours", legendary: "under 1 hour" };

export default function BillForm() {
  const { submitBill, bills, pledgeAmount } = useStore();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Fine");
  const [story, setStory] = useState("");
  const [result, setResult] = useState<Bill | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const amt = Number(amount);
  const validAmount = amt > 0 && amt <= 100000;
  const validStory = story.trim().length >= 10 && sentenceCount(story) <= 2;
  const liveGrit = validAmount && story.trim().length > 3 ? computeGrit(amt, category, story) : 0;

  const preview = useMemo<Bill>(() => ({
    id: "preview", amount: validAmount ? amt : 0, category, story: story || "Your two sentences of grievance appear here.",
    grit: liveGrit, status: "active", createdAt: new Date().toISOString(), funded: 0, pledges: [],
  }), [amt, validAmount, category, story, liveGrit]);

  async function submit() {
    setBusy(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 1600)); // simulated analysis
      setResult(await submitBill({ amount: amt, category, story: story.trim() }));
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The vault rejected your plea.");
    } finally { setBusy(false); }
  }

  const reset = () => { setStep(0); setAmount(""); setStory(""); setResult(null); };
  const poolSize = bills.filter((b) => b.status === "active").length;
  const STEPS = ["Amount", "Story", "Review", "Graded"];

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="eyebrow">Submit an Injustice</p>
        <ol className="mt-4 flex gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-white/10"}`} />
              <p className={`mt-1.5 text-[10px] font-semibold uppercase tracking-widest ${i === step ? "text-gold" : "text-white/30"}`}>{s}</p>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="mt-8">
            {step === 0 && (
              <>
                <h1 className="font-display text-4xl font-black tracking-tight">What does it cost you?</h1>
                <div className="mt-6 flex items-center rounded-2xl border border-edge bg-vault focus-within:border-gold">
                  <span className="num pl-5 text-3xl font-black text-gold">€</span>
                  <input autoFocus inputMode="decimal" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                    className="num w-full bg-transparent px-3 py-5 text-4xl font-black outline-none placeholder:text-white/20" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => setAmount(String(q))} className={`chip ${amt === q ? "border-gold bg-gold text-ink" : "border-edge bg-white/[0.03] text-white/60 hover:border-white/30"}`}>€{q}</button>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => {
                    const Icon = CAT_ICON[c];
                    return (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-xs font-bold uppercase tracking-widest transition ${category === c ? "border-gold bg-gold/10 text-gold" : "border-edge text-white/50 hover:border-white/30"}`}>
                        <Icon size={18} /> {c}
                      </button>
                    );
                  })}
                </div>
                <button className="btn-gold mt-8 w-full" disabled={!validAmount} onClick={() => setStep(1)}>Continue <ArrowRight size={14} /></button>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-display text-4xl font-black tracking-tight">State the offense.</h1>
                <p className="mt-2 text-sm text-white/50">Two sentences max. The more outrageous, the higher the grit.</p>
                <textarea autoFocus rows={4} maxLength={240} value={story} onChange={(e) => setStory(e.target.value)}
                  placeholder="The meter maid appeared like a bad omen…" className="field mt-5 resize-none text-base" />
                <div className="mt-2 flex justify-between text-xs text-white/40">
                  <span className={sentenceCount(story) > 2 ? "text-hot" : ""}>{sentenceCount(story)}/2 sentences</span><span>{story.length}/240</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {IDEAS.map((t) => <button key={t} onClick={() => setStory(t)} className="chip max-w-full border-edge bg-white/[0.03] text-left normal-case tracking-normal text-white/50 hover:border-gold/50 hover:text-gold"><span className="truncate">{t}</span></button>)}
                </div>
                <div className="mt-8 flex gap-3">
                  <button className="btn-ghost" onClick={() => setStep(0)}>Back</button>
                  <button className="btn-gold flex-1" disabled={!validStory} onClick={() => setStep(2)}>Review <ArrowRight size={14} /></button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-display text-4xl font-black tracking-tight">Ready to be graded?</h1>
                <p className="mt-2 text-sm text-white/50">Our proprietary suffering engine will weigh your grievance.</p>
                {error && <p className="mt-4 text-sm text-hot">{error}</p>}
                <div className="mt-8 flex gap-3">
                  <button className="btn-ghost" disabled={busy} onClick={() => setStep(1)}>Back</button>
                  <button className="btn-gold btn-shine flex-1" disabled={busy} onClick={submit}>
                    {busy ? <><Loader2 size={14} className="animate-spin" /> Measuring your suffering…</> : "Submit to the pool"}
                  </button>
                </div>
              </>
            )}

            {step === 3 && result && (() => {
              const rar = rarityOf(result.grit), r = RARITY[rar];
              return (
                <>
                  <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 12 }}
                    className={`chip ${r.chip} text-sm`}>{r.label} bill unlocked</motion.p>
                  <h1 className="mt-4 font-display text-4xl font-black tracking-tight">Your injustice is live.</h1>
                  <p className="num mt-2 text-6xl font-black text-gold"><CountUp value={result.grit} decimals={1} duration={1100} /><span className="text-2xl text-white/30">/10</span></p>
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/50">{gritLabel(result.grit)}</p>
                  <div className="card mt-6 grid grid-cols-2 divide-x divide-edge text-center">
                    <div className="p-4"><p className="num text-2xl font-black">#{poolSize}</p><p className="text-[10px] uppercase tracking-widest text-white/40">Queue position</p></div>
                    <div className="p-4"><p className="num text-2xl font-black">{ETA[rar]}</p><p className="text-[10px] uppercase tracking-widest text-white/40">Est. time to patron</p></div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <Link href="/vault" className="btn-gold flex-1">See it in the Vault</Link>
                    <button className="btn-ghost" onClick={reset}>Another</button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Live preview{step < 3 && " · updates as you type"}</p>
        <motion.div key={step === 3 ? "final" : "draft"} initial={step === 3 ? { rotateY: 90, opacity: 0 } : false} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <MarketCard bill={result ?? preview} readOnly pledgeAmount={pledgeAmount} />
        </motion.div>
      </div>
    </div>
  );
}
