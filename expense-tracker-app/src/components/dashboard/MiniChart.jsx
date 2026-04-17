import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { getDailyData } from '../../services/analyticsService';
import Card from '../ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-theme-card border border-theme-border rounded-xl px-4 py-3 shadow-theme-lg">
      <p className="text-xs text-theme-text-muted mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-sm font-semibold" style={{ color: item.color }}>
          {item.name}: ₹{item.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

const MiniChart = () => {
  const { transactions } = useTransactions();
  const data = getDailyData(transactions, 7);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-theme-text-secondary">Weekly Overview</p>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#34d399]" />
            Earnings
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#fe97b9]" />
            Expenses
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-primary-light)', opacity: 0.3 }} />
            <Bar dataKey="earnings" name="Earnings" fill="#34d399" radius={[6, 6, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expenses" name="Expenses" fill="#fe97b9" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MiniChart;
