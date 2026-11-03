"use client";

import { Award, CheckCircle2, Flame, Lock, Swords, Target, Trophy, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { BADGES, MISSIONS, levelProgress, titleOf } from "@/lib/game";
import { eur } from "@/lib/format";

export function LevelRing({ level, pct, size = 56 }: { level: number; pct: number; size?: number }) {
  const r = size / 2 - 4, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5b83d" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <span className="num absolute inset-0 flex items-center justify-center text-lg font-black text-gold">{level}</span>
    </div>
  );
}

const BADGE_ICON = [Zap, CheckCircle2, Trophy, Swords, Flame, Award];

export default function PatronHUD() {
  const { profile } = useStore();
  const lp = levelProgress(profile.xp);
  return (
    <aside className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center gap-4">
          <LevelRing level={lp.level} pct={lp.pct} size={64} />
          <div className="min-w-0">
            <p className="eyebrow">Your rank</p>
            <p className="truncate font-display text-lg font-bold">{titleOf(lp.level)}</p>
            <p className="num text-xs text-white/40">{profile.xp} XP · {lp.next - profile.xp} to LVL {lp.level + 1}</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft transition-all duration-700" style={{ width: `${lp.pct}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-white/[0.04] p-3">
            <Flame size={16} className={`mx-auto ${profile.streak ? "text-hot" : "text-white/20"}`} />
            <p className="num mt-1 text-xl font-bold">{profile.streak}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Day streak</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3">
            <Zap size={16} className="mx-auto text-gold" />
            <p className="num mt-1 text-xl font-bold">{eur(profile.totalPledged)}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Erased</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5"><Target size={12} /> Daily missions</p>
          <span className="text-[10px] text-white/40">Resets 00:00 UTC</span>
        </div>
        <ul className="space-y-3">
          {MISSIONS.map((m) => {
            const v = Math.min(m.target, m.value(profile)), done = profile.daily.done.includes(m.id);
            return (
              <li key={m.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className={done ? "text-live line-through decoration-live/40" : "text-white/80"}>{m.label}</span>
                  <span className="num text-xs font-bold text-gold">+{m.reward} XP</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full transition-all duration-500 ${done ? "bg-live" : "bg-gold"}`} style={{ width: `${(v / m.target) * 100}%` }} />
                  </div>
                  <span className="num w-14 text-right text-[11px] text-white/40">{Math.round(v)}/{m.target}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card p-5">
        <p className="eyebrow mb-3">Badges · {profile.badges.length}/{BADGES.length}</p>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b, i) => {
            const got = profile.badges.includes(b.id), Icon = BADGE_ICON[i] ?? Award;
            return (
              <div key={b.id} title={b.desc}
                className={`rounded-xl border p-3 text-center ${got ? "border-gold/40 bg-gold/10" : "border-edge bg-white/[0.02]"}`}>
                {got ? <Icon size={18} className="mx-auto text-gold" /> : <Lock size={16} className="mx-auto text-white/20" />}
                <p className={`mt-1.5 text-[10px] font-semibold leading-tight ${got ? "text-white" : "text-white/30"}`}>{b.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
