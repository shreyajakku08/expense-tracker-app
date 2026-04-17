import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTrash } from 'react-icons/hi';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import Card from '../ui/Card';
import EmptyState from '../shared/EmptyState';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const toast = useToast();

  // Sort by most recent first, show last 10
  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted 🗑️');
  };

  const getCategoryInfo = (categoryId) => {
    return DEFAULT_CATEGORIES.find((c) => c.id === categoryId) || {
      emoji: '📌',
      name: categoryId,
      color: '#64748b',
    };
  };

  if (recentTransactions.length === 0) {
    return (
      <Card hover={false}>
        <EmptyState
          icon="💳"
          title="No transactions yet"
          description="Add your first transaction using the form above to start tracking your finances."
        />
      </Card>
    );
  }

  return (
    <Card padding="p-0" hover={false}>
      <div className="px-6 py-4 border-b border-theme-border">
        <h3 className="text-sm font-semibold text-theme-text flex items-center justify-between">
          Recent Transactions
          <span className="text-xs font-normal text-theme-text-muted">
            {transactions.length} total
          </span>
        </h3>
      </div>

      <div className="divide-y divide-theme-border max-h-96 overflow-y-auto">
        <AnimatePresence>
          {recentTransactions.map((t) => {
            const category = getCategoryInfo(t.category);
            const isExpense = t.type === 'expense';

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex items-center gap-3 px-6 py-3 hover:bg-theme-card-hover transition-colors group"
              >
                {/* Category emoji */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.emoji}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-text truncate">
                    {t.description}
                  </p>
                  <p className="text-xs text-theme-text-muted">
                    {category.name} • {formatRelativeDate(t.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className={`text-sm font-bold flex-shrink-0 ${isExpense ? 'text-[#fe97b9]' : 'text-[#34d399]'}`}>
                  {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg text-theme-text-muted opacity-0 group-hover:opacity-100 hover:text-[#ff6e84] hover:bg-[#ff6e84]/10 transition-all flex-shrink-0"
                  title="Delete"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default TransactionList;
