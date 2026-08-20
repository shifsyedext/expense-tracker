import {
  Card,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Expense } from '../../types/expense';
import './RecentTransactions.css';

interface RecentTransactionsProps {
  readonly expenses: readonly Expense[];
}

const { Title } = Typography;

const RecentTransactions = ({
  expenses,
}: RecentTransactionsProps): React.JSX.Element => {
  const columns: ColumnsType<Expense> = [
    {
      title: 'Expense',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: Expense['category']) => (
        <Tag>{category}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) =>
        `₹${amount.toLocaleString('en-IN')}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <Card className="recent-transactions">
      <Title
        level={3}
        className="recent-transactions__title"
      >
        Recent Transactions
      </Title>

      <Table<Expense>
        rowKey="id"
        columns={columns}
        dataSource={expenses}
        pagination={false}
        scroll={{ x: 600 }}
      />
    </Card>
  );
};

export default RecentTransactions;