import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  IoMicOutline, 
  IoArrowForwardOutline,
  IoCalendarOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoSparklesOutline,
  IoDocumentTextOutline,
  IoGitBranchOutline,
  IoCheckmarkCircleSharp,
  IoCloseOutline,
  IoPlayOutline,
  IoBarChartOutline
} from 'react-icons/io5';

export default function Dashboard() {
  const { user } = useAuth();
  const { interviews, startNewInterview } = useInterview();
  const { atsScore } = useResume();
  const navigate = useNavigate();

  // Simulated Skeleton Loading
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Notifications dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI Recruiter compiled Google Mock feedback.", time: "10 mins ago", read: false },
    { id: 2, text: "ATS Resume optimization fit updated to 74%.", time: "2 hours ago", read: false },
    { id: 3, text: "New roadmap topic unlocked: Concurrency.", time: "1 day ago", read: true }
  ]);

  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const mockQuickLinks = [
    { title: "React 19 Concurrency Checklist", path: "/roadmap" },
    { title: "Stripe API Prep Mock Interview", path: "/interview" },
    { title: "ATS Optimization Suggestion: Vercel CV", path: "/resume" }
  ];

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Recharts Radar Skill Aggregation
  const latestScores = interviews.length > 0 ? interviews[0].scores : {
    overall: 80,
    communication: 80,
    technical: 80,
    problemSolving: 80,
    behavioral: 80
  };

  const radarData = [
    { subject: 'Communication', score: latestScores.communication },
    { subject: 'Technical accuracy', score: latestScores.technical },
    { subject: 'Problem Solving', score: latestScores.problemSolving },
    { subject: 'Behavioral Fit', score: latestScores.behavioral },
    { subject: 'Overall Score', score: latestScores.overall },
  ];

  // Recharts Line History Aggregation
  const lineData = [...interviews]
    .reverse()
    .map(item => ({
      name: item.company,
      score: item.scores.overall,
      date: item.date
    }));

  const handleQuickAction = (action) => {
    if (action === 'google') {
      startNewInterview({ role: 'Frontend Engineer', company: 'Google', difficulty: 'Hard' });
      navigate('/interview');
    } else if (action === 'resume') {
      navigate('/resume');
    } else if (action === 'roadmap') {
      navigate('/roadmap');
    }
  };

  // SKELETON LOADER COMPONENT LAYOUT
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-neutral-800 rounded-lg" />
          </div>
          <div className="h-10 w-44 bg-slate-200 dark:bg-neutral-800 rounded-lg" />
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80 p-5 space-y-3">
              <div className="h-4 w-28 bg-slate-200 dark:bg-neutral-800 rounded" />
              <div className="h-8 w-20 bg-slate-200 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80 p-5" />
          ))}
        </div>

        {/* History Grid Skeleton */}
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80 p-5" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. TOP NAV / SEARCH / NOTIFICATIONS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/50 dark:border-neutral-800/50 pb-6 shrink-0">
        
        {/* User Greet */}
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
            Welcome Back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Your personal preparation analytics workspace. Calibration status: **Active**.
          </p>
        </div>

        {/* Interactive Search & Actions Row */}
        <div className="flex items-center gap-4">
          
          {/* Quick Search Input */}
          <div className="relative">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus-within:border-brand-blue dark:border-neutral-800 dark:bg-neutral-950">
              <IoSearchOutline className="text-slate-400 mr-2" size={16} />
              <input
                type="text"
                placeholder="Quick Search (Cmd+K)"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-slate-700 dark:text-slate-200 w-44"
              />
            </div>
            {/* Search Results Drawer */}
            {showSearchResults && (
              <div className="absolute right-0 top-11 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-premium z-30 dark:border-neutral-800 dark:bg-neutral-900 text-xxs space-y-1">
                <span className="block text-slate-400 font-bold uppercase tracking-wider mb-2 px-1">PREP RESOURCES</span>
                {mockQuickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="block p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-semibold"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-slate-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-450 dark:hover:text-white relative"
            >
              <IoNotificationsOutline size={18} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-white dark:border-neutral-950 animate-pulse" />
              )}
            </button>
            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white shadow-premium z-30 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-850 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wide">Notifications</span>
                  <button onClick={handleMarkAllRead} className="text-[10px] font-semibold text-brand-blue hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-neutral-850 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xxs text-slate-400">No new alerts.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 flex gap-3 text-xxs transition-colors hover:bg-slate-50 dark:hover:bg-neutral-850/45 ${!n.read ? 'bg-blue-50/10' : ''}`}>
                        <div className="flex-1">
                          <p className={`font-semibold text-slate-800 dark:text-slate-250 ${!n.read ? 'text-brand-blue' : ''}`}>{n.text}</p>
                          <span className="block text-[9px] text-slate-400 mt-1">{n.time}</span>
                        </div>
                        <button onClick={() => handleClearNotification(n.id)} className="text-slate-400 hover:text-slate-600 shrink-0">
                          <IoCloseOutline size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. OVERVIEW METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Average Mock Score', value: `${latestScores.overall}%`, icon: IoBarChartOutline, color: 'text-brand-blue' },
          { label: 'Resume ATS Score', value: `${atsScore}%`, icon: IoDocumentTextOutline, color: 'text-brand-purple' },
          { label: 'Completed Sessions', value: `${interviews.length} Runs`, icon: IoMicOutline, color: 'text-brand-pink' },
          { label: 'Roadmap Mastery', value: '40%', icon: IoGitBranchOutline, color: 'text-orange-500' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wide">{card.label}</span>
                <span className="block text-2xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">{card.value}</span>
              </div>
              <div className={`h-10 w-10 rounded-lg bg-slate-50 dark:bg-neutral-950 flex items-center justify-center shrink-0 border border-slate-100 dark:border-neutral-850 ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CHARTS GRID MODULES */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Radar Competency Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-4">
            Skill Mastery Metrics
          </h3>
          <div className="h-64 flex items-center justify-center">
            {interviews.length === 0 ? (
              <p className="text-xs text-slate-400">Compile a mock interview report to render radar charts.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" className="dark:stroke-neutral-800" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 550 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <Radar
                    name={user?.name}
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Progression Line Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-4">
            Recruiter Session Score Progression
          </h3>
          <div className="h-64 flex items-center justify-center">
            {interviews.length === 0 ? (
              <p className="text-xs text-slate-400">Score analytics build dynamically upon session submissions.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 4. DETAILS ROW: UPCOMING GOALS & ACTION ENGINE */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 2/3: Recent Prep History & Goals */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent History Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                Recent Mock History
              </h3>
              <span className="text-xxs text-slate-400 dark:text-neutral-500">{interviews.length} Runs Completed</span>
            </div>
            
            {interviews.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-400 dark:text-neutral-550">No prep mock trials completed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-neutral-950 text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-neutral-500 border-b border-slate-200 dark:border-neutral-800">
                      <th className="px-6 py-3.5">Recruiter Company</th>
                      <th className="px-6 py-3.5">Difficulty</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Diagnostic Score</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs">
                    {interviews.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-850/10 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{item.company}</span>
                          <span className="text-[10px] text-slate-400 dark:text-neutral-500 block mt-0.5">{item.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            item.difficulty === 'Hard' 
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' 
                              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-neutral-450">
                          <div className="flex items-center gap-1.5">
                            <IoCalendarOutline />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">
                          <span className={item.scores.overall >= 88 ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-blue dark:text-blue-400'}>
                            {item.scores.overall}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate('/interview')} className="text-xxs font-bold text-brand-blue hover:underline">
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming Placement Goals Scheduler */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-4">
              Upcoming Placement Schedule
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Stripe API Tech Screen", date: "July 12, 2026", details: "Mock compiler checklist focus.", active: true },
                { title: "Google L4 Web Performance", date: "July 16, 2026", details: "STAR behavioral metrics focus.", active: false }
              ].map((goal, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-neutral-850 dark:bg-neutral-950/20 flex gap-3 text-xs">
                  <div className="h-8 w-8 rounded bg-white dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-850 text-brand-blue flex items-center justify-center shrink-0">
                    <IoCalendarOutline size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-neutral-250 block">{goal.title}</span>
                    <span className="text-[10px] text-slate-450 dark:text-neutral-500 block mt-0.5">{goal.date}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{goal.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1/3: Quick Actions, AI Recommendations & Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Portal */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
              Quick Actions Workspace
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickAction('google')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-350 dark:border-neutral-800 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/60 dark:hover:border-neutral-750 transition-colors text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <IoPlayOutline className="text-brand-blue" size={16} />
                  <span className="font-semibold text-slate-800 dark:text-neutral-350">Launch Google mock session</span>
                </div>
                <IoArrowForwardOutline className="text-slate-400" />
              </button>
              
              <button 
                onClick={() => handleQuickAction('resume')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-350 dark:border-neutral-800 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/60 dark:hover:border-neutral-750 transition-colors text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <IoDocumentTextOutline className="text-brand-purple" size={16} />
                  <span className="font-semibold text-slate-800 dark:text-neutral-350">Analyze ATS CV Fit</span>
                </div>
                <IoArrowForwardOutline className="text-slate-400" />
              </button>

              <button 
                onClick={() => handleQuickAction('roadmap')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-350 dark:border-neutral-800 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/60 dark:hover:border-neutral-750 transition-colors text-xs text-left"
              >
                <div className="flex items-center gap-2.5">
                  <IoGitBranchOutline className="text-orange-500" size={16} />
                  <span className="font-semibold text-slate-800 dark:text-neutral-350">Review Roadmap competency</span>
                </div>
                <IoArrowForwardOutline className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* AI Coach Action Recommendation Panel */}
          <div className="rounded-2xl border border-blue-200/50 bg-blue-50/15 p-6 dark:border-blue-900/20 dark:bg-blue-950/10 space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1.5">
              <IoSparklesOutline className="text-brand-purple" /> AI Coach Guidelines
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
              {[
                "Merge Vitest keyword suggestions into your Vercel experience card.",
                "Review useEffect timeouts cleanup structures to clear roadmaps.",
                "Maintain STAR methodology pacing under 130 words per minute."
              ].map((rec, i) => (
                <div key={i} className="flex gap-2">
                  <IoCheckmarkCircleSharp className="text-brand-blue shrink-0 mt-0.5" size={14} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Stream Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
              Recent Prep Activity
            </h3>
            <div className="space-y-4 text-xxs relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 dark:before:bg-neutral-800">
              {[
                { title: "Completed Mock Google L4", date: "2026-07-09", icon: "int" },
                { title: "Applied Vitest ATS optimization card", date: "2026-07-08", icon: "res" },
                { title: "Unlocked Roadmap Node: Concurrency", date: "2026-07-07", icon: "path" }
              ].map((act, i) => (
                <div key={i} className="relative space-y-0.5">
                  <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-slate-350 dark:bg-neutral-700 border border-white dark:border-neutral-900" />
                  <span className="block font-semibold text-slate-800 dark:text-neutral-350">{act.title}</span>
                  <span className="block text-slate-400 dark:text-neutral-500">{act.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
