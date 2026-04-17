import React from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import AnimatedCounter from '../shared/AnimatedCounter';

const SpendLimitCard = () => {
  const { dailyLimit, daysRemaining, summary } = useTransactions();

  const formatter = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(val));
  };

  // Progress percentage (how much of earnings spent)
  const spentPercentage = summary.totalEarnings > 0
    ? Math.min((summary.totalExpenses / summary.totalEarnings) * 100, 100)
    : 0;

  const getStatusColor = () => {
    if (spentPercentage < 50) return 'text-[#34d399]';
    if (spentPercentage < 75) return 'text-[#fbbf24]';
    return 'text-[#ff6e84]';
  };

  const getProgressColor = () => {
    if (spentPercentage < 50) return 'bg-[#34d399]';
    if (spentPercentage < 75) return 'bg-[#fbbf24]';
    return 'bg-[#ff6e84]';
  };

  return (
    <Card className="border-l-4 border-l-[#fbbf24]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-theme-text-secondary">Daily Spend Limit</p>
        <div className="p-2 rounded-xl bg-[#fbbf24]/15 text-[#fbbf24]">
          ⏳
        </div>
      </div>

      <div className={`text-2xl font-bold ${getStatusColor()} mb-1`}>
        <AnimatedCounter
          value={dailyLimit}
          formatter={formatter}
          duration={1200}
        />
        <span className="text-sm font-normal text-theme-text-muted">/day</span>
      </div>

      <p className="text-xs text-theme-text-muted mb-4">
        {daysRemaining > 0
          ? `You can spend ${formatCurrency(dailyLimit)}/day for the next ${daysRemaining} days to stay on track`
          : 'Last day of the month!'}
      </p>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-theme-text-muted">Budget used</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {spentPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-theme-bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${spentPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${getProgressColor()}`}
          />
        </div>
      </div>
    </Card>
  );
};

export default SpendLimitCard;
