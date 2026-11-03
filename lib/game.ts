import type { Bill } from "./types";
import { RARITY, rarityOf } from "./rarity";

export const xpForLevel = (l: number) => 120 * (l - 1) ** 2;
export const levelFromXp = (xp: number) => Math.floor(Math.sqrt(xp / 120)) + 1;

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const base = xpForLevel(level), next = xpForLevel(level + 1);
  return { level, base, next, pct: Math.min(100, ((xp - base) / (next - base)) * 100), into: xp - base, span: next - base };
}

export const TITLES = [
  "Curious Wallet", "Minor Baron", "Offshore Associate", "Silent Partner",
  "Shadow Lord", "Obsidian Sovereign", "Untouchable", "Myth of the Vault",
];
export const titleOf = (level: number) => TITLES[Math.min(TITLES.length, level) - 1];

export function xpFor(bill: Bill, amount: number, completes: boolean) {
  const mult = RARITY[rarityOf(bill.grit)].mult;
  return Math.round((10 + amount / 10) * mult) + (completes ? 25 : 0);
}

export interface Profile {
  xp: number; streak: number; lastDay: string; totalPledged: number; wipes: number; legendaryWipes: number;
  badges: string[];
  daily: { date: string; pledges: number; euros: number; legendary: number; done: string[] };
}

export const today = () => new Date().toISOString().slice(0, 10);
export const freshProfile = (): Profile => ({
  xp: 0, streak: 0, lastDay: "", totalPledged: 0, wipes: 0, legendaryWipes: 0, badges: [],
  daily: { date: today(), pledges: 0, euros: 0, legendary: 0, done: [] },
});

export interface Mission { id: string; label: string; target: number; reward: number; value: (p: Profile) => number }
export const MISSIONS: Mission[] = [
  { id: "m_pledge", label: "Make 3 pledges", target: 3, reward: 60, value: (p) => p.daily.pledges },
  { id: "m_euros", label: "Erase €500 of debt", target: 500, reward: 80, value: (p) => p.daily.euros },
  { id: "m_legend", label: "Back a Legendary bill", target: 1, reward: 100, value: (p) => p.daily.legendary },
];

export interface BadgeDef { id: string; label: string; desc: string; test: (p: Profile) => boolean }
export const BADGES: BadgeDef[] = [
  { id: "first", label: "First Blood", desc: "Make your first pledge", test: (p) => p.totalPledged > 0 },
  { id: "wipe", label: "Clean Slate", desc: "Fully erase a bill", test: (p) => p.wipes >= 1 },
  { id: "k", label: "Four Figures", desc: "Pledge €1,000 total", test: (p) => p.totalPledged >= 1000 },
  { id: "legend", label: "Legend Slayer", desc: "Erase a Legendary bill", test: (p) => p.legendaryWipes >= 1 },
  { id: "streak", label: "On Fire", desc: "3-day streak", test: (p) => p.streak >= 3 },
  { id: "lvl5", label: "Shadow Lord", desc: "Reach level 5", test: (p) => levelFromXp(p.xp) >= 5 },
];

export function tierOf(total: number) {
  if (total >= 30000) return { label: "Obsidian", cls: "text-white bg-white/10 border-white/30" };
  if (total >= 15000) return { label: "Gold", cls: "text-gold bg-gold/10 border-gold/40" };
  if (total >= 5000) return { label: "Silver", cls: "text-zinc-300 bg-zinc-300/10 border-zinc-300/30" };
  return { label: "Bronze", cls: "text-orange-300 bg-orange-300/10 border-orange-300/30" };
}
