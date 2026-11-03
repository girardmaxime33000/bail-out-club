"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Bill, Category, Lord } from "./types";
import { BASE_ERASED, MOCK_BILLS, MOCK_LORDS, PATRON_HANDLE } from "./mock";
import { computeGrit } from "./grit";
import { getSupabase, supabaseConfigured } from "./supabase";
import {
  BADGES, MISSIONS, freshProfile, levelFromXp, titleOf, today, xpFor, type Profile,
} from "./game";
import { rarityOf } from "./rarity";
import { eur } from "./format";

export interface Toast { id: string; kind: "xp" | "level" | "badge" | "mission"; title: string; sub?: string }
export interface Activity { id: string; text: string; at: number }
export interface PledgeResult { amount: number; xp: number; completed: boolean; levelUp: boolean }

interface Store {
  bills: Bill[];
  lords: Lord[];
  profile: Profile;
  toasts: Toast[];
  activity: Activity[];
  celebrate: { level: number; title: string } | null;
  totalErased: number;
  ready: boolean;
  mode: "demo" | "supabase";
  useSupabase: boolean;
  setUseSupabase: (v: boolean) => void;
  submitBill: (b: { amount: number; category: Category; story: string }) => Promise<Bill>;
  pledge: (id: string, fraction: number) => Promise<PledgeResult | null>;
  pledgeAmount: (bill: Bill, fraction: number) => number;
  dismissToast: (id: string) => void;
  closeCelebrate: () => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);
const LS_BILLS = "boc.bills.v2";
const LS_PROFILE = "boc.profile.v1";
const LS_MODE = "boc.supabase";

