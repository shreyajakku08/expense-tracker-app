import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import PageTransition from '../components/layout/PageTransition';
import TransactionForm from '../components/dashboard/TransactionForm';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendLimitCard from '../components/dashboard/SpendLimitCard';
import MiniChart from '../components/dashboard/MiniChart';
import ExpenseCalendar from '../components/dashboard/ExpenseCalendar';
import TransactionList from '../components/dashboard/TransactionList';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { LOADING_MESSAGES } from '../utils/constants';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    // Simulated loading with rotating messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[msgIndex]);
    }, 600);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(msgInterval);
    }, 2000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(msgInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg transition-theme">
        <Header variant="dashboard" />
        <main className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 py-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 py-4 mb-2"
            >
              <svg className="w-5 h-5 animate-spin text-theme-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-theme-text-muted animate-pulse">{loadingMessage}</span>
            </motion.div>
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg transition-theme">
      <Header variant="dashboard" />

      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="dashboard-content">
          {/* Transaction form */}
          <TransactionForm />

          {/* Summary cards */}
          <SummaryCards />

          {/* Spend limit + Mini chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendLimitCard />
            <MiniChart />
          </div>

          {/* Calendar + Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseCalendar />
            <TransactionList />
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default HomePage;
