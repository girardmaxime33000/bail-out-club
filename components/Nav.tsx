"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Home, Lock, PlusCircle, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabaseConfigured } from "@/lib/supabase";
import { levelProgress } from "@/lib/game";
import { LevelRing } from "./PatronHUD";
import Ticker from "./Ticker";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/submit", label: "Submit", icon: PlusCircle },
  { href: "/vault", label: "Vault", icon: Lock },
  { href: "/hall", label: "Hall", icon: Trophy },
];

export default function Nav() {
  const path = usePathname();
  const { mode, useSupabase, setUseSupabase, profile } = useStore();
  const lp = levelProgress(profile.xp);
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink/85 backdrop-blur">
        <Ticker />
        <div className="border-b border-edge">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" aria-label="Bailout Club" className="flex items-center text-[26px] font-black leading-none tracking-[-0.04em]">
              <span className="text-white">Bailout</span>
              <span className="ml-1 rounded-[6px] bg-gradient-to-b from-gold-soft to-gold px-1.5 pb-[3px] pt-[1px] text-ink">Club</span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
              {LINKS.slice(1).map((l) => (
                <Link key={l.href} href={l.href} className={`rounded-lg px-4 py-2 ${path === l.href ? "bg-white/10 text-gold" : "text-white/60 hover:text-white"}`}>{l.label}</Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={() => setUseSupabase(!useSupabase)} disabled={!supabaseConfigured}
                title={supabaseConfigured ? "Toggle data source" : "Set NEXT_PUBLIC_SUPABASE_* to enable"}
                className="hidden items-center gap-1.5 rounded-full border border-edge px-2.5 py-1 text-[10px] font-semibold uppercase text-white/50 enabled:hover:border-gold disabled:opacity-50 sm:flex">
                <Database size={11} /> {mode === "supabase" ? "Supabase" : "Demo"}
              </button>
              <Link href="/vault" className="flex items-center gap-2 rounded-full border border-edge bg-white/[0.03] py-1 pl-1 pr-3 hover:border-gold/60">
                <LevelRing level={lp.level} pct={lp.pct} size={32} />
                <span className="num text-xs font-bold text-white/80">{profile.xp} <span className="text-gold">XP</span></span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-edge bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`flex flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wider ${path === l.href ? "text-gold" : "text-white/40"}`}>
            <l.icon size={18} /> {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
