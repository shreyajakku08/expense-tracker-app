// ========================================
// ANALYTICS SERVICE
// Data transformation for charts and insights
// ========================================

import { getLastNDays, getLastNMonths, isSameDay, getStartOfWeek } from '../utils/dateUtils';
import { DEFAULT_CATEGORIES } from '../utils/constants';

/**
 * Get daily spending data for the last N days
 * @param {Array} transactions
 * @param {number} numDays
 * @returns {Array<{ date: string, label: string, expenses: number, earnings: number }>}
 */
export const getDailyData = (transactions, numDays = 7) => {
  const days = getLastNDays(numDays);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days.map((day) => {
    const dayTransactions = transactions.filter((t) => isSameDay(new Date(t.date), day));

    const expenses = dayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const earnings = dayTransactions
      .filter((t) => t.type === 'earning')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: day.toISOString(),
      label: dayLabels[day.getDay()],
      fullLabel: `${day.getDate()}/${day.getMonth() + 1}`,
      expenses,
      earnings,
    };
  });
};

/**
 * Get weekly spending data for the last N weeks
 * @param {Array} transactions
 * @param {number} numWeeks
 * @returns {Array}
 */
export const getWeeklyData = (transactions, numWeeks = 4) => {
  const weeks = [];
  const now = new Date();

  for (let i = numWeeks - 1; i >= 0; i--) {
    const weekStart = getStartOfWeek(new Date(now));
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= weekStart && d <= weekEnd;
    });

    const expenses = weekTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const earnings = weekTransactions
      .filter((t) => t.type === 'earning')
      .reduce((sum, t) => sum + t.amount, 0);

    weeks.push({
      label: `W${numWeeks - i}`,
      fullLabel: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
      expenses,
      earnings,
    });
  }

  return weeks;
};

/**
 * Get monthly spending data for the last N months
 * @param {Array} transactions
 * @param {number} numMonths
 * @returns {Array}
 */
export const getMonthlyData = (transactions, numMonths = 6) => {
  const months = getLastNMonths(numMonths);

  return months.map(({ month, year, label }) => {
    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const earnings = monthTransactions
      .filter((t) => t.type === 'earning')
      .reduce((sum, t) => sum + t.amount, 0);

    return { label, expenses, earnings };
  });
};

/**
 * Get yearly spending data
 * @param {Array} transactions
 * @returns {Array}
 */
export const getYearlyData = (transactions) => {
  const years = {};

  transactions.forEach((t) => {
    const year = new Date(t.date).getFullYear();
    if (!years[year]) {
      years[year] = { label: String(year), expenses: 0, earnings: 0 };
    }
    if (t.type === 'expense') {
      years[year].expenses += t.amount;
    } else {
      years[year].earnings += t.amount;
    }
  });

  return Object.values(years).sort((a, b) => a.label - b.label);
};

/**
 * Get category-wise spending breakdown
 * @param {Array} transactions
 * @returns {Array<{ id: string, name: string, emoji: string, color: string, total: number, percentage: number }>}
 */
export const getCategoryBreakdown = (transactions) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = {};

  expenseTransactions.forEach((t) => {
    if (!categoryMap[t.category]) {
      const categoryInfo = DEFAULT_CATEGORIES.find((c) => c.id === t.category) || {
        id: t.category,
        name: t.category,
        emoji: '📌',
        color: '#64748b',
      };
      categoryMap[t.category] = {
        ...categoryInfo,
        total: 0,
        count: 0,
      };
    }
    categoryMap[t.category].total += t.amount;
    categoryMap[t.category].count += 1;
  });

  return Object.values(categoryMap)
    .map((cat) => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Get spending insights
 * @param {Array} transactions
 * @returns {object}
 */
export const getInsights = (transactions) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const earningTransactions = transactions.filter((t) => t.type === 'earning');

  // Highest spending category
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // Most expensive day
  const dailySpending = {};
  expenseTransactions.forEach((t) => {
    const dateKey = new Date(t.date).toISOString().split('T')[0];
    dailySpending[dateKey] = (dailySpending[dateKey] || 0) + t.amount;
  });

  let mostExpensiveDay = null;
  let maxDaySpend = 0;
  Object.entries(dailySpending).forEach(([date, amount]) => {
    if (amount > maxDaySpend) {
      maxDaySpend = amount;
      mostExpensiveDay = date;
    }
  });

  // Savings rate
  const totalEarnings = earningTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalEarnings > 0 ? ((totalEarnings - totalExpenses) / totalEarnings) * 100 : 0;

  // Average daily spending
  const uniqueDays = new Set(expenseTransactions.map((t) => new Date(t.date).toISOString().split('T')[0]));
  const avgDailySpending = uniqueDays.size > 0 ? totalExpenses / uniqueDays.size : 0;

  return {
    highestCategory,
    mostExpensiveDay: mostExpensiveDay ? { date: mostExpensiveDay, amount: maxDaySpend } : null,
    savingsRate: Math.max(0, savingsRate),
    totalTransactions: transactions.length,
    avgDailySpending,
    totalEarnings,
    totalExpenses,
  };
};
