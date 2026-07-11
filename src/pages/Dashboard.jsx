import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import EmptyState from '../components/ui/EmptyState';
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
  IoSearchOutline,
  IoNotificationsOutline,
  IoSparklesOutline,
  IoDocumentTextOutline,
  IoGitBranchOutline,
  IoCheckmarkCircleSharp,
  IoPlayOutline,
  IoBarChartOutline,
  IoRibbonOutline,
  IoLockClosedOutline,
  IoFlameOutline,
  IoHelpCircleOutline,
  IoRefreshOutline,
  IoTrendingUpOutline
} from 'react-icons/io5';

export default function Dashboard() {
  const { user } = useAuth();
  const { interviews, quizzes, loadDemoData, clearAllData } = useInterview();
  const { atsScore, fileName, loadDemoResume, resetResume } = useResume();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [clearedNotifs, setClearedNotifs] = useState([]);

  // Compute notifications dynamically during render to avoid setState in effects
  const notifications = [];
  if (fileName && !clearedNotifs.includes(1)) {
    notifications.push({ id: 1, text: `Resume calibrated successfully! ATS Score: ${atsScore}%`, time: 'Just now' });
  }
  if (interviews.length > 0 && !clearedNotifs.includes(2)) {
    notifications.push({ id: 2, text: `Mock simulation compiled: ${interviews[0].company} - ${interviews[0].role}`, time: '1 hr ago' });
  }
  if (quizzes.length > 0 && !clearedNotifs.includes(3)) {
    notifications.push({ id: 3, text: `Completed Quiz: Score: ${quizzes[0].score}%`, time: '2 hrs ago' });
  }

  // Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Today's practice goals checklist synchronized to real state
  const goals = [
    { id: 1, text: 'Record first mock interview', completed: interviews.length > 0, path: '/interview' },
    { id: 2, text: 'Upload CV to ATS sandbox', completed: !!fileName, path: '/resume' },
    { id: 3, text: 'Complete React 19 concurrent quiz', completed: quizzes.length > 0, path: '/quiz' }
  ];

  // Demo Seeder actions
  const handleLoadDemo = () => {
    loadDemoData();
    loadDemoResume();
    setClearedNotifs([]);
  };

  const handleResetData = () => {
    clearAllData();
    resetResume();
    setClearedNotifs([]);
  };

  // Recharts calculations
  const avgInterviewScore = interviews.length > 0 
    ? Math.floor(interviews.reduce((acc, curr) => acc + curr.scores.overall, 0) / interviews.length) 
    : 0;

  const avgCodingScore = interviews.length > 0
    ? Math.floor(interviews.reduce((acc, curr) => acc + curr.scores.technical, 0) / interviews.length)
    : quizzes.length > 0 
      ? Math.floor(quizzes.reduce((acc, curr) => acc + curr.score, 0) / quizzes.length)
      : 0;

  const avgQuizScore = quizzes.length > 0
    ? Math.floor(quizzes.reduce((acc, curr) => acc + curr.score, 0) / quizzes.length)
    : 0;

  const overallPlacementProgress = Math.min(
    Math.floor(
      ((interviews.length > 0 ? 1 : 0) * 40) + 
      ((quizzes.length > 0 ? 1 : 0) * 30) + 
      ((fileName ? 1 : 0) * 30)
    ), 100
  );

  const streakDays = interviews.length > 0 || quizzes.length > 0 ? 2 : 0;

  const radarData = [
    { subject: 'Communication', score: interviews.length > 0 ? interviews[0].scores.communication : 0 },
    { subject: 'Technical', score: interviews.length > 0 ? interviews[0].scores.technical : 0 },
    { subject: 'Problem Solving', score: interviews.length > 0 ? interviews[0].scores.problemSolving : 0 },
    { subject: 'Behavioral', score: interviews.length > 0 ? interviews[0].scores.behavioral : 0 },
    { subject: 'Quiz Score', score: avgQuizScore },
  ];

  const lineData = [...interviews]
    .reverse()
    .map(item => ({
      name: item.company,
      score: item.scores.overall,
      date: item.date
    }));

  // Achievements
  const achievements = [
    { id: 'ach-1', title: 'React Explorer', current: interviews.length, target: 10, desc: 'Complete 10 mock interviews.', icon: IoMicOutline },
    { id: 'ach-2', title: 'Frontend Master', current: quizzes.length, target: 20, desc: 'Complete 20 challenge quizzes.', icon: IoHelpCircleOutline },
    { id: 'ach-3', title: 'Consistency Champion', current: streakDays, target: 5, desc: 'Maintain a 5-day practice streak.', icon: IoFlameOutline }
  ];

  // Leaderboard data
  const leaderboardCandidates = [
    { name: 'Sarah Connor', score: 98, role: 'Vercel Candidate' },
    { name: 'Alex Rivers', score: 92, role: 'Stripe Candidate' },
    { name: 'Devon May', score: 88, role: 'Google Candidate' },
    { name: 'You', score: avgQuizScore || 0, role: `${user?.careerGoal || 'Frontend'} Prep` }
  ].sort((a, b) => b.score - a.score);

  // Quick Links
  const mockQuickLinks = [
    { title: "React 19 Concurrency Quiz", path: "/quiz" },
    { title: "Standard Tech Mock Interview", path: "/interview" },
    { title: "ATS Optimization Sandbox", path: "/resume" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-border-primary rounded-lg" />
            <div className="h-4 w-96 bg-border-primary rounded-lg" />
          </div>
          <div className="h-10 w-44 bg-border-primary rounded-lg" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-bg-secondary border border-border-primary p-5 space-y-3" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-bg-secondary border border-border-primary p-5" />
          ))}
        </div>
      </div>
    );
  }

  // Adaptive chart strokes
  const chartStroke = isDark ? '#27272a' : '#e2e8f0';
  const textStroke = isDark ? '#a1a1aa' : '#64748b';

  return (
    <div className="space-y-8 pb-12 text-text-primary transition-colors duration-300">
      
      {/* 0. RECRUITER DEV CONTROLLER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-50/5 dark:bg-blue-950/10 dark:border-blue-900/30 text-xxs font-semibold">
        <div className="flex items-center gap-2 text-brand-blue">
          <IoSparklesOutline className="animate-spin-slow text-sm" />
          <span>RECRUITER EVALUATION PANEL: Switch between a completely clean new account and seeded demo workspace.</span>
        </div>
        <div className="flex gap-2">
          {interviews.length === 0 && quizzes.length === 0 && !fileName ? (
            <button
              onClick={handleLoadDemo}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue text-white hover:bg-blue-600 transition-all cursor-pointer"
            >
              <IoRefreshOutline /> Seed Evaluation Data
            </button>
          ) : (
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-primary bg-bg-secondary text-text-secondary hover:text-red-500 transition-all cursor-pointer"
            >
              <IoRefreshOutline /> Reset to Fresh Slate
            </button>
          )}
        </div>
      </div>

      {/* 1. TOP NAV HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-primary pb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight leading-tight text-text-primary">
            Welcome, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Path: <strong className="text-brand-blue">{user?.careerGoal || 'Frontend'} Candidate</strong> // Placement Progress: <strong className="text-brand-purple">{overallPlacementProgress}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <div className="relative">
            <div className="flex items-center rounded-xl border border-border-primary bg-bg-secondary px-3.5 py-2 text-xs outline-none focus-within:border-brand-blue">
              <IoSearchOutline className="text-text-secondary mr-2" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-text-primary w-44"
              />
            </div>
            {showSearchResults && (
              <div className="absolute right-0 top-11 w-64 rounded-xl border border-border-primary bg-bg-secondary p-3 shadow-premium z-30 text-xxs space-y-1">
                <span className="block text-text-secondary font-bold uppercase tracking-wider mb-2 px-1">QUICK LINKS</span>
                {mockQuickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="block p-2 rounded-lg hover:bg-surface-hover text-text-primary font-semibold"
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
              className="rounded-xl border border-border-primary bg-bg-secondary p-2.5 text-text-secondary hover:text-text-primary relative cursor-pointer"
            >
              <IoNotificationsOutline size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-border-primary bg-bg-secondary shadow-premium z-30 overflow-hidden">
                <div className="px-4 py-3 bg-bg-primary border-b border-border-primary flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={() => setClearedNotifs([1, 2, 3])} className="text-[10px] font-semibold text-brand-blue hover:underline">Clear all</button>
                  )}
                </div>
                <div className="p-4 text-center">
                  {notifications.length === 0 ? (
                    <p className="text-xxs text-text-secondary py-4">No notifications yet.</p>
                  ) : (
                    <div className="divide-y divide-border-primary">
                      {notifications.map(n => (
                        <div key={n.id} className="py-2 text-left text-xxs">
                          <p className="text-text-primary font-medium">{n.text}</p>
                          <span className="block text-[9px] text-text-secondary mt-1">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Interviews Completed', value: `${interviews.length}`, icon: IoMicOutline, color: 'text-brand-blue' },
          { label: 'Completed Quizzes', value: `${quizzes.length}`, icon: IoHelpCircleOutline, color: 'text-brand-purple' },
          { label: 'Interview Score', value: interviews.length > 0 ? `${avgInterviewScore}%` : '0%', icon: IoBarChartOutline, color: 'text-brand-pink' },
          { label: 'Coding Score', value: interviews.length > 0 || quizzes.length > 0 ? `${avgCodingScore}%` : '0%', icon: IoSparklesOutline, color: 'text-brand-blue' },
          { label: 'Resume Score', value: fileName ? `${atsScore}%` : 'Not Uploaded', icon: IoDocumentTextOutline, color: 'text-brand-pink' },
          { label: 'Practice Streak', value: `${streakDays} Days`, icon: IoFlameOutline, color: 'text-orange-500' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-2xl border border-border-primary bg-bg-secondary p-4 shadow-sm flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wide block truncate">{card.label}</span>
                <span className="block text-base font-extrabold font-heading text-text-primary mt-1">{card.value}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-bg-primary flex items-center justify-center shrink-0 border border-border-primary text-text-secondary">
                <Icon className={card.color} size={15} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Radar Skill Mastery Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold font-heading text-text-primary mb-4">Skill Mastery Metrics</h3>
          <div className="h-64 flex items-center justify-center relative">
            {interviews.length === 0 && quizzes.length === 0 ? (
              <div className="text-center space-y-2 p-6 z-10">
                <IoBarChartOutline size={32} className="mx-auto text-text-secondary opacity-40" />
                <h4 className="text-xs font-bold text-text-primary">No Analytics Available Yet</h4>
                <p className="text-[10px] text-text-secondary max-w-xs mx-auto">Complete your first mock interview or quiz challenge to unlock radar competency diagrams.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={chartStroke} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: textStroke, fontSize: 10, fontWeight: 550 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: textStroke }} />
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

        {/* Line Chart Score Progress */}
        <div className="lg:col-span-6 rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold font-heading text-text-primary mb-4">Recruiter Calibration Progression</h3>
          <div className="h-64 flex items-center justify-center">
            {interviews.length === 0 ? (
              <div className="text-center space-y-2 p-6 z-10">
                <IoSparklesOutline size={32} className="mx-auto text-text-secondary opacity-40" />
                <h4 className="text-xs font-bold text-text-primary">No Progression Data</h4>
                <p className="text-[10px] text-text-secondary max-w-xs mx-auto font-sans">Mock scores build dynamically upon session submissions.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                  <XAxis dataKey="name" tick={{ fill: textStroke, fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: textStroke, fontSize: 10 }} />
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

      {/* 4. WORKSPACE CONTENT (TODAY'S GOAL & RECENT DATA TABLES) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Goals, History, Leaderboard) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Today's Goal Checklist */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
            <h3 className="text-sm font-bold font-heading text-text-primary mb-4">Today's Practice Calibration</h3>
            <div className="divide-y divide-border-primary">
              {goals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center h-4 w-4 rounded-full border ${
                      goal.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-border-primary'
                    }`}>
                      {goal.completed && <IoCheckmarkCircleSharp size={12} />}
                    </span>
                    <span className={`text-xs ${goal.completed ? 'line-through text-text-secondary' : 'font-medium text-text-primary'}`}>
                      {goal.text}
                    </span>
                  </div>
                  {!goal.completed && (
                    <Link to={goal.path} className="text-xxs font-bold text-brand-blue hover:underline flex items-center gap-0.5">
                      Start <IoArrowForwardOutline />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Interview History */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-primary flex justify-between items-center bg-bg-primary/50">
              <h3 className="text-sm font-bold font-heading text-text-primary">Recent Mock History</h3>
              <span className="text-[10px] font-bold text-text-secondary uppercase">{interviews.length} Sessions</span>
            </div>

            {interviews.length === 0 ? (
              <EmptyState 
                icon={IoMicOutline}
                title="No interviews completed yet."
                description="Start your first simulated recruiter mock interview to evaluate your communication pacing and coding diagnostics."
                primaryCta={{ label: "Start Interview", path: "/interview" }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-primary text-[9px] font-bold uppercase tracking-wider text-text-secondary border-b border-border-primary">
                      <th className="px-6 py-3.5">Company</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Difficulty</th>
                      <th className="px-6 py-3.5">Score</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary text-xs text-text-secondary">
                    {interviews.map(item => (
                      <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-text-primary">{item.company}</td>
                        <td className="px-6 py-4">{item.role}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            item.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-brand-blue">{item.scores.overall}%</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate('/interview')} className="text-xxs font-bold text-brand-blue hover:underline cursor-pointer">
                            Open Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Leaderboard Section */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
            <h3 className="text-sm font-bold font-heading text-text-primary mb-4 flex items-center gap-1.5">
              <IoTrendingUpOutline className="text-brand-purple" /> Leaderboard Rankings
            </h3>
            {quizzes.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border-primary rounded-xl p-4 bg-bg-primary/20 space-y-3">
                <p className="text-xs text-text-secondary">Participate in quizzes to appear on the leaderboard.</p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-text-primary text-bg-secondary text-xxs font-bold hover:opacity-90 active:scale-95 transition-all shadow-premium cursor-pointer"
                >
                  Take Challenge Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboardCandidates.map((cand, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    cand.name === 'You' 
                      ? 'border-brand-purple bg-purple-55/10 dark:bg-purple-950/10 font-bold' 
                      : 'border-border-primary bg-bg-primary/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-text-secondary font-extrabold w-4">{idx + 1}.</span>
                      <div>
                        <span className="block text-text-primary">{cand.name}</span>
                        <span className="block text-[9px] text-text-secondary mt-0.5">{cand.role}</span>
                      </div>
                    </div>
                    <span className="font-mono text-brand-purple font-extrabold">{cand.score}% Accuracy</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Quick Actions, AI Strategy, Locked Achievements) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary">Quick Actions</h3>
            <div className="space-y-2">
              <Link 
                to="/interview"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border-primary bg-bg-primary/30 hover:bg-surface-hover text-xs text-left cursor-pointer transition-colors"
              >
                <span className="font-semibold text-text-primary">Start Recruiter Simulation</span>
                <IoPlayOutline className="text-brand-blue" />
              </Link>
              <Link 
                to="/resume"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border-primary bg-bg-primary/30 hover:bg-surface-hover text-xs text-left cursor-pointer transition-colors"
              >
                <span className="font-semibold text-text-primary">Analyze ATS CV Fit</span>
                <IoDocumentTextOutline className="text-brand-pink" />
              </Link>
              <Link 
                to="/roadmap"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border-primary bg-bg-primary/30 hover:bg-surface-hover text-xs text-left cursor-pointer transition-colors"
              >
                <span className="font-semibold text-text-primary">View Learning Roadmap</span>
                <IoGitBranchOutline className="text-brand-purple" />
              </Link>
              <Link 
                to="/quiz"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border-primary bg-bg-primary/30 hover:bg-surface-hover text-xs text-left cursor-pointer transition-colors"
              >
                <span className="font-semibold text-text-primary">Attempt Prep Quiz</span>
                <IoHelpCircleOutline className="text-orange-500" />
              </Link>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="rounded-2xl border border-blue-200/40 bg-blue-50/10 p-6 dark:border-blue-900/10 dark:bg-blue-950/5 space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary flex items-center gap-1.5">
              <IoSparklesOutline className="text-brand-blue" /> AI Coach Strategy
            </h3>
            <div className="space-y-3 text-xxs text-text-secondary leading-relaxed">
              <div className="flex gap-2">
                <IoCheckmarkCircleSharp className="text-brand-blue shrink-0 mt-0.5" size={12} />
                <span>Upload your resume to evaluate original text vs. AI recommendations.</span>
              </div>
              <div className="flex gap-2">
                <IoCheckmarkCircleSharp className="text-brand-blue shrink-0 mt-0.5" size={12} />
                <span>Start your first interview with custom JD keywords to train diagnostics.</span>
              </div>
              <div className="flex gap-2">
                <IoCheckmarkCircleSharp className="text-brand-blue shrink-0 mt-0.5" size={12} />
                <span>Maintain your streak to build long-term placement compatibility scores.</span>
              </div>
            </div>
          </div>

          {/* Achievements (Locked for new users!) */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary flex items-center gap-1.5">
              <IoRibbonOutline className="text-brand-purple" /> Calibrated Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map(ach => {
                const Icon = ach.icon;
                const percent = Math.min((ach.current / ach.target) * 100, 100);
                const isLocked = ach.current < ach.target;
                
                return (
                  <div key={ach.id} className="p-3 border border-border-primary bg-bg-primary/45 rounded-xl text-xxs space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <Icon className="text-text-secondary shrink-0" size={13} />
                        {isLocked && <IoLockClosedOutline className="text-text-secondary shrink-0" size={11} />}
                        {ach.title}
                      </span>
                      <span className="font-bold text-text-secondary">{ach.current} / {ach.target}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary leading-normal relative z-10">{ach.desc}</p>
                    <div className="w-full bg-border-primary h-1 rounded-full overflow-hidden relative z-10">
                      <div className="bg-brand-purple h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