type Row = {
  id: string; amount: number | string; category: Category; story: string; grit: number | string;
  status: Bill["status"]; created_at: string; extinguished_at: string | null;
  pledges?: { handle: string; amount: number | string; created_at: string }[];
};
const fromRow = (r: Row): Bill => {
  const pledges = (r.pledges ?? []).map((p) => ({ handle: p.handle, amount: Number(p.amount), at: p.created_at }));
  return {
    id: r.id, amount: Number(r.amount), category: r.category, story: r.story, grit: Number(r.grit),
    status: r.status, createdAt: r.created_at, extinguishedAt: r.extinguished_at ?? undefined,
    pledges, funded: pledges.reduce((s, p) => s + p.amount, 0),
  };
};

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [profile, setProfile] = useState<Profile>(freshProfile());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [celebrate, setCelebrate] = useState<Store["celebrate"]>(null);
  const [ready, setReady] = useState(false);
  const [useSupabase, setUseSb] = useState(false);

  const billsRef = useRef(bills); billsRef.current = bills;
  const profileRef = useRef(profile); profileRef.current = profile;
  const live = useSupabase && supabaseConfigured;

  useEffect(() => {
    try {
      setUseSb(localStorage.getItem(LS_MODE) === "1");
      const rb = localStorage.getItem(LS_BILLS); if (rb) setBills(JSON.parse(rb));
      const rp = localStorage.getItem(LS_PROFILE);
      if (rp) {
        const p: Profile = JSON.parse(rp);
        if (p.daily?.date !== today()) p.daily = freshProfile().daily;
        setProfile(p);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
      if (!live) localStorage.setItem(LS_BILLS, JSON.stringify(bills));
    } catch {}
  }, [bills, profile, ready, live]);

  useEffect(() => {
    if (!ready || !live) return;
    getSupabase()?.from("bills").select("*, pledges(*)").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setBills(data.map((r) => fromRow(r as Row))); });
  }, [ready, live]);

  const setUseSupabase = useCallback((v: boolean) => {
    setUseSb(v);
    try { localStorage.setItem(LS_MODE, v ? "1" : "0"); } catch {}
    if (!v) {
      try { const raw = localStorage.getItem(LS_BILLS); setBills(raw ? JSON.parse(raw) : MOCK_BILLS); }
      catch { setBills(MOCK_BILLS); }
    }
  }, []);

  const pushToast = useCallback((t: Omit<Toast, "id">) => setToasts((p) => [...p, { ...t, id: uid() }]), []);
  const dismissToast = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const submitBill: Store["submitBill"] = useCallback(async (input) => {
    const grit = computeGrit(input.amount, input.category, input.story);
    const sb = live ? getSupabase() : null;
    let bill: Bill;
    if (sb) {
      const { data, error } = await sb.from("bills")
        .insert({ amount: input.amount, category: input.category, story: input.story, grit })
        .select().single();
      if (error) throw error;
      bill = fromRow({ ...(data as Row), pledges: [] });
    } else {
      bill = { id: crypto.randomUUID(), ...input, grit, status: "active", createdAt: new Date().toISOString(), funded: 0, pledges: [] };
    }
    setBills((p) => [bill, ...p]);
    setActivity((a) => [{ id: uid(), at: Date.now(), text: `New ${rarityOf(grit)} bill entered the pool · ${eur(bill.amount)} ${bill.category}` }, ...a].slice(0, 12));
    return bill;
  }, [live]);

  const pledgeAmount = useCallback((bill: Bill, fraction: number) => {
    const remaining = Math.round((bill.amount - bill.funded) * 100) / 100;
    if (fraction >= 1) return remaining;
    return Math.min(remaining, Math.max(1, Math.round(bill.amount * fraction)));
  }, []);

  const pledge: Store["pledge"] = useCallback(async (id, fraction) => {
    const bill = billsRef.current.find((b) => b.id === id);
    if (!bill || bill.status !== "active") return null;
    const amount = pledgeAmount(bill, fraction);
    const remaining = Math.round((bill.amount - bill.funded) * 100) / 100;
    const completed = amount >= remaining;
    const at = new Date().toISOString();

    const sb = live ? getSupabase() : null;
    if (sb) {
      const { error } = await sb.from("pledges").insert({ bill_id: id, handle: PATRON_HANDLE, amount });
      if (error) throw error;
      if (completed) await sb.from("bills").update({ status: "extinguished", extinguished_at: at }).eq("id", id);
    }

    setBills((p) => p.map((b) => b.id !== id ? b : {
      ...b, funded: b.funded + amount, pledges: [...b.pledges, { handle: PATRON_HANDLE, amount, at }],
      status: completed ? "extinguished" : "active", extinguishedAt: completed ? at : b.extinguishedAt,
    }));
    setActivity((a) => [{ id: uid(), at: Date.now(), text: `You ${completed ? "erased" : "pledged"} ${eur(amount)} · ${bill.category}` }, ...a].slice(0, 12));

    // --- game logic ---
    const prev = profileRef.current;
    const isLegend = rarityOf(bill.grit) === "legendary";
    const t = today();
    const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
    const base: Profile = prev.daily.date === t ? prev : { ...prev, daily: freshProfile().daily };
    let xp = xpFor(bill, amount, completed);
    const next: Profile = {
      ...base,
      streak: prev.lastDay === t ? prev.streak : prev.lastDay === yesterday ? prev.streak + 1 : 1,
      lastDay: t,
      totalPledged: prev.totalPledged + amount,
      wipes: prev.wipes + (completed ? 1 : 0),
      legendaryWipes: prev.legendaryWipes + (completed && isLegend ? 1 : 0),
      daily: {
        ...base.daily,
        pledges: base.daily.pledges + 1,
        euros: base.daily.euros + amount,
        legendary: base.daily.legendary + (isLegend ? 1 : 0),
        done: [...base.daily.done],
      },
    };
    pushToast({ kind: "xp", title: `+${xp} XP`, sub: `${eur(amount)} ${completed ? "erased" : "pledged"}` });

    for (const m of MISSIONS) {
      if (!next.daily.done.includes(m.id) && m.value(next) >= m.target) {
        next.daily.done.push(m.id); xp += m.reward;
        pushToast({ kind: "mission", title: `Mission complete · +${m.reward} XP`, sub: m.label });
      }
    }
    next.xp = prev.xp + xp;
    for (const b of BADGES) {
      if (!next.badges.includes(b.id) && b.test(next)) {
        next.badges = [...next.badges, b.id];
        pushToast({ kind: "badge", title: `Badge unlocked · ${b.label}`, sub: b.desc });
      }
    }
    const levelUp = levelFromXp(next.xp) > levelFromXp(prev.xp);
    if (levelUp) {
      const lvl = levelFromXp(next.xp);
      setTimeout(() => setCelebrate({ level: lvl, title: titleOf(lvl) }), 1200);
    }
    profileRef.current = next;
    setProfile(next);
    return { amount, xp, completed, levelUp };
  }, [live, pledgeAmount, pushToast]);

  const resetDemo = useCallback(() => { setBills(MOCK_BILLS); setProfile(freshProfile()); setActivity([]); }, []);

  const lords = useMemo<Lord[]>(() => {
    const map = new Map<string, Lord>();
    if (!live) MOCK_LORDS.forEach((l) => map.set(l.handle, { ...l }));
    bills.forEach((b) => b.pledges.forEach((p) => {
      const l = map.get(p.handle) ?? { handle: p.handle, total: 0, wipes: 0 };
      l.total += p.amount; l.wipes += 1; map.set(p.handle, l);
    }));
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [bills, live]);

  const totalErased = useMemo(
    () => (live ? 0 : BASE_ERASED) + bills.reduce((s, b) => s + b.funded, 0), [bills, live]);

  const value: Store = {
    bills, lords, profile, toasts, activity, celebrate, totalErased, ready, mode: live ? "supabase" : "demo",
    useSupabase, setUseSupabase, submitBill, pledge, pledgeAmount, dismissToast,
    closeCelebrate: () => setCelebrate(null), resetDemo,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}
