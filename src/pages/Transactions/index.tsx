import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Layout,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import AppNavigation from '../../components/AppNavigation';
import ExpenseForm from '../../components/ExpenseForm';

import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../../api/expenseService';

import type {
  CreateExpenseRequest,
  Expense,
  UpdateExpenseRequest,
} from '../../types/expense';

import './Transactions.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const Transactions = (): React.JSX.Element => {
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const [
    isLoadingExpenses,
    setIsLoadingExpenses,
  ] = useState<boolean>(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] =
    useState<string>('');

  const [selectedCategory, setSelectedCategory] =
    useState<Expense['category'] | 'All'>('All');

  const handleLoadExpenses =
    async (): Promise<void> => {
      setIsLoadingExpenses(true);
      setLoadError(null);

      try {
        const response = await getExpenses();

        setExpenses(response);
      } catch {
        setLoadError(
          'Unable to load your expenses.',
        );
      } finally {
        setIsLoadingExpenses(false);
      }
    };

  useEffect(() => {
    void handleLoadExpenses();
  }, []);

  const handleCreateExpense = async (
    values: CreateExpenseRequest,
  ): Promise<void> => {
    try {
      const createdExpense =
        await createExpense(values);

      setExpenses((currentExpenses) => [
        createdExpense,
        ...currentExpenses,
      ]);

      message.success(
        'Expense added successfully.',
      );
    } catch {
      message.error(
        'Unable to add expense. Please try again.',
      );

      throw new Error(
        'Unable to create expense.',
      );
    }
  };

  const handleUpdateExpense = async (
    values: CreateExpenseRequest,
  ): Promise<void> => {
    if (editingExpense === null) {
      return;
    }

    const request: UpdateExpenseRequest = {
      id: editingExpense.id,
      ...values,
    };

    try {
      const updatedExpense =
        await updateExpense(request);

      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === updatedExpense.id
            ? updatedExpense
            : expense,
        ),
      );

      setEditingExpense(null);

      message.success(
        'Expense updated successfully.',
      );
    } catch {
      message.error(
        'Unable to update expense.',
      );

      throw new Error(
        'Unable to update expense.',
      );
    }
  };

  const handleDeleteExpense = async (
    expenseId: string,
  ): Promise<void> => {
    try {
      await deleteExpense(expenseId);

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            expense.id !== expenseId,
        ),
      );

      if (
        editingExpense?.id === expenseId
      ) {
        setEditingExpense(null);
      }

      message.success(
        'Expense deleted successfully.',
      );
    } catch {
      message.error(
        'Unable to delete expense.',
      );
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        search === '' ||
        expense.title
          .toLowerCase()
          .includes(search) ||
        expense.notes
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === 'All' ||
        expense.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    },
  );

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const columns: ColumnsType<Expense> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Text strong>{title}</Text>
      ),
    },

    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (
        category: Expense['category'],
      ) => <Tag>{category}</Tag>,
    },

    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) =>
        `₹${amount.toFixed(2)}`,
    },

    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },

    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) =>
        notes || '—',
    },

    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, expense) => (
        <div className="transactions-page__actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label={`Edit ${expense.title}`}
            onClick={() =>
              setEditingExpense(expense)
            }
          />

          <Popconfirm
            title="Delete this expense?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() =>
              handleDeleteExpense(expense.id)
            }
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${expense.title}`}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout className="transactions-page">
      <AppNavigation />

      <Content className="transactions-page__content">
        <div className="transactions-page__container">
          <div className="transactions-page__header">
            <Title level={1}>
              Transactions
            </Title>

            <Text type="secondary">
              Manage your expenses in one place.
            </Text>
          </div>

          <ExpenseForm
            initialValues={
              editingExpense === null
                ? undefined
                : {
                    title: editingExpense.title,
                    amount: editingExpense.amount,
                    category:
                      editingExpense.category,
                    date: editingExpense.date,
                    notes: editingExpense.notes,
                  }
            }
            submitLabel={
              editingExpense === null
                ? 'Add Expense'
                : 'Update Expense'
            }
            onSubmit={
              editingExpense === null
                ? handleCreateExpense
                : handleUpdateExpense
            }
          />

          {editingExpense !== null && (
            <Button
              type="link"
              onClick={() =>
                setEditingExpense(null)
              }
              className="transactions-page__cancel-edit"
            >
              Cancel editing
            </Button>
          )}

          <Card className="transactions-page__filters">
            <div className="transactions-page__filter-row">
              <Input
                placeholder="Search expenses..."
                allowClear
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
                aria-label="Search expenses"
                className="transactions-page__search"
              />

              <Select
                value={selectedCategory}
                onChange={(value) =>
                  setSelectedCategory(value)
                }
                aria-label="Filter by category"
                className="transactions-page__category"
                options={[
                  {
                    label: 'All categories',
                    value: 'All',
                  },
                  {
                    label: 'Food',
                    value: 'Food',
                  },
                  {
                    label: 'Transport',
                    value: 'Transport',
                  },
                  {
                    label: 'Shopping',
                    value: 'Shopping',
                  },
                  {
                    label: 'Bills',
                    value: 'Bills',
                  },
                  {
                    label: 'Entertainment',
                    value: 'Entertainment',
                  },
                  {
                    label: 'Health',
                    value: 'Health',
                  },
                  {
                    label: 'Other',
                    value: 'Other',
                  },
                ]}
              />

              <Button
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </Card>

          <Card className="transactions-page__list-card">
            <Title level={3}>
              Your Expenses
            </Title>

            {loadError !== null && (
              <Alert
                type="error"
                showIcon
                message={loadError}
                className="transactions-page__alert"
              />
            )}

            {isLoadingExpenses ? (
              <div className="transactions-page__loading">
                <Spin size="large" />
              </div>
            ) : filteredExpenses.length === 0 ? (
              <Empty
                description={
                  expenses.length === 0
                    ? 'No expenses yet.'
                    : 'No expenses match your filters.'
                }
              />
            ) : (
              <Table<Expense>
                rowKey="id"
                columns={columns}
                dataSource={filteredExpenses}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                }}
                scroll={{
                  x: 'max-content',
                }}
              />
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Transactions;