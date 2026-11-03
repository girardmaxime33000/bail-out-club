"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Crown, Target, Zap } from "lucide-react";
import { useStore, type Toast } from "@/lib/store";

const ICON = { xp: Zap, level: Crown, badge: Award, mission: Target };
const TONE = { xp: "text-gold border-gold/40", level: "text-gold border-gold/40", badge: "text-arcane border-arcane/40", mission: "text-live border-live/40" };

function Item({ t }: { t: Toast }) {
  const { dismissToast } = useStore();
  useEffect(() => { const id = setTimeout(() => dismissToast(t.id), 3800); return () => clearTimeout(id); }, [t.id, dismissToast]);
  const Icon = ICON[t.kind];
  return (
    <motion.div layout initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60 }} className={`flex items-center gap-3 rounded-xl border bg-black/90 px-4 py-3 shadow-2xl backdrop-blur ${TONE[t.kind]}`}>
      <Icon size={18} />
      <div>
        <p className="num text-sm font-bold">{t.title}</p>
        {t.sub && <p className="text-xs text-white/50">{t.sub}</p>}
      </div>
    </motion.div>
  );
}

export default function Toaster() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-72 flex-col gap-2">
      <AnimatePresence>{toasts.map((t) => <Item key={t.id} t={t} />)}</AnimatePresence>
    </div>
  );
}
