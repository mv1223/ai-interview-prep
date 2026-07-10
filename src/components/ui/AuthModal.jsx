import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IoCloseOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (authModalTab === 'signup' && !name) {
      setError('Please provide your name.');
      return;
    }

    if (authModalTab === 'login') {
      login(email, password);
    } else {
      signup(name, email, password);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-premium dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* Close button */}
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <IoCloseOutline size={22} />
          </button>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold font-heading tracking-tight text-slate-900 dark:text-white">
              InterviewAI <span className="text-gradient">Pro</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
              {authModalTab === 'login' ? 'Welcome back. Sign in to your account.' : 'Create your account to start preparing.'}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="mt-6 flex border-b border-slate-100 dark:border-neutral-800">
            <button
              onClick={() => { setAuthModalTab('login'); setError(''); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${authModalTab === 'login' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthModalTab('signup'); setError(''); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${authModalTab === 'signup' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {authModalTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="sarah.c@cyberdyne.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/70 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100"
            >
              {authModalTab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
            </button>
          </form>

          {/* Terms info */}
          <p className="mt-6 text-center text-xxs text-slate-400 dark:text-neutral-500">
            By continuing, you agree to InterviewAI Pro's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
