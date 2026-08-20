import {
  Card,
  Statistic,
} from 'antd';
import type { ReactNode } from 'react';
import './SummaryCard.css';

interface SummaryCardProps {
  readonly title: string;
  readonly value: number;
  readonly prefix?: ReactNode;
  readonly suffix?: string;
}

const SummaryCard = ({
  title,
  value,
  prefix,
  suffix,
}: SummaryCardProps): React.JSX.Element => {
  return (
    <Card className="summary-card">
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
      />
    </Card>
  );
};

export default SummaryCard;