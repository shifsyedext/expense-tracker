import {
  Button,
  Card,
  Col,
  Empty,
  Layout,
  Row,
  Spin,
  Statistic,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import AppNavigation from '../../components/AppNavigation';
import { getExpenses } from '../../api/expenseService';
import type { Expense } from '../../types/expense';

import './Dashboard.css';

const { Content } = Layout;
const { Title, Text } = Typography;

interface CategorySummary {
  readonly category: Expense['category'];
  readonly amount: number;
}

interface CategoryChartData {
  readonly name: Expense['category'];
  readonly value: number;
}

interface MonthlyExpenseData {
  readonly key: string;
  readonly month: string;
  readonly amount: number;
}

const MONTHS_PER_PAGE = 6;

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const CATEGORY_COLORS: Record<
  Expense['category'],
  string
> = {
  Food: '#1677ff',
  Transport: '#52c41a',
  Shopping: '#faad14',
  Bills: '#f5222d',
  Entertainment: '#722ed1',
  Health: '#13c2c2',
  Other: '#8c8c8c',
};

const Dashboard = (): React.JSX.Element => {
  const { user } = useAuth();
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [monthlyPage, setMonthlyPage] =
    useState<number>(0);

  useEffect(() => {
  const loadExpenses = async (): Promise<void> => {
    if (user?.id === undefined) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    try {
      const response =
        await getExpenses(user.id);

      setExpenses(response);
    } catch {
      message.error(
        'Unable to load dashboard data.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  void loadExpenses();
}, [user?.id]);

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (total, expense) =>
          total + expense.amount,
        0,
      ),
    [expenses],
  );

  const thisMonthExpenses = useMemo(() => {
    const now = new Date();

    return expenses
      .filter((expense) => {
        const expenseDate =
          new Date(expense.date);

        return (
          expenseDate.getMonth() ===
            now.getMonth() &&
          expenseDate.getFullYear() ===
            now.getFullYear()
        );
      })
      .reduce(
        (total, expense) =>
          total + expense.amount,
        0,
      );
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) {
      return 0;
    }

    return totalExpenses / expenses.length;
  }, [expenses.length, totalExpenses]);

  const categorySummary =
    useMemo<CategorySummary[]>(() => {
      const summary = new Map<
        Expense['category'],
        number
      >();

      expenses.forEach((expense) => {
        const currentAmount =
          summary.get(expense.category) ?? 0;

        summary.set(
          expense.category,
          currentAmount + expense.amount,
        );
      });

      return Array.from(
        summary.entries(),
      )
        .map(
          ([category, amount]) => ({
            category,
            amount,
          }),
        )
        .sort(
          (a, b) => b.amount - a.amount,
        );
    }, [expenses]);

  const categoryChartData =
    useMemo<CategoryChartData[]>(
      () =>
        categorySummary.map(
          (item) => ({
            name: item.category,
            value: item.amount,
          }),
        ),
      [categorySummary],
    );

  const monthlyExpenseData =
    useMemo<MonthlyExpenseData[]>(() => {
      const monthlyTotals = new Map<
        string,
        number
      >();

      expenses.forEach((expense) => {
        const expenseDate =
          new Date(expense.date);

        const year =
          expenseDate.getFullYear();

        const month =
          expenseDate.getMonth();

        const key = `${year}-${String(
          month + 1,
        ).padStart(2, '0')}`;

        const currentAmount =
          monthlyTotals.get(key) ?? 0;

        monthlyTotals.set(
          key,
          currentAmount + expense.amount,
        );
      });

      return Array.from(
        monthlyTotals.entries(),
      )
        .sort(([first], [second]) =>
          first.localeCompare(second),
        )
        .map(([key, amount]) => {
          const [, month] = key.split('-');

          return {
            key,
            month:
              MONTH_NAMES[
                Number(month) - 1
              ],
            amount,
          };
        });
    }, [expenses]);

  const monthlyPageCount = Math.max(
    1,
    Math.ceil(
      monthlyExpenseData.length /
        MONTHS_PER_PAGE,
    ),
  );

  const currentMonthlyData =
    useMemo<MonthlyExpenseData[]>(() => {
      const page = Math.min(
        monthlyPage,
        monthlyPageCount - 1,
      );

      const end =
        monthlyExpenseData.length -
        page * MONTHS_PER_PAGE;

      const start = Math.max(
        0,
        end - MONTHS_PER_PAGE,
      );

      return monthlyExpenseData.slice(
        start,
        end,
      );
    }, [
      monthlyExpenseData,
      monthlyPage,
      monthlyPageCount,
    ]);

  const canGoToOlderMonths =
    monthlyPage <
    monthlyPageCount - 1;

  const canGoToNewerMonths =
    monthlyPage > 0;

  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )
        .slice(0, 5),
    [expenses],
  );

  const recentColumns: ColumnsType<Expense> =
    [
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
        ) => (
          <span className="dashboard-page__table-category">
            <span
              className="dashboard-page__category-dot"
              style={{
                backgroundColor:
                  CATEGORY_COLORS[
                    category
                  ],
              }}
            />

            {category}
          </span>
        ),
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
    ];

  if (isLoading) {
    return (
      <Layout className="dashboard-page">
        <AppNavigation />

        <Content className="dashboard-page__content">
          <div className="dashboard-page__loading">
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="dashboard-page">
      <AppNavigation />

      <Content className="dashboard-page__content">
        <div className="dashboard-page__container">
          <div className="dashboard-page__header">
            <Title level={1}>
              Dashboard
            </Title>

            <Text type="secondary">
              Overview of your expense activity.
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card>
                <Statistic
                  title="Total Expenses"
                  value={totalExpenses}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card>
                <Statistic
                  title="This Month"
                  value={thisMonthExpenses}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card>
                <Statistic
                  title="Transactions"
                  value={expenses.length}
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card>
                <Statistic
                  title="Average Expense"
                  value={averageExpense}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            className="dashboard-page__charts"
          >
            <Col
              xs={24}
              lg={10}
            >
              <Card>
                <Title level={3}>
                  Spending by Category
                </Title>

                {categoryChartData.length ===
                0 ? (
                  <Empty
                    description="No expense data yet."
                  />
                ) : (
                  <div className="dashboard-page__chart">
                    <ResponsiveContainer
                      width="100%"
                      height={320}
                    >
                      <PieChart>
                        <Pie
                          data={
                            categoryChartData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                        >
                          {categoryChartData.map(
                            (item) => (
                              <Cell
                                key={item.name}
                                fill={
                                  CATEGORY_COLORS[
                                    item.name
                                  ]
                                }
                              />
                            ),
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(
                            value,
                            _name,
                            item,
                          ) => {
                            const category =
                              item.payload
                                ?.name ??
                              '';

                            return [
                              `₹${Number(
                                value,
                              ).toFixed(2)}`,
                              category,
                            ];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="dashboard-page__category-list">
                      {categorySummary.map(
                        (item) => {
                          const percentage =
                            totalExpenses ===
                            0
                              ? 0
                              : (item.amount /
                                  totalExpenses) *
                                100;

                          return (
                            <div
                              key={
                                item.category
                              }
                              className="dashboard-page__category-item"
                            >
                              <div className="dashboard-page__category-label">
                                <span
                                  className="dashboard-page__category-dot"
                                  style={{
                                    backgroundColor:
                                      CATEGORY_COLORS[
                                        item
                                          .category
                                      ],
                                  }}
                                />

                                <Text>
                                  {
                                    item.category
                                  }
                                </Text>
                              </div>

                              <div className="dashboard-page__category-value">
                                <Text strong>
                                  ₹
                                  {item.amount.toFixed(
                                    2,
                                  )}
                                </Text>

                                <Text type="secondary">
                                  {percentage.toFixed(
                                    1,
                                  )}
                                  %
                                </Text>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            <Col
              xs={24}
              lg={14}
            >
              <Card>
                <div className="dashboard-page__card-header">
                  <div>
                    <Title
                      level={3}
                      className="dashboard-page__card-title"
                    >
                      Monthly Spending
                    </Title>

                    <Text type="secondary">
                      {currentMonthlyData.length >
                      0
                        ? `${
                            currentMonthlyData[0]
                              .month
                          } – ${
                            currentMonthlyData[
                              currentMonthlyData.length -
                                1
                            ].month
                          }`
                        : 'No expense data'}
                    </Text>
                  </div>

                  <div className="dashboard-page__chart-navigation">
                    <Button
                      type="text"
                      size="small"
                      disabled={
                        !canGoToOlderMonths
                      }
                      onClick={() =>
                        setMonthlyPage(
                          (page) =>
                            page + 1,
                        )
                      }
                      aria-label="View older months"
                    >
                      ←
                    </Button>

                    <Button
                      type="text"
                      size="small"
                      disabled={
                        !canGoToNewerMonths
                      }
                      onClick={() =>
                        setMonthlyPage(
                          (page) =>
                            page - 1,
                        )
                      }
                      aria-label="View newer months"
                    >
                      →
                    </Button>
                  </div>
                </div>

                {monthlyExpenseData.length ===
                0 ? (
                  <Empty
                    description="No expense data yet."
                  />
                ) : (
                  <div className="dashboard-page__monthly-chart">
                    <ResponsiveContainer
                      width="100%"
                      height={360}
                    >
                      <BarChart
                        data={
                          currentMonthlyData
                        }
                        margin={{
                          top: 16,
                          right: 8,
                          left: 8,
                          bottom: 8,
                        }}
                      >
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(
                            value: number,
                          ) =>
                            `₹${value}`
                          }
                        />

                        <Tooltip
                          formatter={(
                            value,
                          ) =>
                            `₹${Number(
                              value,
                            ).toFixed(2)}`
                          }
                          labelFormatter={(
                            label,
                          ) =>
                            `${label} spending`
                          }
                        />

                        <Bar
                          dataKey="amount"
                          name="Expenses"
                          fill="#1677ff"
                          radius={[
                            6,
                            6,
                            0,
                            0,
                          ]}
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            className="dashboard-page__transactions"
          >
            <Col span={24}>
              <Card>
                <div className="dashboard-page__card-header">
                  <div>
                    <Title
                      level={3}
                      className="dashboard-page__card-title"
                    >
                      Recent Transactions
                    </Title>

                    <Text type="secondary">
                      Your five most recent expenses
                    </Text>
                  </div>
                </div>

                {recentExpenses.length ===
                0 ? (
                  <Empty
                    description="No transactions yet."
                  />
                ) : (
                  <Table<Expense>
                    rowKey="id"
                    columns={
                      recentColumns
                    }
                    dataSource={
                      recentExpenses
                    }
                    pagination={false}
                    scroll={{
                      x: 600,
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
