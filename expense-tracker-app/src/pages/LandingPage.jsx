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
    <div className="min-h-screen bg-theme-bg transition-theme">
      <Header variant="landing" />

      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Hero section */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-8 lg:py-16">
            {/* Left: Hero text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-primary-light text-theme-primary text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                Smart Finance Tracking
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-theme-text mb-6 leading-tight">
                Take Control of{' '}
                <span className="gradient-text">Your Finances</span>
              </h1>

              <p className="text-lg text-theme-text-secondary mb-8 max-w-lg mx-auto lg:mx-0">
                {APP_DESCRIPTION}
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {['📊 Analytics', '🎨 Themes', '📅 Calendar', '📤 PDF Export'].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 rounded-lg bg-theme-card border border-theme-border text-sm text-theme-text-secondary"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: Login form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                    style={{ background: 'var(--gradient-primary)' }}>
                    💰
                  </div>
                  <h2 className="text-2xl font-bold text-theme-text">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-sm text-theme-text-muted mt-1">
                    {isLogin ? 'Log in to your account' : 'Start your financial journey'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                      icon={<HiUser />}
                    />
                  )}

                  <Input
                    label="User ID"
                    name="userId"
                    placeholder="Enter your user ID"
                    value={formData.userId}
                    onChange={handleChange}
                    error={errors.userId}
                    required
                    icon={<HiUser />}
                  />

                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    icon={<HiLockClosed />}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    size="lg"
                    className="mt-6"
                  >
                    {isLogin ? 'Log In' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-sm text-theme-text-muted hover:text-theme-primary transition-colors"
                  >
                    {isLogin ? (
                      <>Don't have an account? <span className="font-semibold text-theme-primary">Sign Up</span></>
                    ) : (
                      <>Already have an account? <span className="font-semibold text-theme-primary">Log In</span></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* About section */}
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-16 lg:py-24 border-t border-theme-border mt-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-theme-text mb-4">
                Why <span className="gradient-text">{APP_NAME}</span>?
              </h2>
              <p className="text-theme-text-secondary max-w-2xl mx-auto">
                Built for students and young professionals who want to master their money without the complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '📊',
                  title: 'Smart Analytics',
                  desc: 'Daily, weekly, monthly, and yearly insights with beautiful charts.',
                },
                {
                  icon: '🎨',
                  title: 'Personalized Themes',
                  desc: 'Dark mode and 4 pastel themes to match your vibe.',
                },
                {
                  icon: '📅',
                  title: 'Interactive Calendar',
                  desc: 'Hover over any date to see your spending at a glance.',
                },
                {
                  icon: '📤',
                  title: 'PDF Reports',
                  desc: 'Export your dashboard as a professional PDF report.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 text-center hover:shadow-theme-lg transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-theme-text mb-2">{item.title}</h3>
                  <p className="text-sm text-theme-text-muted">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      </PageTransition>
    </div>
  );
};

export default LandingPage;
