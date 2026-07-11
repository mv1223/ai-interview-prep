import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoGridOutline, IoMicOutline, IoDocumentTextOutline,
  IoGitBranchOutline, IoSettingsOutline, IoLogOutOutline,
  IoChevronBackOutline, IoChevronForwardOutline,
  IoSunnyOutline, IoMoonOutline, IoHelpCircleOutline,
  IoBarChartOutline,
} from 'react-icons/io5';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',       icon: IoGridOutline },
  { to: '/interview',  label: 'Mock Interview',   icon: IoMicOutline },
  { to: '/quiz',       label: 'Quiz Prep',        icon: IoHelpCircleOutline },
  { to: '/resume',     label: 'Resume Analyzer',  icon: IoDocumentTextOutline },
  { to: '/progress',   label: 'Progress',         icon: IoBarChartOutline },
  { to: '/roadmap',    label: 'Roadmap',          icon: IoGitBranchOutline },
  { to: '/settings',   label: 'Settings',         icon: IoSettingsOutline },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-border-primary bg-bg-secondary transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-[72px]' : 'w-60'}`}
      style={{ height: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3.5 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border-primary bg-bg-secondary text-text-tertiary hover:text-text-primary shadow-sm cursor-pointer transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <IoChevronForwardOutline size={13} /> : <IoChevronBackOutline size={13} />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-5 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
                ${isActive
                  ? 'bg-surface-hover text-brand-blue font-semibold'
                  : 'text-text-secondary hover:bg-surface-hover/70 hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-brand-blue" />
                  )}
                  <Icon size={19} className="shrink-0" />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <span className="absolute left-[72px] px-2.5 py-1.5 rounded-lg bg-text-primary text-bg-secondary text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-hover/70 hover:text-text-primary transition-all duration-150 cursor-pointer relative group`}
        >
          {isDark
            ? <IoSunnyOutline size={19} className="shrink-0 text-amber-400" />
            : <IoMoonOutline size={19} className="shrink-0" />
          }
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {isDark ? 'Light mode' : 'Dark mode'}
              </motion.span>
            )}
          </AnimatePresence>
          {collapsed && (
            <span className="absolute left-[72px] px-2.5 py-1.5 rounded-lg bg-text-primary text-bg-secondary text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
              {isDark ? 'Light mode' : 'Dark mode'}
            </span>
          )}
        </button>
      </nav>

      {/* User section */}
      {user && (
        <div className="border-t border-border-primary p-2.5">
          <div className={`flex items-center gap-2.5 rounded-xl p-2 ${collapsed ? 'justify-center' : ''}`}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover border border-border-primary shrink-0"
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-text-primary truncate leading-none">{user.name}</p>
                  <p className="text-xs text-text-tertiary truncate mt-0.5">{user.role || 'Candidate'}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer shrink-0"
                title="Sign out"
              >
                <IoLogOutOutline size={16} />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              className="mt-1 w-full flex justify-center p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer"
              title="Sign out"
            >
              <IoLogOutOutline size={16} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
