import type { Category } from "./types";

const OUTRAGE = [
  "tow", "ticket", "fine", "late", "fee", "penalty", "broke", "burst", "flood",
  "ruined", "again", "twice", "never", "unfair", "wrong", "mistake", "minutes",
  "overcharged", "cut off", "disconnected", "winter", "rent", "landlord",
];
const BASE: Record<Category, number> = { Utility: 4.6, Fine: 5.4, Repair: 5.0 };

/** Deterministic, simulated "Teeth-Grinding Score". Not real AI. */
export function computeGrit(amount: number, category: Category, story: string): number {
  const text = story.toLowerCase();
  const hits = OUTRAGE.filter((w) => text.includes(w)).length;
  const sentences = story.split(/[.!?]+/).filter((s) => s.trim()).length;
  const size = Math.min(2.2, Math.log10(Math.max(amount, 1)) * 0.75);
  const absurd = Math.min(1.6, hits * 0.4);
  const brevity = sentences === 2 ? 0.4 : 0;
  const jitter = ((amount * 31 + story.length * 17) % 13) / 13 * 0.6;
  const raw = BASE[category] + size * 0.6 + absurd + brevity + jitter;
  return Math.round(Math.min(9.9, Math.max(1, raw)) * 10) / 10;
}

export function gritLabel(g: number): string {
  if (g >= 8.5) return "Molar-Shattering";
  if (g >= 7) return "Teeth-Grinding";
  if (g >= 5) return "Jaw-Tightening";
  return "Mild Sigh";
}
