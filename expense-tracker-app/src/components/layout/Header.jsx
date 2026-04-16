import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiChartBar, HiFolder, HiShare, HiMenu } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { exportDashboardAsPDF } from '../../services/pdfService';
import ThemeToggle from '../theme/ThemeToggle';
import Sidebar from './Sidebar';
import SyncIndicator from '../shared/SyncIndicator';
import logoUrl from '../../assets/logo.png';
import { Wallet } from 'lucide-react';

const Header = ({ variant = 'dashboard' }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handlePDFExport = async () => {
    setExporting(true);
    try {
      await exportDashboardAsPDF();
      toast.success('Dashboard exported as PDF! 📄');
    } catch (err) {
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const navIconClass = (path) => `
    p-2 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center
    ${isActive(path)
      ? 'bg-theme-primary text-white shadow-glow'
      : 'text-theme-text-secondary hover:text-white hover:bg-white/10'
    }
  `;

  if (variant === 'landing') {
    return (
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-theme-border bg-theme-card/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.LANDING} className="flex items-center">
            <Wallet className="w-5 h-5 text-theme-text-secondary hover:text-white transition-colors duration-200" strokeWidth={1.5} />
          </Link>

          {/* Nav icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ROUTES.LANDING)}
              className={navIconClass(ROUTES.LANDING)}
              title="Home"
            >
              <HiHome className="w-5 h-5" />
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate(ROUTES.ANALYTICS)}
                className={navIconClass(ROUTES.ANALYTICS)}
                title="Analytics"
              >
                <HiChartBar className="w-5 h-5" />
              </button>
            )}
            <ThemeToggle />
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-xl text-theme-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              title="About"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>
    );
  }

  // Dashboard variant
  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 border-b border-theme-border bg-theme-card/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-theme-text-secondary hover:text-theme-primary hover:bg-theme-primary-light transition-all duration-200"
            title="Menu"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          {/* Center: Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <img src={logoUrl} alt={`${APP_NAME} Logo`} className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out drop-shadow" />
            <span className="text-lg font-bold gradient-text hidden sm:inline group-hover:opacity-90 transition-opacity duration-300">{APP_NAME}</span>
          </Link>

          {/* Right: Nav icons + Sync */}
          <div className="flex items-center gap-1">
            <SyncIndicator />
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={navIconClass(ROUTES.HOME)}
              title="Home"
            >
              <HiHome className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(ROUTES.ANALYTICS)}
              className={navIconClass(ROUTES.ANALYTICS)}
              title="Analytics"
            >
              <HiChartBar className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(ROUTES.CATEGORIES)}
              className={navIconClass(ROUTES.CATEGORIES)}
              title="Categories"
            >
              <HiFolder className="w-5 h-5" />
            </button>
            <button
              onClick={handlePDFExport}
              disabled={exporting}
              className="p-2 rounded-xl text-theme-text-secondary hover:text-theme-primary hover:bg-theme-primary-light transition-all duration-200 disabled:opacity-50"
              title="Export as PDF"
            >
              {exporting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <HiShare className="w-5 h-5" />
              )}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
