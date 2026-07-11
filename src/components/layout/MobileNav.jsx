import { NavLink } from 'react-router-dom';
import {
  IoGridOutline, IoMicOutline, IoDocumentTextOutline,
  IoHelpCircleOutline, IoBarChartOutline,
} from 'react-icons/io5';

const ITEMS = [
  { to: '/dashboard',  label: 'Home',      icon: IoGridOutline },
  { to: '/interview',  label: 'Interview', icon: IoMicOutline },
  { to: '/quiz',       label: 'Quiz',      icon: IoHelpCircleOutline },
  { to: '/resume',     label: 'Resume',    icon: IoDocumentTextOutline },
  { to: '/progress',   label: 'Progress',  icon: IoBarChartOutline },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border-primary bg-bg-secondary/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors duration-150 min-w-[56px]
                ${isActive ? 'text-brand-blue' : 'text-text-tertiary hover:text-text-secondary'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-blue/10' : ''}`}>
                    <Icon size={20} />
                  </span>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
