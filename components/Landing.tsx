"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, Eye, Flame, Lock, Send, Sparkles, Target, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { BADGES, MISSIONS, TITLES, xpForLevel } from "@/lib/game";
import { eur } from "@/lib/format";
import CountUp from "./CountUp";
import MarketCard from "./MarketCard";

function Online() {
  const [n, setN] = useState(137);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.max(110, v + Math.floor(Math.random() * 7) - 3)), 3000);
    return () => clearInterval(id);
  }, []);
  return <span className="num">{n}</span>;
}

export default function Landing() {
  const { bills, totalErased, lords, pledgeAmount } = useStore();
  const active = bills.filter((b) => b.status === "active");
  const hot = [...active].sort((a, b) => b.grit - a.grit).slice(0, 3);
  const avg = active.length ? active.reduce((s, b) => s + b.grit, 0) / active.length : 0;

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="pt-6">
        <span className="chip border-live/40 bg-live/10 text-live"><span className="h-1.5 w-1.5 animate-glow rounded-full bg-live" /> <Online /> patrons online</span>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
          For you, it&apos;s pocket change.<br />
          <span className="font-serif font-medium italic text-gold">For them, it&apos;s breathing room.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/60">
          The anonymous exchange where the very wealthy erase the small, absurd bills that ruin ordinary weeks.
          Earn XP. Climb the Hall. Tell no one.
        </p>
        <div className="mt-10 grid gap-4 sm:max-w-3xl sm:grid-cols-2">
          <Link href="/vault" className="btn-gold btn-shine group justify-between py-5 text-base">
            <span className="flex items-center gap-2"><Lock size={18} /> Enter the Vault</span>
            <span className="rounded-full bg-ink/15 px-2 py-0.5 text-[10px]">+XP</span>
          </Link>
          <Link href="/submit" className="btn-ghost justify-between py-5 text-base">
            <span className="flex items-center gap-2"><Sparkles size={18} /> Submit an Injustice</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { l: "Erased all-time", v: <CountUp prefix="€" value={totalErased} />, c: "text-gold" },
            { l: "Bills awaiting", v: <CountUp value={active.length} />, c: "text-white" },
            { l: "Avg. Grit Index", v: <CountUp value={avg} decimals={1} />, c: "text-hot" },
            { l: "Shadow Lords", v: <CountUp value={lords.length + 1240} />, c: "text-live" },
          ].map((s) => (
            <div key={s.l} className="card p-5">
              <p className={`text-3xl font-black sm:text-4xl ${s.c}`}>{s.v}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow flex items-center gap-1.5"><Flame size={12} className="text-hot" /> Trending now</p>
            <h2 className="mt-1 font-display text-3xl font-black">Highest grit in the pool</h2>
          </div>
          <Link href="/vault" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-gold">See all →</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {hot.map((b) => <MarketCard key={b.id} bill={b} readOnly pledgeAmount={pledgeAmount} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <p className="eyebrow">The game</p>
        <h2 className="mt-1 font-display text-3xl font-black">Three moves.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { i: Send, t: "Submit", d: "Post a bill and two sentences of grievance. Get graded instantly with a Grit Index and a rarity.", x: "Commons to Legendaries" },
            { i: Eye, t: "Get spotted", d: "Patrons browse the pool. Hotter grit rises. Partial pledges fill the funding bar in public.", x: "Live funding bars" },
            { i: Zap, t: "Get erased", d: "A patron pledges 25%, 50% or the whole thing. Anonymous, final, frictionless.", x: "No thanks accepted" },
          ].map((s, i) => (
            <div key={s.t} className="card relative overflow-hidden p-6">
              <span className="num absolute right-4 top-2 text-7xl font-black text-white/[0.04]">{i + 1}</span>
              <s.i size={22} className="text-gold" />
              <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/55">{s.d}</p>
              <span className="chip mt-5 border-gold/30 bg-gold/10 text-gold">{s.x}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRESSION */}
      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-6">
          <p className="eyebrow">Rank ladder</p>
          <h2 className="mt-1 font-display text-2xl font-black">From Curious Wallet to Myth of the Vault</h2>
          <ol className="mt-6 space-y-2">
            {TITLES.slice(0, 6).map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="num flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-black text-gold">{i + 1}</span>
                <span className="flex-1 text-sm font-semibold" style={{ opacity: 1 - i * 0.1 }}>{t}</span>
                <span className="num text-xs text-white/40">{xpForLevel(i + 1)} XP</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-5">
          <div className="card p-6">
            <p className="eyebrow flex items-center gap-1.5"><Target size={12} /> Daily missions</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {MISSIONS.map((m) => (
                <li key={m.id} className="flex items-center justify-between"><span className="text-white/75">{m.label}</span><span className="num font-bold text-gold">+{m.reward} XP</span></li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <p className="eyebrow flex items-center gap-1.5"><Award size={12} /> {BADGES.length} badges to unlock</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {BADGES.map((b) => <span key={b.id} className="chip border-edge bg-white/[0.03] text-white/60">{b.label}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card relative overflow-hidden border-gold/30 p-10 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(245,184,61,0.18),transparent)]" />
        <p className="relative font-serif text-3xl italic text-white/90 sm:text-4xl">“Someone, somewhere, is paying your parking fine.”</p>
        <p className="relative mt-2 text-sm text-white/50">{eur(active.reduce((s, b) => s + b.amount - b.funded, 0))} currently waiting for a patron.</p>
        <Link href="/vault" className="btn-gold btn-shine relative mt-8">Start erasing</Link>
      </section>
    </div>
  );
}
