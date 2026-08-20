export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Other';

export interface Expense {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly amount: number;
  readonly category: ExpenseCategory;
  readonly date: string;
  readonly notes: string;
}

export interface CreateExpenseRequest {
  readonly title: string;
  readonly amount: number;
  readonly category: ExpenseCategory;
  readonly date: string;
  readonly notes: string;
}

export interface UpdateExpenseRequest {
  readonly id: string;
  readonly title: string;
  readonly amount: number;
  readonly category: ExpenseCategory;
  readonly date: string;
  readonly notes: string;
}