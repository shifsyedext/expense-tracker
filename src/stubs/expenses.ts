import type {
  CreateExpenseRequest,
  Expense,
  UpdateExpenseRequest,
} from '../types/expense';

const STORAGE_KEY =
  'expense_tracker_mock_expenses';

const loadExpenses = (): Expense[] => {
  const storedExpenses =
    localStorage.getItem(STORAGE_KEY);

  if (storedExpenses === null) {
    return [];
  }

  try {
    return JSON.parse(
      storedExpenses,
    ) as Expense[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return [];
  }
};

const saveExpenses = (
  expenses: Expense[],
): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(expenses),
  );
};

const getCurrentUserId = (): string => {
  const storedUser =
    sessionStorage.getItem(
      'expense_tracker_user',
    );

  if (storedUser === null) {
    throw new Error(
      'No authenticated user found.',
    );
  }

  const user = JSON.parse(storedUser) as {
    readonly id: string;
  };

  return user.id;
};

export const getStubExpenses =
  async (): Promise<Expense[]> => {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 300);
    });

    const currentUserId =
      getCurrentUserId();

    return loadExpenses().filter(
      (expense) =>
        expense.userId === currentUserId,
    );
  };

export const createStubExpense = async (
  request: CreateExpenseRequest,
): Promise<Expense> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 300);
  });

  const expense: Expense = {
    id: `expense-${Date.now()}`,
    userId: getCurrentUserId(),
    title: request.title.trim(),
    amount: request.amount,
    category: request.category,
    date: request.date,
    notes: request.notes.trim(),
  };

  const expenses = loadExpenses();

  saveExpenses([
    expense,
    ...expenses,
  ]);

  return expense;
};

export const deleteStubExpense = async (
  expenseId: string,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 300);
  });

  const currentUserId =
    getCurrentUserId();

  const expenses = loadExpenses();

  const updatedExpenses = expenses.filter(
    (expense) =>
      !(
        expense.id === expenseId &&
        expense.userId === currentUserId
      ),
  );

  saveExpenses(updatedExpenses);
};

export const updateStubExpense = async (
  request: UpdateExpenseRequest,
): Promise<Expense> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 300);
  });

  const currentUserId =
    getCurrentUserId();

  const expenses = loadExpenses();

  const existingExpense = expenses.find(
    (expense) =>
      expense.id === request.id &&
      expense.userId === currentUserId,
  );

  if (existingExpense === undefined) {
    throw new Error(
      'Expense not found.',
    );
  }

  const updatedExpense: Expense = {
    id: existingExpense.id,
    userId: existingExpense.userId,
    title: request.title.trim(),
    amount: request.amount,
    category: request.category,
    date: request.date,
    notes: request.notes.trim(),
  };

  const updatedExpenses = expenses.map(
    (expense) =>
      expense.id === request.id
        ? updatedExpense
        : expense,
  );

  saveExpenses(updatedExpenses);

  return updatedExpense;
};