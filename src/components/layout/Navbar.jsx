import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSunnyOutline, IoMoonOutline, IoMenuOutline, IoCloseOutline,
  IoPersonCircleOutline, IoLogOutOutline, IoSettingsOutline,
} from 'react-icons/io5';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isApp = ['/dashboard', '/interview', '/resume', '/quiz', '/roadmap', '/settings', '/progress'].some(
    p => location.pathname.startsWith(p)
  );

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border-primary/70 bg-bg-secondary/85 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple text-white text-sm font-bold shadow-sm font-heading">
              I
            </div>
            <span className="font-heading font-bold text-base text-text-primary hidden sm:block">
              InterviewAI <span className="text-gradient">Pro</span>
            </span>
          </Link>

          {/* Desktop landing nav links */}
          {!isApp && (
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <IoSunnyOutline size={19} /> : <IoMoonOutline size={19} />}
            </button>

            {user ? (
              <>
                {/* User avatar + dropdown */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center gap-2 rounded-xl border border-border-primary bg-surface px-2.5 py-1.5 hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-text-primary max-w-[120px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-11 z-20 w-56 rounded-2xl border border-border-primary bg-bg-secondary shadow-lg py-2 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border-primary">
                            <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                            <p className="text-xs text-text-tertiary truncate mt-0.5">{user.email}</p>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            <Link
                              to="/settings"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                            >
                              <IoSettingsOutline size={16} /> Settings
                            </Link>
                            <Link
                              to="/settings"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                            >
                              <IoPersonCircleOutline size={16} /> Profile
                            </Link>
                          </div>
                          <div className="p-1.5 border-t border-border-primary">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                            >
                              <IoLogOutOutline size={16} /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-xl transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-text-primary text-bg-secondary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Get started free
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden rounded-xl p-2 text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <IoCloseOutline size={22} /> : <IoMenuOutline size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border-primary bg-bg-secondary"
          >
            <div className="px-4 py-4 space-y-1">
              {!isApp && navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-border-primary space-y-1">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-tertiary">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/settings" onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-surface-hover">Settings</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/5 cursor-pointer">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover">Sign in</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-center bg-text-primary text-bg-secondary mt-1">Get started free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
