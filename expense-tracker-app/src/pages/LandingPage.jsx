import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { validateLogin } from '../utils/validators';
import { ROUTES, APP_NAME, APP_DESCRIPTION } from '../utils/constants';
import Header from '../components/layout/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import { HiUser, HiLockClosed } from 'react-icons/hi';
import { Activity, Calendar, Tags, FileText, CheckCircle, MoreHorizontal } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { triggerSpotlight } = useTheme();
  const toast = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ userId: '', password: '', name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLogin(formData.userId, formData.password);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (!isLogin && (!formData.name || formData.name.trim() === '')) {
      setErrors({ name: 'Name is required' });
      return;
    }

    setLoading(true);

    // Simulate network delay for loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isLogin) {
      const result = login(formData.userId, formData.password);
      if (result.success) {
        toast.success('Welcome back! 👋');
        triggerSpotlight();
        navigate(ROUTES.HOME);
      } else {
        setErrors({ userId: result.error });
        toast.error(result.error);
      }
    } else {
      const result = register(formData.userId, formData.password, formData.name);
      if (result.success) {
        toast.success('Account created! Welcome to BudgetBuddy! 🎉');
        triggerSpotlight();
        navigate(ROUTES.HOME);
      } else {
        setErrors({ userId: result.error });
        toast.error(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] selection:bg-[#d0acfe]/30 font-['Inter'] transition-colors duration-500">
      <Header variant="landing" />

      <PageTransition>
        <main className="pt-20 md:pt-28 overflow-hidden transform-gpu">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 py-20 max-w-7xl mx-auto">
            {/* Background Glows */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-[#d0acfe]/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#fe97b9]/10 blur-[150px] rounded-full pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              {/* Left: Hero text */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, ease: "easeInOut", duration: 0.5 }}
                className="space-y-8 relative z-10 text-center lg:text-left max-w-xl mx-auto lg:mx-0"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, ease: "easeInOut", duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-premium ghost-border"
                >
                  <span className="w-2 h-2 rounded-full bg-[#fe97b9] animate-pulse"></span>
                  <span className="text-sm uppercase tracking-widest text-[#fe97b9] font-medium">The New Standard of Finance</span>
                </motion.div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Manrope'] font-extrabold tracking-tight leading-[1.1]">
                  Master Your Money. <br/><span className="bg-gradient-to-br from-[#d0acfe] via-[#b491e1] to-[#fe97b9] bg-clip-text text-transparent">Beautifully.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-[#aaabb0] leading-relaxed">
                  Precision tracking meets architectural design. Analyze spending habits, optimize savings, and visualize your wealth in a stunning, secure environment.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        document.querySelector('form input')?.focus();
                    }}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d0acfe] to-[#c29eef] text-[#472870] font-bold text-lg hover:shadow-lg hover:shadow-[#d0acfe]/30 transition-shadow duration-300 text-center will-change-transform transform-gpu"
                  >
                    Get Started Free
                  </motion.button>
                  <motion.a 
                    href="#about"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full glass-card-premium ghost-border font-semibold text-lg hover:bg-[#292c32]/50 transition-colors duration-300 flex items-center justify-center gap-2 will-change-transform transform-gpu"
                  >
                    Explore Features
                  </motion.a>
                </div>
              </motion.div>

              {/* Right: Login form */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="relative group w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
              >
                <div className="absolute inset-0 bg-[#d0acfe]/5 rounded-3xl blur-3xl transform group-hover:scale-105 transition-transform duration-500 pointer-events-none"></div>
                <div className="relative glass-card-premium ghost-border p-8 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">


                  <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl bg-gradient-to-br from-[#d0acfe] to-[#c29eef] shadow-[0_0_20px_rgba(208,172,254,0.3)]">
                      💰
                    </div>
                    <h2 className="text-2xl font-bold font-['Manrope'] text-[#f6f6fc]">
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-[#aaabb0] mt-1">
                      {isLogin ? 'Log in to your architectural dashboard' : 'Start your financial journey'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    {!isLogin && (
                      <div>
                         <label className="block text-xs font-medium text-[#aaabb0] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                         <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#aaabb0]">
                             <HiUser size={20} />
                           </div>
                           <input
                             name="name"
                             placeholder="Enter your name"
                             value={formData.name}
                             onChange={handleChange}
                             className={`w-full bg-[#111318]/80 text-[#f6f6fc] border ${errors.name ? 'border-[#ff6e84]' : 'border-[#46484d]'} rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#d0acfe] focus:ring-1 focus:ring-[#d0acfe] transition-all`}
                             required
                           />
                         </div>
                         {errors.name && <p className="mt-1 text-sm text-[#ff6e84] ml-1">{errors.name}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-[#aaabb0] uppercase tracking-wider mb-1.5 ml-1">User ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#aaabb0]">
                          <HiUser size={20} />
                        </div>
                        <input
                          name="userId"
                          placeholder="Enter your user ID"
                          value={formData.userId}
                          onChange={handleChange}
                          className={`w-full bg-[#111318]/80 text-[#f6f6fc] border ${errors.userId ? 'border-[#ff6e84]' : 'border-[#46484d]'} rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#d0acfe] focus:ring-1 focus:ring-[#d0acfe] transition-all`}
                          required
                        />
                      </div>
                      {errors.userId && <p className="mt-1 text-sm text-[#ff6e84] ml-1">{errors.userId}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#aaabb0] uppercase tracking-wider mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#aaabb0]">
                          <HiLockClosed size={20} />
                        </div>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full bg-[#111318]/80 text-[#f6f6fc] border ${errors.password ? 'border-[#ff6e84]' : 'border-[#46484d]'} rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#d0acfe] focus:ring-1 focus:ring-[#d0acfe] transition-all`}
                          required
                        />
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-[#ff6e84] ml-1">{errors.password}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-6 bg-gradient-to-r from-[#d0acfe] to-[#c29eef] text-[#472870] font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(208,172,254,0.4)] transition-shadow duration-300 disabled:opacity-70 flex justify-center items-center will-change-transform transform-gpu"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-[#472870] border-t-transparent rounded-full animate-spin"></div>
                      ) : isLogin ? 'Log In' : 'Create Account'}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center relative z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLogin(!isLogin);
                        setErrors({});
                      }}
                      className="text-sm text-[#aaabb0] hover:text-[#d0acfe] transition-colors"
                    >
                      {isLogin ? (
                        <>Don't have an account? <span className="font-semibold text-[#d0acfe]">Sign Up</span></>
                      ) : (
                        <>Already have an account? <span className="font-semibold text-[#d0acfe]">Log In</span></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <motion.section 
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="py-32 px-6 lg:px-12 bg-[#111318]/50 relative border-t border-[#23262c]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-['Manrope'] font-bold mb-6">Architectural Efficiency</h2>
                  <p className="text-[#aaabb0] text-lg leading-relaxed">Every feature is built with structural intent, providing you with the ultimate toolset for financial mastery.</p>
                </div>
                <div className="hidden md:block">
                  <span className="text-8xl font-['Manrope'] font-black text-[#1d2025] select-none tracking-tighter">FEATURES</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Activity className="w-6 h-6" />,
                    title: 'Smart Analytics',
                    desc: 'Deep-dive into spending patterns with neural-network powered forecasting and visual trends.',
                    color: 'from-[#d0acfe] to-[#c29eef]',
                    shadow: 'hover:shadow-[#d0acfe]/10'
                  },
                  {
                    icon: <Calendar className="w-6 h-6" />,
                    title: 'Interactive Calendar',
                    desc: 'Visualize your bill cycles and scheduled payments on an intuitive, architectural timeline.',
                    color: 'from-[#fe97b9] to-[#ee8aac]',
                    shadow: 'hover:shadow-[#fe97b9]/10'
                  },
                  {
                    icon: <Tags className="w-6 h-6" />,
                    title: 'Categorization',
                    desc: 'Automated transaction tagging with custom rule sets that adapt to your unique lifestyle.',
                    color: 'from-[#a0e0ff] to-[#72c6eb]',
                    shadow: 'hover:shadow-[#a0e0ff]/10'
                  },
                  {
                    icon: <FileText className="w-6 h-6" />,
                    title: 'PDF Reports',
                    desc: 'Generate beautiful, magazine-quality financial summaries for your tax professional or personal archive.',
                    color: 'from-[#d0acfe] to-[#b491e1]',
                    shadow: 'hover:shadow-[#b491e1]/10'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`group p-8 rounded-[2rem] glass-card-premium ghost-border hover:bg-[#1d2025] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-colors duration-300 cursor-default will-change-transform transform-gpu`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#23262c] flex items-center justify-center mb-8 relative overflow-hidden group-hover:scale-110 transition-transform duration-300 will-change-transform">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10 text-[#f6f6fc] group-hover:text-[#0c0e12] transition-colors duration-300">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-['Manrope'] font-bold tracking-tight mb-4">{feature.title}</h3>
                    <p className="text-[#aaabb0] leading-relaxed text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Analytics Mockup Section */}
          <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="order-2 lg:order-1 relative"
              >
                <div className="absolute inset-0 bg-[#a0e0ff]/5 rounded-3xl blur-3xl pointer-events-none"></div>
                <div className="relative p-8 rounded-[2.5rem] bg-[#1d2025] ghost-border shadow-2xl">
                  {/* Abstract Analytics Mockup */}
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="font-['Manrope'] font-bold text-xl tracking-tight">Spending Breakdown</h4>
                      <MoreHorizontal className="w-6 h-6 text-[#aaabb0]" />
                    </div>
                    
                    <div className="relative flex justify-center py-8">
                      <div className="w-64 h-64 rounded-full border-[16px] border-[#111318] flex items-center justify-center relative shadow-inner">
                        <div className="absolute inset-[-16px] rounded-full border-[16px] border-[#d0acfe] border-t-transparent border-l-transparent transform rotate-45 opacity-90"></div>
                        <div className="absolute inset-[-6px] rounded-full border-[10px] border-[#fe97b9] border-b-transparent border-r-transparent transform -rotate-12 opacity-80"></div>
                        <div className="text-center z-10">
                          <span className="block text-4xl font-['Manrope'] font-extrabold tracking-tight">$4,280</span>
                          <span className="text-xs text-[#aaabb0] uppercase tracking-widest font-medium mt-1 block">Total Spent</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-[#23262c] ghost-border hover:bg-[#292c32] transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs text-[#aaabb0] uppercase font-medium tracking-wider">Housing</span>
                          <span className="text-[#d0acfe] font-bold">45%</span>
                        </div>
                        <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '45%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="bg-gradient-to-r from-[#d0acfe] to-[#c29eef] h-full rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-2xl bg-[#23262c] ghost-border hover:bg-[#292c32] transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs text-[#aaabb0] uppercase font-medium tracking-wider">Lifestyle</span>
                          <span className="text-[#fe97b9] font-bold">30%</span>
                        </div>
                        <div className="w-full bg-[#111318] rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '30%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="bg-gradient-to-r from-[#fe97b9] to-[#ee8aac] h-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Overlay Decorative Element */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#a0e0ff]/10 blur-[80px] rounded-full pointer-events-none"></div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2 space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a0e0ff]/10 ghost-border">
                  <span className="text-sm uppercase tracking-widest text-[#a0e0ff] font-medium">Data Visualization</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Manrope'] font-bold leading-[1.1] tracking-tight">
                  Clarity in Every <br/><span className="bg-gradient-to-r from-[#a0e0ff] to-[#72c6eb] bg-clip-text text-transparent">Data Point.</span>
                </h2>
                <p className="text-[#aaabb0] text-lg leading-relaxed max-w-lg">
                  Stop guessing where your money goes. Our sophisticated analytics engine breaks down complex transactions into elegant, actionable visualizations. Discover trends you never knew existed.
                </p>
                <ul className="space-y-6 pt-4">
                  {[
                    'Dynamic filtering by date and merchant',
                    'Comparative monthly performance charts',
                    'AI-powered anomalous spending alerts'
                  ].map((text, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1), ease: "easeOut", duration: 0.5 }}
                      className="flex items-center gap-4 text-lg font-medium text-[#aaabb0] will-change-transform transform-gpu"
                    >
                      <CheckCircle className="w-6 h-6 text-[#81d4fa] shrink-0" />
                      <span className="text-[#f6f6fc] tracking-tight">{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto text-center relative overflow-hidden mb-20 rounded-[3rem] mt-12 ghost-border">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d0acfe]/10 to-[#fe97b9]/10"></div>
            <div className="absolute inset-0 bg-[#1d2025]/40 backdrop-blur-sm"></div>
            
            <div className="relative z-10 space-y-8 p-8 md:p-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Manrope'] font-extrabold tracking-tight">
                Ready to transform your<br/>financial life?
              </h2>
              <p className="text-xl text-[#aaabb0] max-w-2xl mx-auto leading-relaxed">
                Join thousands of high-performers who use BudgetBuddy to architect their financial future.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <button
                  onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      document.querySelector('form input')?.focus();
                  }}
                  className="px-10 py-5 rounded-full bg-[#f6f6fc] text-[#0c0e12] font-bold text-lg hover:bg-[#d0acfe] transition-colors shadow-xl active:scale-95"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  );
};

export default LandingPage;
