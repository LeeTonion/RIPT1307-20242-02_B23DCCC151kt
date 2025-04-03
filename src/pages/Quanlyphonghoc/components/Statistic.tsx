import React from 'react';
import { Typography } from 'antd';

interface StatisticProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
}

const Statistic: React.FC<StatisticProps> = ({ title, value, prefix }) => {
  return (
    <div className="statistic">
      <Typography.Text type="secondary">{title}</Typography.Text>
      <div className="statistic-value">
        {prefix && <span className="statistic-prefix">{prefix}</span>}
        <Typography.Title level={4} className="statistic-number">
          {value}
        </Typography.Title>
      </div>
    </div>
  );
};

export default Statistic;