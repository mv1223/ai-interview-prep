import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  IoGridOutline, 
  IoMicOutline, 
  IoDocumentTextOutline, 
  IoGitBranchOutline, 
  IoSettingsOutline, 
  IoLogOutOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: IoGridOutline },
    { to: '/interview', label: 'Mock Interview', icon: IoMicOutline },
    { to: '/resume', label: 'Resume Analyzer', icon: IoDocumentTextOutline },
    { to: '/roadmap', label: 'Skill Roadmap', icon: IoGitBranchOutline },
    { to: '/settings', label: 'Settings', icon: IoSettingsOutline },
  ];

  return (
    <aside 
      className={`relative hidden md:flex flex-col h-[calc(100vh-64px)] border-r border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
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
                    ? 'bg-slate-100 text-brand-blue dark:bg-neutral-800 dark:text-brand-blue font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800/40 dark:hover:text-neutral-200'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3.5 hidden sm:flex items-center justify-center h-7 w-7 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        {collapsed ? <IoChevronForwardOutline size={14} /> : <IoChevronBackOutline size={14} />}
      </button>

      {/* User profile section */}
      {user && (
        <div className="p-3 border-t border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/50">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-lg p-2`}>
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-neutral-700 shadow-sm shrink-0" 
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-neutral-200 truncate leading-none">
                  {user.name}
                </h4>
                <p className="text-xxs text-slate-400 dark:text-neutral-500 truncate mt-0.5">
                  {user.role}
                </p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="rounded p-1 text-slate-400 hover:bg-slate-150 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-red-400 shrink-0 transition-colors"
                title="Log Out"
              >
                <IoLogOutOutline size={18} />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full justify-center rounded py-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-neutral-800/80"
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
