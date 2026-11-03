"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Bill, Category, Lord } from "./types";
import { MOCK_BILLS, MOCK_LORDS, PATRON_HANDLE } from "./mock";
import { computeGrit } from "./grit";
import { getSupabase, supabaseConfigured } from "./supabase";

interface Store {
  bills: Bill[];
  lords: Lord[];
  ready: boolean;
  mode: "demo" | "supabase";
  useSupabase: boolean;
  setUseSupabase: (v: boolean) => void;
  submitBill: (b: { amount: number; category: Category; story: string }) => Promise<Bill>;
  wipeBill: (id: string) => Promise<void>;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);
const LS_BILLS = "boc.bills.v1";
const LS_MODE = "boc.supabase";

type Row = {
  id: string; amount: number | string; category: Category; story: string; grit: number | string;
  status: Bill["status"]; created_at: string; extinguished_by: string | null; extinguished_at: string | null;
};
const fromRow = (r: Row): Bill => ({
  id: r.id, amount: Number(r.amount), category: r.category, story: r.story, grit: Number(r.grit),
  status: r.status, createdAt: r.created_at,
  extinguishedBy: r.extinguished_by ?? undefined, extinguishedAt: r.extinguished_at ?? undefined,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [ready, setReady] = useState(false);
  const [useSupabase, setUseSb] = useState(false);

  const live = useSupabase && supabaseConfigured;

  // hydrate
  useEffect(() => {
    try {
      setUseSb(localStorage.getItem(LS_MODE) === "1");
      const raw = localStorage.getItem(LS_BILLS);
      if (raw) setBills(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  // persist demo state
  useEffect(() => {
    if (!ready || live) return;
    try { localStorage.setItem(LS_BILLS, JSON.stringify(bills)); } catch {}
  }, [bills, ready, live]);

  // load from supabase when toggled on
  useEffect(() => {
    if (!ready || !live) return;
    const sb = getSupabase();
    sb?.from("bills").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setBills(data.map((r) => fromRow(r as Row)));
    });
  }, [ready, live]);

  const setUseSupabase = useCallback((v: boolean) => {
    setUseSb(v);
    try { localStorage.setItem(LS_MODE, v ? "1" : "0"); } catch {}
    if (!v) {
      try { const raw = localStorage.getItem(LS_BILLS); setBills(raw ? JSON.parse(raw) : MOCK_BILLS); }
      catch { setBills(MOCK_BILLS); }
    }
  }, []);

  const submitBill: Store["submitBill"] = useCallback(async (input) => {
    const grit = computeGrit(input.amount, input.category, input.story);
    const local: Bill = {
      id: crypto.randomUUID(), ...input, grit, status: "active", createdAt: new Date().toISOString(),
    };
    const sb = live ? getSupabase() : null;
    if (sb) {
      const { data, error } = await sb.from("bills")
        .insert({ amount: input.amount, category: input.category, story: input.story, grit })
        .select().single();
      if (error) throw error;
      const b = fromRow(data as Row);
      setBills((p) => [b, ...p]);
      return b;
    }
    setBills((p) => [local, ...p]);
    return local;
  }, [live]);

  const wipeBill: Store["wipeBill"] = useCallback(async (id) => {
    const at = new Date().toISOString();
    const sb = live ? getSupabase() : null;
    if (sb) {
      const { error } = await sb.from("bills")
        .update({ status: "extinguished", extinguished_by: PATRON_HANDLE, extinguished_at: at })
        .eq("id", id).eq("status", "active");
      if (error) throw error;
    }
    setBills((p) => p.map((b) =>
      b.id === id && b.status === "active"
        ? { ...b, status: "extinguished", extinguishedBy: PATRON_HANDLE, extinguishedAt: at } : b));
  }, [live]);

  const resetDemo = useCallback(() => setBills(MOCK_BILLS), []);

  const lords = useMemo<Lord[]>(() => {
    const map = new Map<string, Lord>();
    if (!live) MOCK_LORDS.forEach((l) => map.set(l.handle, { ...l }));
    bills.forEach((b) => {
      if (b.status !== "extinguished" || !b.extinguishedBy) return;
      const l = map.get(b.extinguishedBy) ?? { handle: b.extinguishedBy, total: 0, wipes: 0 };
      l.total += b.amount; l.wipes += 1;
      map.set(b.extinguishedBy, l);
    });
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [bills, live]);

  const value: Store = {
    bills, lords, ready, mode: live ? "supabase" : "demo",
    useSupabase, setUseSupabase, submitBill, wipeBill, resetDemo,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}
