"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const N = 36;

export default function GoldBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-2xl">
      <motion.div className="absolute inset-0 bg-gold/25" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} />
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2, d = 90 + ((i * 37) % 110);
        return (
          <motion.span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-gold-soft"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }} />
        );
      })}
      <motion.div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-ink text-gold"
        initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.2, 1], opacity: 1 }} transition={{ duration: 0.5 }}>
        <Check size={38} strokeWidth={2} />
      </motion.div>
    </div>
  );
}
