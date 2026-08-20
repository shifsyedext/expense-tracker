import type {
  CreateExpenseRequest,
  Expense,
  UpdateExpenseRequest,
} from '../types/expense';

import {
  getStubExpenses,
  createStubExpense,
  deleteStubExpense,
  updateStubExpense,
} from '../stubs/expenses';

export const getExpenses =
  async (): Promise<Expense[]> => {
    return getStubExpenses();
  };

export const createExpense = async (
  request: CreateExpenseRequest,
): Promise<Expense> => {
  return createStubExpense(request);
};

export const deleteExpense = async (
  expenseId: string,
): Promise<void> => {
  return deleteStubExpense(expenseId);
};

export const updateExpense = async (
  request: UpdateExpenseRequest,
): Promise<Expense> => {
  return updateStubExpense(request);
};