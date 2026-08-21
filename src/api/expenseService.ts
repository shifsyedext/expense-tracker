import axiosInstance from './axiosInstance';

import type {
  CreateExpenseRequest,
  Expense,
  UpdateExpenseRequest,
} from '../types/expense';

export const getExpenses = async (
  userId: string,
): Promise<Expense[]> => {
  const response =
    await axiosInstance.get<Expense[]>(
      `/expenses?userId=${userId}`,
    );

  return response.data;
};

export const createExpense = async (
  request: CreateExpenseRequest,
  userId: string,
): Promise<Expense> => {
  const response =
    await axiosInstance.post<Expense>(
      '/expenses',
      {
        ...request,
        userId,
      },
    );

  return response.data;
};

export const deleteExpense = async (
  expenseId: string,
): Promise<void> => {
  await axiosInstance.delete(
    `/expenses/${expenseId}`,
  );
};

export const updateExpense = async (
  request: UpdateExpenseRequest,
): Promise<Expense> => {
  const existingExpense =
    await axiosInstance.get<Expense>(
      `/expenses/${request.id}`,
    );

  const updatedExpense: Expense = {
    ...existingExpense.data,
    ...request,
    userId: existingExpense.data.userId,
  };

  const response =
    await axiosInstance.put<Expense>(
      `/expenses/${request.id}`,
      updatedExpense,
    );

  return response.data;
};