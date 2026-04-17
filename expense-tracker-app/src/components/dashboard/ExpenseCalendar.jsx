import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useTransactions } from '../../context/TransactionContext';
import { getCalendarDays } from '../../utils/dateUtils';
import { getDailySpending } from '../../services/transactionService';
import { formatCurrency } from '../../utils/formatters';
import { WEEKDAYS, MONTHS } from '../../utils/constants';
import Card from '../ui/Card';

const ExpenseCalendar = () => {
  const { transactions } = useTransactions();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);

  const days = getCalendarDays(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calculate max spending for color intensity
  const daySpending = days.map((d) => ({
    ...d,
    spending: getDailySpending(transactions, d.date),
  }));

  const maxSpending = Math.max(...daySpending.map((d) => d.spending), 1);

  const getIntensity = (spending) => {
    if (spending === 0) return 0;
    return Math.max(0.15, spending / maxSpending);
  };

  return (
    <Card padding="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-theme-text">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevMonth}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-primary-light transition-colors"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-primary-light transition-colors"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-theme-text-muted py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daySpending.map((day, i) => {
          const intensity = getIntensity(day.spending);
          const isHovered = hoveredDay === i;

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-xs font-medium
                  transition-all duration-200 cursor-default relative
                  ${!day.isCurrentMonth ? 'text-theme-text-muted/30' : ''}
                  ${day.isToday ? 'ring-2 ring-theme-primary font-bold text-theme-primary' : ''}
                  ${day.isCurrentMonth && !day.isToday ? 'text-theme-text-secondary' : ''}
                `}
                style={{
                  backgroundColor: day.spending > 0 && day.isCurrentMonth
                    ? `rgba(var(--color-primary) / ${intensity})`
                    : 'transparent',
                  background: day.spending > 0 && day.isCurrentMonth
                    ? `rgba(254, 151, 185, ${intensity * 0.4})`
                    : day.isToday
                    ? 'var(--color-primary-light)'
                    : 'transparent',
                }}
              >
                {day.date.getDate()}
              </motion.div>

              {/* Tooltip */}
              {isHovered && day.spending > 0 && day.isCurrentMonth && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-1.5 rounded-lg bg-theme-card border border-theme-border shadow-theme-lg whitespace-nowrap"
                >
                  <p className="text-xs font-medium text-theme-text">
                    Spent {formatCurrency(day.spending)}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-theme-card rotate-45 border-r border-b border-theme-border" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-theme-border">
        <span className="text-xs text-theme-text-muted">Less</span>
        {[0.1, 0.25, 0.5, 0.75, 1].map((level) => (
          <div
            key={level}
            className="w-3 h-3 rounded-sm"
            style={{ background: `rgba(254, 151, 185, ${level * 0.4})` }}
          />
        ))}
        <span className="text-xs text-theme-text-muted">More</span>
      </div>
    </Card>
  );
};

export default ExpenseCalendar;
