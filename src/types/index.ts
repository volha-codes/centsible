export interface Account {
  id: string;
  name: string;
  currency: string;
  startingBalance: number;
  balance: number;
}

export type AccountInput = Omit<Account, "id" | "balance">;

export interface User {
  id: string;
  email: string;
  firstName: string;
}

export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

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
