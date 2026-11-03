export type Category = "Utility" | "Fine" | "Repair";
export const CATEGORIES: Category[] = ["Utility", "Fine", "Repair"];

export type BillStatus = "active" | "extinguished";

export interface Bill {
  id: string;
  amount: number;
  category: Category;
  story: string;
  grit: number; // 0..10
  status: BillStatus;
  createdAt: string;
  extinguishedBy?: string; // patron handle
  extinguishedAt?: string;
}

export interface Lord {
  handle: string;
  total: number;
  wipes: number;
}
