import type { Bill, Lord } from "./types";

const ago = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const MOCK_BILLS: Bill[] = [
  { id: "b1", amount: 135, category: "Fine", grit: 8.4, status: "active", createdAt: ago(2),
    story: "Parked for four minutes while returning a library book. The ticket arrived before I did." },
  { id: "b2", amount: 640, category: "Repair", grit: 9.1, status: "active", createdAt: ago(5),
    story: "The boiler died on the first frost of winter. The technician charged for the sympathy." },
  { id: "b3", amount: 212, category: "Utility", grit: 7.2, status: "active", createdAt: ago(9),
    story: "My provider billed me twice for a month I spent abroad. Support's hold music is a cover of a cover." },
  { id: "b4", amount: 89, category: "Fine", grit: 6.3, status: "active", createdAt: ago(14),
    story: "A late fee for a late fee. I am being taxed for the concept of lateness itself." },
  { id: "b5", amount: 1480, category: "Repair", grit: 9.4, status: "active", createdAt: ago(20),
    story: "Transmission failed one week after the warranty did. The mechanic said it was 'a good run'." },
  { id: "b6", amount: 320, category: "Utility", grit: 7.8, status: "active", createdAt: ago(26),
    story: "Electricity catch-up after an estimated meter reading went feral. I own one lamp." },
  { id: "b7", amount: 55, category: "Fine", grit: 5.6, status: "extinguished", createdAt: ago(40),
    extinguishedBy: "@Lord_Null_99", extinguishedAt: ago(30),
    story: "Overdue transit fine for a ticket I validated. The machine disagreed." },
];

export const MOCK_LORDS: Lord[] = [
  { handle: "@Lord_Null_99", total: 48200, wipes: 112 },
  { handle: "@MonopolyMan_Off", total: 36750, wipes: 87 },
  { handle: "@Void_Dividend", total: 21400, wipes: 54 },
  { handle: "@OffshoreOwl", total: 15980, wipes: 39 },
  { handle: "@Quiet_Yacht", total: 9320, wipes: 21 },
  { handle: "@Tax_Haven_Ted", total: 4110, wipes: 12 },
];

export const PATRON_HANDLE = "@Anon_Whale_01";
