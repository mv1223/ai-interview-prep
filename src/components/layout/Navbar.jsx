import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { IoSunnyOutline, IoMoonOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

export default function Navbar() {
  const { user, logout, setAuthModalOpen, setAuthModalTab } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/interview') || 
                      location.pathname.startsWith('/resume') || 
                      location.pathname.startsWith('/roadmap') || 
                      location.pathname.startsWith('/settings');

  const handleAuthAction = (tab) => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border-primary/80 bg-bg-secondary/80 backdrop-blur-md text-text-primary transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-premium">
                I
              </span>
              <span>InterviewAI <span className="text-gradient">Pro</span></span>
            </Link>
          </div>

          {/* Desktop Nav links */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
              <a href="#features" className="hover:text-brand-blue transition-colors">Features</a>
              <a href="#demo" className="hover:text-brand-blue transition-colors">Interactive Demo</a>
              <a href="#pricing" className="hover:text-brand-blue transition-colors">Pricing</a>
            </div>
          )}

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-text-primary px-4 py-2 text-sm font-semibold text-bg-secondary hover:opacity-90 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAuthAction('login')}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover/80 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthAction('signup')}
                  className="rounded-lg bg-text-primary px-4 py-2 text-sm font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-text-secondary hover:bg-surface-hover transition-colors"
            >
              {isDark ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover transition-colors"
            >
              {mobileMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-primary bg-bg-secondary px-4 py-4 space-y-3">
          {!isDashboard && (
            <>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Features
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Interactive Demo
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Pricing
              </a>
            </>
          )}

          <div className="pt-2 border-t border-border-primary/80">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-lg bg-text-primary py-2.5 text-sm font-semibold text-bg-secondary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="w-full text-center rounded-lg border border-border-primary py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleAuthAction('login')}
                  className="w-full text-center rounded-lg border border-border-primary py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthAction('signup')}
                  className="w-full text-center rounded-lg bg-text-primary py-2.5 text-sm font-semibold text-bg-secondary"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
