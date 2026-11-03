"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { CATEGORIES, type Bill, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import GritMeter from "./GritMeter";

const sentenceCount = (s: string) => s.split(/[.!?]+/).filter((x) => x.trim()).length;

export default function BillForm() {
  const { submitBill, bills } = useStore();
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

  async function submit() {
    setBusy(true); setError("");
    try {
      // simulated "AI" analysis delay
      await new Promise((r) => setTimeout(r, 1400));
      setResult(await submitBill({ amount: amt, category, story: story.trim() }));
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The vault rejected your plea.");
    } finally { setBusy(false); }
  }

  const poolSize = bills.filter((b) => b.status === "active").length;

  return (
    <div className="mx-auto max-w-xl">
      <p className="eyebrow">Submit an Injustice</p>
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-px flex-1 ${i <= step ? "bg-gold" : "bg-edge"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-10">
          {step === 0 && (
            <>
              <h1 className="font-serif text-4xl">What does it cost you?</h1>
              <div className="mt-8 flex items-center border border-edge bg-vault focus-within:border-gold">
                <span className="pl-5 font-serif text-3xl text-gold">€</span>
                <input autoFocus inputMode="decimal" type="number" min="1" value={amount}
                  onChange={(e) => setAmount(e.target.value)} placeholder="0"
                  className="w-full bg-transparent px-3 py-5 font-serif text-4xl outline-none placeholder:text-white/20" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`border px-3 py-3 text-xs uppercase tracking-widest transition ${
                      category === c ? "border-gold bg-gold/10 text-gold" : "border-edge text-white/60 hover:border-white/40"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <button className="btn-gold mt-8 w-full" disabled={!validAmount} onClick={() => setStep(1)}>
                Continue <ArrowRight size={14} />
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-serif text-4xl">State the offense.</h1>
              <p className="mt-2 text-sm text-white/50">Two sentences maximum. Wound the reader.</p>
              <textarea autoFocus rows={4} maxLength={240} value={story} onChange={(e) => setStory(e.target.value)}
                placeholder="The meter maid appeared like a bad omen…" className="field mt-6 resize-none" />
              <div className="mt-2 flex justify-between text-xs text-white/40">
                <span className={sentenceCount(story) > 2 ? "text-red-400" : ""}>{sentenceCount(story)}/2 sentences</span>
                <span>{story.length}/240</span>
              </div>
              <div className="mt-8 flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(0)}>Back</button>
                <button className="btn-gold flex-1" disabled={!validStory} onClick={() => setStep(2)}>
                  Review <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-serif text-4xl">Confirm and surrender.</h1>
              <div className="mt-8 border border-edge bg-vault p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-5xl">€{amt.toLocaleString()}</span>
                  <span className="eyebrow">{category}</span>
                </div>
                <p className="mt-4 text-white/70">{story}</p>
              </div>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              <div className="mt-8 flex gap-3">
                <button className="btn-ghost" disabled={busy} onClick={() => setStep(1)}>Back</button>
                <button className="btn-gold flex-1" disabled={busy} onClick={submit}>
                  {busy ? <><Loader2 size={14} className="animate-spin" /> Measuring your suffering…</> : "Submit to the Pool"}
                </button>
              </div>
            </>
          )}

          {step === 3 && result && (
            <>
              <div className="flex h-12 w-12 items-center justify-center border border-gold text-gold"><Check size={20} /></div>
              <h1 className="mt-6 font-serif text-4xl">Your injustice is in the pool.</h1>
              <p className="mt-2 text-sm text-white/50">
                {poolSize} bills await a patron. Anonymity is guaranteed in both directions.
              </p>
              <div className="mt-8 border border-edge bg-vault p-6">
                <GritMeter value={result.grit} />
                <div className="mt-6 flex items-baseline justify-between border-t border-edge pt-4">
                  <span className="font-serif text-3xl">€{result.amount.toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-widest text-gold">● Active</span>
                </div>
                <p className="mt-3 text-sm text-white/60">{result.story}</p>
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/vault" className="btn-gold flex-1">See it in the Vault</Link>
                <button className="btn-ghost" onClick={() => { setStep(0); setAmount(""); setStory(""); setResult(null); }}>
                  Another
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
