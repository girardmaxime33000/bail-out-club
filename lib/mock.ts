import type { Bill, Category, Lord } from "./types";

const ago = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const mk = (id: string, amount: number, category: Category, grit: number, h: number, story: string,
  funded = 0, handle = "@Void_Dividend"): Bill => ({
  id, amount, category, grit, story, createdAt: ago(h), status: funded >= amount ? "extinguished" : "active",
  funded, pledges: funded ? [{ handle, amount: funded, at: ago(h - 1) }] : [],
  extinguishedAt: funded >= amount ? ago(h - 1) : undefined,
});

export const MOCK_BILLS: Bill[] = [
  mk("b1", 135, "Fine", 8.4, 2, "Parked for four minutes while returning a library book. The ticket arrived before I did."),
  mk("b2", 640, "Repair", 9.1, 5, "The boiler died on the first frost of winter. The technician charged for the sympathy.", 160),
  mk("b3", 212, "Utility", 7.2, 9, "My provider billed me twice for a month I spent abroad. Support's hold music is a cover of a cover."),
  mk("b4", 89, "Fine", 5.6, 14, "A late fee for a late fee. I am being taxed for the concept of lateness itself.", 45),
  mk("b5", 1480, "Repair", 9.6, 20, "Transmission failed one week after the warranty did. The mechanic said it was 'a good run'.", 370),
  mk("b6", 320, "Utility", 7.8, 26, "Electricity catch-up after an estimated meter reading went feral. I own one lamp.", 80),
  mk("b7", 55, "Fine", 4.9, 40, "Overdue transit fine for a ticket I validated. The machine disagreed.", 55, "@Lord_Null_99"),
  mk("b8", 410, "Utility", 6.4, 6, "Water bill spiked 900% after a neighbour's pool. I do not have a pool. I barely have a bath."),
  mk("b9", 95, "Repair", 5.2, 11, "Phone screen cracked inside its own protective case. The case is now a cautionary tale."),
  mk("b10", 760, "Fine", 8.8, 3, "Fined for an expired permit on the exact day it was renewed. Paperwork travels slower than rage."),
  mk("b11", 180, "Repair", 6.9, 17, "Bike stolen, replacement lock stolen, replacement bike's lock arrived on a Tuesday. Of course."),
  mk("b12", 275, "Utility", 7.5, 30, "Internet cut off for 'maintenance' that apparently included my entire personality."),
];

export const MOCK_LORDS: Lord[] = [
  { handle: "@Lord_Null_99", total: 48200, wipes: 112 },
  { handle: "@MonopolyMan_Off", total: 36750, wipes: 87 },
  { handle: "@Void_Dividend", total: 21400, wipes: 54 },
  { handle: "@OffshoreOwl", total: 15980, wipes: 39 },
  { handle: "@Quiet_Yacht", total: 9320, wipes: 21 },
  { handle: "@Tax_Haven_Ted", total: 4110, wipes: 12 },
  { handle: "@Margin_Call_Mo", total: 2650, wipes: 8 },
];

export const PATRON_HANDLE = "@Anon_Whale_01";
export const BASE_ERASED = 1_284_300;
