import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  IoMicOutline, IoArrowForwardOutline, IoSparklesOutline,
  IoDocumentTextOutline, IoHelpCircleOutline, IoBarChartOutline,
  IoCheckmarkCircle, IoRocketOutline, IoTrophyOutline, IoFlameOutline,
  IoPlayOutline, IoGitBranchOutline,
} from 'react-icons/io5';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { SkeletonDashboard } from '../components/ui/SkeletonLoader';

function StatCard({ label, value, icon: Icon, iconColor, trend, empty }) {
  return (
    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider leading-tight">{label}</p>
        <div className={`h-8 w-8 rounded-xl bg-border-secondary flex items-center justify-center shrink-0 ${iconColor}`}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-extrabold font-heading leading-none ${empty ? 'text-text-tertiary' : 'text-text-primary'}`}>
          {value}
        </p>
        {trend && <p className="text-xs text-text-tertiary mt-1">{trend}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { interviews, quizzes } = useInterview();
  const { atsScore, hasResume } = useResume();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <SkeletonDashboard />;

  const chartStroke = isDark ? '#27272a' : '#e2e8f0';
  const chartText = isDark ? '#71717a' : '#94a3b8';

  const avgScore = interviews.length > 0
    ? Math.round(interviews.reduce((s, i) => s + i.scores.overall, 0) / interviews.length) : 0;
  const avgQuiz = quizzes.length > 0
    ? Math.round(quizzes.reduce((s, q) => s + q.score, 0) / quizzes.length) : 0;

  const overallProgress = Math.min(
    (interviews.length > 0 ? 35 : 0) +
    (quizzes.length > 0 ? 25 : 0) +
    (hasResume ? 25 : 0) +
    (avgScore > 70 ? 15 : 0), 100
  );

  const hasAnyData = interviews.length > 0 || quizzes.length > 0 || hasResume;

  const radarData = [
    { subject: 'Communication', score: interviews.length > 0 ? Math.round(interviews.reduce((s, i) => s + i.scores.communication, 0) / interviews.length) : 0 },
    { subject: 'Technical', score: interviews.length > 0 ? Math.round(interviews.reduce((s, i) => s + i.scores.technical, 0) / interviews.length) : 0 },
    { subject: 'Problem Solving', score: interviews.length > 0 ? Math.round(interviews.reduce((s, i) => s + i.scores.problemSolving, 0) / interviews.length) : 0 },
    { subject: 'Behavioral', score: interviews.length > 0 ? Math.round(interviews.reduce((s, i) => s + i.scores.behavioral, 0) / interviews.length) : 0 },
    { subject: 'Quiz Avg', score: avgQuiz },
  ];

  const lineData = [...interviews].reverse().map((iv, i) => ({
    name: `#${i + 1} ${iv.company.slice(0, 6)}`,
    score: iv.scores.overall,
  }));

  const goals = [
    { id: 1, text: 'Upload resume & run ATS analysis', done: hasResume, path: '/resume' },
    { id: 2, text: 'Complete first mock interview', done: interviews.length > 0, path: '/interview' },
    { id: 3, text: 'Finish a skill quiz', done: quizzes.length > 0, path: '/quiz' },
  ];

  const quickActions = [
    { label: 'Start Mock Interview', desc: 'AI interviewer, coding challenge', path: '/interview', icon: IoMicOutline, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Upload Resume', desc: 'ATS score + skill extraction', path: '/resume', icon: IoDocumentTextOutline, color: 'text-brand-pink', bg: 'bg-brand-pink/10' },
    { label: 'Take Quiz', desc: 'Resume-based skill questions', path: '/quiz', icon: IoHelpCircleOutline, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
    { label: 'View Roadmap', desc: 'Learning checkpoints', path: '/roadmap', icon: IoGitBranchOutline, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  ];

  return (
    <div className="space-y-7 pb-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-heading text-text-primary"
          >
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <p className="text-sm text-text-secondary mt-1">
            {hasAnyData
              ? `Placement readiness: ${overallProgress}% · Keep going!`
              : 'Your workspace is ready. Complete the goals below to get started.'}
          </p>
        </div>
        {hasAnyData && <Badge color="blue" dot>{overallProgress}% ready</Badge>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Interviews Done"
          value={interviews.length || '0'}
          icon={IoMicOutline}
          iconColor="text-brand-blue"
          trend={avgScore > 0 ? `Avg score: ${avgScore}%` : 'Start your first session'}
          empty={interviews.length === 0}
        />
        <StatCard
          label="Quizzes Done"
          value={quizzes.length || '0'}
          icon={IoHelpCircleOutline}
          iconColor="text-brand-purple"
          trend={avgQuiz > 0 ? `Avg: ${avgQuiz}%` : 'Attempt a quiz'}
          empty={quizzes.length === 0}
        />
        <StatCard
          label="ATS Score"
          value={hasResume ? `${atsScore}%` : '—'}
          icon={IoDocumentTextOutline}
          iconColor="text-brand-pink"
          trend={hasResume ? 'Resume uploaded' : 'Upload resume to score'}
          empty={!hasResume}
        />
        <StatCard
          label="Overall Progress"
          value={`${overallProgress}%`}
          icon={IoRocketOutline}
          iconColor="text-amber-500"
          trend={overallProgress === 100 ? 'Interview ready!' : `${100 - overallProgress}% to go`}
          empty={overallProgress === 0}
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left — charts + history */}
        <div className="lg:col-span-8 space-y-6">

          {/* Charts */}
          {hasAnyData ? (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5">
                <h3 className="text-sm font-bold text-text-primary mb-4">Skill Radar</h3>
                {interviews.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={chartStroke} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: chartText, fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-sm text-text-tertiary text-center px-4">
                    Complete an interview to see your skill radar
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5">
                <h3 className="text-sm font-bold text-text-primary mb-4">Score Trend</h3>
                {lineData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                      <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 9 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: chartText, fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 11 }} />
                      <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-sm text-text-tertiary text-center px-4">
                    Complete more interviews to track progression
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Goals checklist */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
            <div className="px-6 py-4 border-b border-border-primary">
              <h3 className="text-sm font-bold text-text-primary">Getting started</h3>
              <p className="text-xs text-text-tertiary mt-0.5">Complete these to unlock full analytics</p>
            </div>
            <div className="divide-y divide-border-primary">
              {goals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between px-6 py-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-border-secondary'
                    }`}>
                      {goal.done && <IoCheckmarkCircle size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm ${goal.done ? 'line-through text-text-tertiary' : 'text-text-primary font-medium'}`}>
                      {goal.text}
                    </span>
                  </div>
                  {!goal.done && (
                    <Link to={goal.path} className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline shrink-0">
                      Start <IoArrowForwardOutline size={12} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent interviews */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
            <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">Recent Interviews</h3>
              {interviews.length > 0 && (
                <Link to="/progress" className="text-xs font-semibold text-brand-blue hover:underline">
                  View all
                </Link>
              )}
            </div>
            {interviews.length === 0 ? (
              <EmptyState
                icon={IoMicOutline}
                title="No interviews yet"
                description="Start your first AI mock interview to evaluate your communication, technical depth, and behavioral skills."
                primaryCta={{ label: 'Start Interview', path: '/interview' }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-primary text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      <th className="px-6 py-3 text-left">Company</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Score</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary">
                    {interviews.slice(0, 5).map(iv => (
                      <tr key={iv.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-text-primary">{iv.company}</td>
                        <td className="px-6 py-3.5 text-text-secondary">{iv.role}</td>
                        <td className="px-6 py-3.5">
                          <span className={`font-bold font-mono ${iv.scores.overall >= 75 ? 'text-emerald-500' : iv.scores.overall >= 55 ? 'text-brand-blue' : 'text-amber-500'}`}>
                            {iv.scores.overall}%
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-text-tertiary text-xs font-mono">{iv.date}</td>
                        <td className="px-6 py-3.5 text-right">
                          <button onClick={() => navigate('/interview')} className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right — quick actions + AI tips */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick actions */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-primary">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border-primary hover:bg-surface-hover hover:border-text-tertiary/30 transition-all group"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${action.bg} ${action.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary leading-none">{action.label}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{action.desc}</p>
                    </div>
                    <IoArrowForwardOutline size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Coach tips */}
          <div className="rounded-2xl border border-brand-blue/15 bg-brand-blue/5 p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <IoSparklesOutline className="text-brand-blue" size={16} /> AI Coach Tips
            </h3>
            <div className="space-y-2.5 text-xs text-text-secondary">
              {[
                hasResume ? '✓ Resume uploaded — take the skills quiz next.' : '→ Upload your resume to generate personalised quiz questions.',
                interviews.length === 0 ? '→ Start a mock interview — paste any job description to begin.' : `✓ ${interviews.length} interview${interviews.length > 1 ? 's' : ''} complete — check your analytics.`,
                quizzes.length === 0 ? '→ Take a skill quiz to reveal your knowledge gaps.' : `✓ ${quizzes.length} quiz${quizzes.length > 1 ? 'zes' : ''} complete — keep building your streak.`,
              ].map((tip, i) => (
                <p key={i} className="leading-relaxed">{tip}</p>
              ))}
            </div>
          </div>

          {/* Recent quizzes */}
          {quizzes.length > 0 && (
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">Recent Quizzes</h3>
                <Link to="/progress" className="text-xs font-semibold text-brand-blue hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {quizzes.slice(0, 3).map(q => (
                  <div key={q.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border-secondary last:border-0">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{q.category}</p>
                      <p className="text-[10px] text-text-tertiary">{q.correctAnswers}/{q.totalQuestions} correct</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold font-mono ${q.score >= 80 ? 'text-emerald-500' : q.score >= 60 ? 'text-brand-blue' : 'text-amber-500'}`}>{q.score}%</p>
                      <p className="text-[10px] text-brand-purple">+{q.xpGained} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
