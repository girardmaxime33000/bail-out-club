"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const SEED = [
  "@Lord_Null_99 erased €640 · Repair",
  "@Quiet_Yacht erased €95 · Fine",
  "@MonopolyMan_Off backed €1,480 · Repair",
  "@OffshoreOwl erased €212 · Utility",
  "@Void_Dividend leveled up → Shadow Lord",
  "@Tax_Haven_Ted erased €135 · Fine",
  "@Margin_Call_Mo pledged €180 · Utility",
];
const H = ["@Lord_Null_99", "@OffshoreOwl", "@Quiet_Yacht", "@MonopolyMan_Off", "@Void_Dividend"];
const C = ["Fine", "Utility", "Repair"];

export default function Ticker() {
  const { activity } = useStore();
  const [fake, setFake] = useState<string[]>([]);
  useEffect(() => {
    const id = setInterval(() => {
      const a = [25, 60, 95, 135, 180, 240, 320, 410][Math.floor(Math.random() * 8)];
      setFake((f) => [`${H[Math.floor(Math.random() * H.length)]} erased €${a} · ${C[Math.floor(Math.random() * 3)]}`, ...f].slice(0, 6));
    }, 7000);
    return () => clearInterval(id);
  }, []);
  const items = [...activity.map((a) => a.text), ...fake, ...SEED];
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap text-xs text-white/60">
          <span className="h-1 w-1 rounded-full bg-live" /> {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className="flex items-center border-b border-edge bg-black/60">
      <span className="z-10 flex shrink-0 items-center gap-1.5 bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-hot">
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hot opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-hot" /></span>
        Live
      </span>
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee">{row("a")}{row("b")}</div>
      </div>
    </div>
  );
}
