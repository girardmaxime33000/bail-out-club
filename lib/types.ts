export type Category = "Utility" | "Fine" | "Repair";
export const CATEGORIES: Category[] = ["Utility", "Fine", "Repair"];

export type BillStatus = "active" | "extinguished";

export interface Pledge {
  handle: string;
  amount: number;
  at: string;
}

export interface Bill {
  id: string;
  amount: number;
  category: Category;
  story: string;
  grit: number; // 0..10
  status: BillStatus;
  createdAt: string;
  funded: number;
  pledges: Pledge[];
  extinguishedAt?: string;
}

export interface Lord {
  handle: string;
  total: number;
  wipes: number;
}
