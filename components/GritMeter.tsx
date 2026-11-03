"use client";

import { motion } from "framer-motion";
import { gritLabel } from "@/lib/grit";

export default function GritMeter({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Grit Index</span>
        <span className={`font-serif text-gold ${size === "md" ? "text-4xl" : "text-xl"}`}>
          {value.toFixed(1)}<span className="text-sm text-white/40">/10</span>
        </span>
      </div>
      <div className="mt-2 h-px w-full bg-edge">
        <motion.div className="h-px bg-gold" initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
      </div>
      {size === "md" && <p className="mt-2 text-xs uppercase tracking-widest text-white/50">{gritLabel(value)}</p>}
    </div>
  );
}
