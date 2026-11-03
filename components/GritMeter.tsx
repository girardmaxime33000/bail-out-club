"use client";

import { motion } from "framer-motion";
import { RARITY, rarityOf } from "@/lib/rarity";

export default function GritMeter({ value, label = true }: { value: number; label?: boolean }) {
  const r = RARITY[rarityOf(value)];
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-white/40">
          <span>Grit Index</span>
          <span className={`num text-sm font-bold ${r.text}`}>{value.toFixed(1)}<span className="text-white/30">/10</span></span>
        </div>
      )}
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <div key={i} className="h-2 flex-1 overflow-hidden rounded-sm bg-white/10">
              <motion.div className={`h-full ${r.seg}`} initial={{ width: 0 }} animate={{ width: `${fill * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.35 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
