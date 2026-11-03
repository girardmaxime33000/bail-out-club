"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { SkipForward } from "lucide-react";
import type { Bill } from "@/lib/types";
import { useStore } from "@/lib/store";
import MarketCard from "./MarketCard";

export default function SwipeFeed({ bills, onPick }: { bills: Bill[]; onPick: (b: Bill, f: number) => void }) {
  const { pledgeAmount } = useStore();
  const [skipped, setSkipped] = useState<string[]>([]);
  const queue = bills.filter((b) => !skipped.includes(b.id));
  const current = queue[0];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const hint = useTransform(x, [-120, 0, 120], [1, 0, 1]);
  const skip = (id: string) => { x.set(0); setSkipped((s) => [...s, id]); };

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-center text-xs text-white/40">{queue.length} in queue · drag aside to pass</p>
      <div className="relative">
        <motion.span style={{ opacity: hint }} className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-hot px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Pass</motion.span>
        {current ? (
          <AnimatePresence mode="popLayout">
            <motion.div key={current.id} style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7}
              onDragEnd={(_, i) => { if (Math.abs(i.offset.x) > 120) skip(current.id); }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -240 }}
              className="cursor-grab active:cursor-grabbing">
              <MarketCard bill={current} onPick={onPick} pledgeAmount={pledgeAmount} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="card p-10 text-center">
            <p className="font-display text-2xl font-black">The pool is dry.</p>
            <p className="mt-2 text-sm text-white/50">Everyone is breathing.</p>
            {skipped.length > 0 && <button className="btn-ghost mt-6" onClick={() => setSkipped([])}>Revisit passed bills</button>}
          </div>
        )}
      </div>
      {current && (
        <button onClick={() => skip(current.id)} className="mx-auto mt-5 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white">
          <SkipForward size={13} /> Pass
        </button>
      )}
    </div>
  );
}
