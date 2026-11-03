"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { SkipForward } from "lucide-react";
import { useStore } from "@/lib/store";
import BillCard from "./BillCard";

export default function SwipeFeed() {
  const { bills, wipeBill, ready } = useStore();
  const [skipped, setSkipped] = useState<string[]>([]);
  const [burstId, setBurstId] = useState<string | null>(null);
  const [wiped, setWiped] = useState(0);

  const queue = useMemo(
    () => bills.filter((b) => b.status === "active" && !skipped.includes(b.id) && b.id !== burstId)
      .sort((a, b) => b.grit - a.grit),
    [bills, skipped, burstId],
  );
  const current = queue[0];
  const burstBill = bills.find((b) => b.id === burstId);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);

  async function wipe(id: string) {
    setBurstId(id);
    await new Promise((r) => setTimeout(r, 1300));
    await wipeBill(id);
    setBurstId(null);
    setWiped((n) => n + 1);
  }

  const skip = (id: string) => { x.set(0); setSkipped((s) => [...s, id]); };

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-md">
      <p className="eyebrow">The Vault</p>
      <h1 className="mt-2 font-serif text-4xl">Choose who breathes today.</h1>
      <p className="mt-2 text-sm text-white/50">Swipe aside to pass. Press to erase. {queue.length} awaiting.</p>

      <div className="relative mt-8">
        {burstBill ? (
          <BillCard bill={burstBill} burst />
        ) : current ? (
          <AnimatePresence mode="popLayout">
            <motion.div key={current.id} style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, i) => { if (Math.abs(i.offset.x) > 120) skip(current.id); }}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -200 }} className="cursor-grab active:cursor-grabbing">
              <BillCard bill={current} onWipe={() => wipe(current.id)} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="border border-edge bg-vault p-10 text-center">
            <p className="font-serif text-3xl">The pool is dry.</p>
            <p className="mt-2 text-sm text-white/50">
              {wiped > 0 ? `You erased ${wiped} this session. ` : ""}Everyone is breathing.
            </p>
            {skipped.length > 0 && (
              <button className="btn-ghost mt-6" onClick={() => setSkipped([])}>Revisit passed bills</button>
            )}
            <Link href="/hall" className="btn-gold mt-3 w-full">Hall of Shadow Lords</Link>
          </div>
        )}
      </div>

      {current && !burstBill && (
        <button onClick={() => skip(current.id)}
          className="mx-auto mt-5 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white">
          <SkipForward size={13} /> Pass
        </button>
      )}
    </div>
  );
}
