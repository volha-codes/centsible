export interface Account {
  id: string;
  name: string;
  currency: string;
  startingBalance: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  date: number;
  note: string;
}

interface RecurringRuleBase {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  note: string;
  startDate: number;
  lastGeneratedDate?: number;
  endDate?: number;
}

export type RecurringRule =
  | (RecurringRuleBase & { frequency: "monthly"; dayOfMonth: number })
  | (RecurringRuleBase & { frequency: "weekly"; dayOfWeek: number });
