import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import Header from '../components/layout/Header';
import PageTransition from '../components/layout/PageTransition';
import Card from '../components/ui/Card';
import EmptyState from '../components/shared/EmptyState';
import { AnalyticsSkeleton } from '../components/ui/SkeletonLoader';
import useAnalytics from '../hooks/useAnalytics';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TIME_PERIODS, CHART_COLORS } from '../utils/constants';

const PERIOD_LABELS = {
  [TIME_PERIODS.DAILY]: 'Daily',
  [TIME_PERIODS.WEEKLY]: 'Weekly',
  [TIME_PERIODS.MONTHLY]: 'Monthly',
  [TIME_PERIODS.YEARLY]: 'Yearly',
};

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

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState(TIME_PERIODS.DAILY);
  const { transactions } = useTransactions();
  const { dailyData, weeklyData, monthlyData, yearlyData, categoryBreakdown, insights } = useAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg transition-theme">
        <Header variant="dashboard" />
        <main className="max-w-7xl mx-auto">
          <AnalyticsSkeleton />
        </main>
      </div>
    );
  }

  const getBarData = () => {
    switch (activePeriod) {
      case TIME_PERIODS.DAILY: return dailyData;
      case TIME_PERIODS.WEEKLY: return weeklyData;
      case TIME_PERIODS.MONTHLY: return monthlyData;
      case TIME_PERIODS.YEARLY: return yearlyData;
      default: return dailyData;
    }
  };

  const barData = getBarData();
  const hasData = transactions.length > 0;

  return (
    <div className="min-h-screen bg-theme-bg transition-theme">
      <Header variant="dashboard" />

      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-theme-text">Analytics</h1>
              <p className="text-sm text-theme-text-muted">Visualize your financial patterns</p>
            </div>
          </div>

          {!hasData ? (
            <Card hover={false}>
              <EmptyState
                icon="📊"
                title="No analytics data"
                description="Start adding transactions to see your spending insights and charts."
              />
            </Card>
          ) : (
            <>
              {/* Period tabs */}
              <div className="flex gap-2">
                {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActivePeriod(key)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${activePeriod === key
                        ? 'text-white shadow-lg'
                        : 'text-theme-text-secondary hover:bg-theme-primary-light hover:text-theme-primary'
                      }
                    `}
                    style={activePeriod === key ? { background: 'var(--gradient-primary)' } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card>
                  <h3 className="text-sm font-semibold text-theme-text mb-4">
                    Spending Trends ({PERIOD_LABELS[activePeriod]})
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barGap={4}>
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
                          width={50}
                          tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-primary-light)', opacity: 0.3 }} />
                        <Bar dataKey="earnings" name="Earnings" fill="#34d399" radius={[6, 6, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="expenses" name="Expenses" fill="#fe97b9" radius={[6, 6, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Pie Chart */}
                <Card>
                  <h3 className="text-sm font-semibold text-theme-text mb-4">Category Distribution</h3>
                  {categoryBreakdown.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="total"
                            nameKey="name"
                            labelLine={false}
                            label={CustomPieLabel}
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={entry.id} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.[0]) return null;
                              const data = payload[0].payload;
                              return (
                                <div className="bg-theme-card border border-theme-border rounded-xl px-4 py-3 shadow-theme-lg">
                                  <p className="text-sm font-semibold text-theme-text">{data.emoji} {data.name}</p>
                                  <p className="text-xs text-theme-text-muted">{formatCurrency(data.total)} ({data.percentage.toFixed(1)}%)</p>
                                </div>
                              );
                            }}
                          />
                          <Legend
                            formatter={(value) => <span className="text-xs text-theme-text-secondary">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-72 flex items-center justify-center text-theme-text-muted text-sm">
                      No expense data to show
                    </div>
                  )}
                </Card>
              </div>

              {/* Insights */}
              <Card>
                <h3 className="text-sm font-semibold text-theme-text mb-4">💡 Insights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-theme-bg-secondary">
                    <p className="text-xs text-theme-text-muted mb-1">Highest Spending</p>
                    <p className="text-lg font-bold text-theme-text">
                      {insights.highestCategory
                        ? `${insights.highestCategory.emoji} ${insights.highestCategory.name}`
                        : '—'}
                    </p>
                    {insights.highestCategory && (
                      <p className="text-xs text-theme-text-muted">{formatCurrency(insights.highestCategory.total)}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-theme-bg-secondary">
                    <p className="text-xs text-theme-text-muted mb-1">Most Expensive Day</p>
                    <p className="text-lg font-bold text-theme-text">
                      {insights.mostExpensiveDay
                        ? formatDate(insights.mostExpensiveDay.date, 'short')
                        : '—'}
                    </p>
                    {insights.mostExpensiveDay && (
                      <p className="text-xs text-theme-text-muted">{formatCurrency(insights.mostExpensiveDay.amount)}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-theme-bg-secondary">
                    <p className="text-xs text-theme-text-muted mb-1">Savings Rate</p>
                    <p className={`text-lg font-bold ${insights.savingsRate >= 0 ? 'text-[#34d399]' : 'text-[#ff6e84]'}`}>
                      {insights.savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-theme-text-muted">of earnings saved</p>
                  </div>

                  <div className="p-4 rounded-xl bg-theme-bg-secondary">
                    <p className="text-xs text-theme-text-muted mb-1">Avg Daily Spending</p>
                    <p className="text-lg font-bold text-theme-text">
                      {formatCurrency(insights.avgDailySpending)}
                    </p>
                    <p className="text-xs text-theme-text-muted">{insights.totalTransactions} transactions</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </main>
      </PageTransition>
    </div>
  );
};

export default AnalyticsPage;
