"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Crown } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabaseConfigured } from "@/lib/supabase";

const LINKS = [
  { href: "/submit", label: "Submit" },
  { href: "/vault", label: "Vault" },
  { href: "/hall", label: "Hall" },
];

export default function Nav() {
  const path = usePathname();
  const { mode, useSupabase, setUseSupabase } = useStore();
  return (
    <header className="border-b border-edge">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl tracking-wide">
          <Crown size={16} className="text-gold" /> Bailout Club
        </Link>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-widest">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={path === l.href ? "text-gold" : "text-white/60 hover:text-white"}>
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setUseSupabase(!useSupabase)}
            disabled={!supabaseConfigured}
            title={supabaseConfigured ? "Toggle data source" : "Set NEXT_PUBLIC_SUPABASE_* to enable"}
            className="flex items-center gap-1.5 border border-edge px-2.5 py-1 text-[10px] text-white/60 enabled:hover:border-gold disabled:opacity-50"
          >
            <Database size={11} /> {mode === "supabase" ? "Supabase" : "Demo"}
          </button>
        </nav>
      </div>
    </header>
  );
}
