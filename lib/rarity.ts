export type Rarity = "common" | "rare" | "epic" | "legendary";

export function rarityOf(grit: number): Rarity {
  if (grit >= 8.5) return "legendary";
  if (grit >= 7) return "epic";
  if (grit >= 5.5) return "rare";
  return "common";
}

export const RARITY: Record<Rarity, {
  label: string; mult: number; border: string; text: string; chip: string; glow: string; bar: string; seg: string; hex: string;
}> = {
  common:    { label: "Common",    mult: 1,    border: "border-white/10",      text: "text-white/60",  chip: "bg-white/5 text-white/60 border-white/10",         glow: "",                                                   bar: "bg-white/50",                                       seg: "bg-white/60",   hex: "#a1a1aa" },
  rare:      { label: "Rare",      mult: 1.25, border: "border-sky-400/40",    text: "text-sky-300",   chip: "bg-sky-400/10 text-sky-300 border-sky-400/30",     glow: "shadow-[0_0_40px_-14px_rgba(56,189,248,0.6)]",       bar: "bg-sky-400",                                        seg: "bg-sky-400",    hex: "#38bdf8" },
  epic:      { label: "Epic",      mult: 1.6,  border: "border-arcane/50",     text: "text-arcane",    chip: "bg-arcane/10 text-arcane border-arcane/40",        glow: "shadow-[0_0_46px_-12px_rgba(155,92,255,0.65)]",      bar: "bg-arcane",                                         seg: "bg-arcane",     hex: "#9b5cff" },
  legendary: { label: "Legendary", mult: 2,    border: "border-gold/60",       text: "text-gold",      chip: "bg-gold/10 text-gold border-gold/50",              glow: "shadow-[0_0_60px_-12px_rgba(245,184,61,0.7)]",       bar: "bg-gradient-to-r from-gold-deep via-gold to-gold-soft", seg: "bg-gold", hex: "#f5b83d" },
};
