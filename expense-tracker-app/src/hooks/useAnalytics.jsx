import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import * as analyticsService from '../services/analyticsService';

/**
 * Custom hook for analytics data
 * Transforms raw transactions into chart-ready datasets
 */
const useAnalytics = () => {
  const { transactions } = useTransactions();

  const dailyData = useMemo(
    () => analyticsService.getDailyData(transactions, 7),
    [transactions]
  );

  const weeklyData = useMemo(
    () => analyticsService.getWeeklyData(transactions, 4),
    [transactions]
  );

  const monthlyData = useMemo(
    () => analyticsService.getMonthlyData(transactions, 6),
    [transactions]
  );

  const yearlyData = useMemo(
    () => analyticsService.getYearlyData(transactions),
    [transactions]
  );

  const categoryBreakdown = useMemo(
    () => analyticsService.getCategoryBreakdown(transactions),
    [transactions]
  );

  const insights = useMemo(
    () => analyticsService.getInsights(transactions),
    [transactions]
  );

  return {
    dailyData,
    weeklyData,
    monthlyData,
    yearlyData,
    categoryBreakdown,
    insights,
  };
};

export default useAnalytics;
