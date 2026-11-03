"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useStore } from "@/lib/store";

export default function LevelUp() {
  const { celebrate, closeCelebrate } = useStore();
  return (
    <AnimatePresence>
      {celebrate && (
        <motion.div key="lv" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCelebrate}>
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2, d = 160 + ((i * 53) % 220);
            return <motion.span key={i} className="absolute h-2 w-2 rounded-full bg-gold"
              initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }} />;
          })}
          <motion.div initial={{ scale: 0.4, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }} className="text-center">
            <Crown size={56} className="mx-auto text-gold" />
            <p className="eyebrow mt-4">Level up</p>
            <p className="num mt-1 bg-gradient-to-b from-gold-soft to-gold bg-clip-text text-8xl font-black text-transparent">{celebrate.level}</p>
            <p className="font-serif text-3xl italic text-white">{celebrate.title}</p>
            <p className="mt-6 text-xs uppercase tracking-widest text-white/40">Tap to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
