import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { IoLockClosedOutline } from 'react-icons/io5';

export default function DashboardLayout() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.onboardingCompleted === false) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const handleQuickLogin = () => {
    login('sarah.c@cyberdyne.io');
  };

  // Auth Guard page representation
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center border border-border-primary bg-bg-secondary p-8 rounded-2xl shadow-premium"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50/15 dark:bg-blue-950/20 text-brand-blue mb-4">
              <IoLockClosedOutline size={28} />
            </div>
            <h2 className="text-xl font-bold font-heading text-text-primary">Protected Workspace</h2>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Please sign in to access your interview simulator, analytics, and resumes.
            </p>
            <button
              onClick={handleQuickLogin}
              className="mt-6 w-full rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-glow-blue cursor-pointer"
            >
              Sign In as Demo Recruiter
            </button>
            <p className="mt-4 text-xs text-text-secondary">
              No registration or passwords required for recruiter evaluation.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
