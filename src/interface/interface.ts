// interfaces.ts
export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  transactionType: string;
  userId: string;
}

export interface Budget {
  id?: string;
  category: string;
  amount: number;
  // expense: string;
  userId: string;
}
export interface Goal {
  id?: string;
  goalCategory: string;
  amount: number;
  savings: string;
  description: string;
  userId: string;
}
