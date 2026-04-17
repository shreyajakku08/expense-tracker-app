import React from 'react';
import { motion } from 'framer-motion';
import { HiTrendingUp, HiTrendingDown, HiCash } from 'react-icons/hi';
import { useTransactions } from '../../context/TransactionContext';
import AnimatedCounter from '../shared/AnimatedCounter';
import Card from '../ui/Card';

const SummaryCards = () => {
  const { summary } = useTransactions();

  const formatter = (val) => {
    const absVal = Math.abs(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(absVal);
  };

  const cards = [
    {
      title: 'Total Earnings',
      value: summary.totalEarnings,
      icon: <HiTrendingUp className="w-6 h-6" />,
      iconBg: 'bg-[#34d399]/15',
      iconColor: 'text-[#34d399]',
      borderColor: 'border-l-[#34d399]',
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: <HiTrendingDown className="w-6 h-6" />,
      iconBg: 'bg-[#fe97b9]/15',
      iconColor: 'text-[#fe97b9]',
      borderColor: 'border-l-[#fe97b9]',
    },
    {
      title: 'Balance',
      value: summary.balance,
      icon: <HiCash className="w-6 h-6" />,
      iconBg: 'bg-[#a0e0ff]/15',
      iconColor: 'text-[#a0e0ff]',
      borderColor: 'border-l-[#a0e0ff]',
      isBalance: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.title}
          className={`border-l-4 ${card.borderColor}`}
          hover
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-theme-text-secondary">
                {card.title}
              </p>
              <div className={`p-2 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              card.isBalance
                ? summary.balance >= 0
                  ? 'text-[#34d399]'
                  : 'text-[#ff6e84]'
                : 'text-theme-text'
            }`}>
              <AnimatedCounter
                value={card.value}
                formatter={formatter}
                duration={1200}
              />
            </div>
            <p className="text-xs text-theme-text-muted mt-1">This month</p>
          </motion.div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
