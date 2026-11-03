"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const N = 28;

export default function GoldBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 bg-gold/20"
        initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }} />
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2;
        const d = 90 + ((i * 37) % 90);
        return (
          <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-gold-soft"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }} />
        );
      })}
      <motion.div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold bg-ink text-gold"
        initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.15, 1], opacity: 1 }} transition={{ duration: 0.5 }}>
        <Check size={36} strokeWidth={1.5} />
      </motion.div>
    </div>
  );
}
