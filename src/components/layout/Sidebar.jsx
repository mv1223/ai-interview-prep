import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  IoGridOutline, 
  IoMicOutline, 
  IoDocumentTextOutline, 
  IoGitBranchOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoHelpCircleOutline
} from 'react-icons/io5';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: IoGridOutline },
    { to: '/interview', label: 'Mock Interview', icon: IoMicOutline },
    { to: '/quiz', label: 'Quiz Prep', icon: IoHelpCircleOutline },
    { to: '/resume', label: 'Resume Analyzer', icon: IoDocumentTextOutline },
    { to: '/roadmap', label: 'Skill Roadmap', icon: IoGitBranchOutline },
    { to: '/settings', label: 'Settings', icon: IoSettingsOutline },
  ];

  return (
    <aside 
      className={`relative hidden md:flex flex-col h-[calc(100vh-64px)] border-r border-border-primary bg-bg-secondary transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Navigation links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3.5 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-surface-hover text-brand-blue font-semibold' 
                    : 'text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3.5 px-3 py-3 rounded-lg text-sm font-medium transition-all text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer text-left"
        >
          {isDark ? <IoSunnyOutline size={20} className="shrink-0 text-amber-500" /> : <IoMoonOutline size={20} className="shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Night Mode'}</span>}
        </button>
      </nav>

      {/* Collapse button toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3.5 hidden sm:flex items-center justify-center h-7 w-7 rounded-full border border-border-primary bg-bg-secondary text-text-secondary hover:text-text-primary shadow-sm cursor-pointer"
      >
        {collapsed ? <IoChevronForwardOutline size={14} /> : <IoChevronBackOutline size={14} />}
      </button>

      {/* User profile section */}
      {user && (
        <div className="p-3 border-t border-border-primary/80 bg-bg-primary/50">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-lg p-2`}>
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover border border-border-primary shadow-sm shrink-0" 
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text-primary truncate leading-none">
                  {user.name}
                </h4>
                <p className="text-[10px] text-text-secondary truncate mt-0.5">
                  {user.role}
                </p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="rounded p-1 text-text-secondary hover:bg-surface-hover hover:text-red-500 shrink-0 transition-colors cursor-pointer"
                title="Log Out"
              >
                <IoLogOutOutline size={18} />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full justify-center rounded py-2 text-text-secondary hover:bg-surface-hover hover:text-red-500 cursor-pointer"
              title="Log Out"
            >
              <IoLogOutOutline size={18} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
