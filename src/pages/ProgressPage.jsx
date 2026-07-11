import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell,
} from 'recharts';
import {
  IoMicOutline, IoHelpCircleOutline, IoDocumentTextOutline, IoTrophyOutline,
  IoArrowForwardOutline, IoBarChartOutline, IoFlameOutline, IoTimeOutline,
  IoCheckmarkCircle, IoCloseCircle,
} from 'react-icons/io5';
import EmptyState from '../components/ui/EmptyState';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon: Icon, color = 'text-brand-blue', sub }) {
  return (
    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold font-heading text-text-primary mt-1 leading-none">{value}</p>
        {sub && <p className="text-xs text-text-tertiary mt-1">{sub}</p>}
      </div>
      <div className={`h-10 w-10 rounded-xl bg-border-secondary flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { interviews, quizzes } = useInterview();
  const { atsScore, hasResume } = useResume();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const chartStroke = isDark ? '#27272a' : '#e2e8f0';
  const chartText = isDark ? '#71717a' : '#94a3b8';

  const hasAnyData = interviews.length > 0 || quizzes.length > 0 || hasResume;

  // Compute stats
  const avgInterviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((s, i) => s + i.scores.overall, 0) / interviews.length)
    : 0;

  const avgQuizScore = quizzes.length > 0
    ? Math.round(quizzes.reduce((s, q) => s + q.score, 0) / quizzes.length)
    : 0;

  const totalXP = quizzes.reduce((s, q) => s + (q.xpGained || 0), 0);
  const totalInterviewTime = interviews.length * 35; // approx

  // Progress % overall
  const overallProgress = Math.min(
    Math.round(
      (interviews.length > 0 ? 35 : 0) +
      (quizzes.length > 0 ? 25 : 0) +
      (hasResume ? 25 : 0) +
      (avgInterviewScore > 70 ? 15 : avgInterviewScore > 50 ? 8 : 0)
    ), 100
  );

  // Radar data
  const radarData = interviews.length > 0 ? [
    { subject: 'Communication', score: Math.round(interviews.reduce((s, i) => s + i.scores.communication, 0) / interviews.length) },
    { subject: 'Technical', score: Math.round(interviews.reduce((s, i) => s + i.scores.technical, 0) / interviews.length) },
    { subject: 'Problem Solving', score: Math.round(interviews.reduce((s, i) => s + i.scores.problemSolving, 0) / interviews.length) },
    { subject: 'Behavioral', score: Math.round(interviews.reduce((s, i) => s + i.scores.behavioral, 0) / interviews.length) },
    { subject: 'Quiz Score', score: avgQuizScore },
  ] : [];

  // Interview progression line
  const lineData = [...interviews].reverse().map((iv, i) => ({
    name: `#${i + 1} ${iv.company}`,
    score: iv.scores.overall,
    communication: iv.scores.communication,
    technical: iv.scores.technical,
  }));

  // Quiz bar data
  const quizBarData = quizzes.slice(0, 8).map((q, i) => ({
    name: `Quiz ${i + 1}`,
    score: q.score,
    category: q.category,
  }));

  // Skill breakdown from latest interview
  const latestInterview = interviews[0];
  const skillBreakdown = latestInterview ? [
    { label: 'Communication', value: latestInterview.scores.communication, color: '#3b82f6' },
    { label: 'Technical', value: latestInterview.scores.technical, color: '#8b5cf6' },
    { label: 'Problem Solving', value: latestInterview.scores.problemSolving, color: '#10b981' },
    { label: 'Behavioral', value: latestInterview.scores.behavioral, color: '#f97316' },
  ] : [];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">Progress & Analytics</h1>
          <p className="text-sm text-text-secondary mt-1">
            All stats are computed from your actual activity — no filler data.
          </p>
        </div>
        {hasAnyData && (
          <Badge color="blue" dot>
            {overallProgress}% placement readiness
          </Badge>
        )}
      </div>

      {!hasAnyData ? (
        <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
          <EmptyState
            icon={IoBarChartOutline}
            title="No activity data yet"
            description="Complete interviews, quizzes, and upload your resume to see detailed analytics and progress charts here."
            primaryCta={{ label: 'Start Mock Interview', path: '/interview' }}
            secondaryCta={{ label: 'Upload Resume', path: '/resume' }}
          />
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Interviews Done" value={interviews.length} icon={IoMicOutline} color="text-brand-blue" sub={`Avg score: ${avgInterviewScore}%`} />
            <StatCard label="Quizzes Completed" value={quizzes.length} icon={IoHelpCircleOutline} color="text-brand-purple" sub={`Avg: ${avgQuizScore}%`} />
            <StatCard label="ATS Score" value={hasResume ? `${atsScore}%` : 'N/A'} icon={IoDocumentTextOutline} color="text-brand-pink" sub={hasResume ? 'Resume uploaded' : 'No resume yet'} />
            <StatCard label="XP Earned" value={`${totalXP}`} icon={IoTrophyOutline} color="text-amber-500" sub="From quiz completions" />
          </div>

          {/* Overall progress ring + skill bars */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Progress ring */}
            <div className="lg:col-span-4 rounded-2xl border border-border-primary bg-bg-secondary p-6 flex flex-col items-center justify-center gap-5">
              <h3 className="text-sm font-bold text-text-primary self-start">Placement Readiness</h3>
              <ProgressRing
                value={overallProgress}
                size={160}
                strokeWidth={12}
                color="#3b82f6"
                label={`${overallProgress}%`}
                sublabel="READY"
              />
              <div className="w-full space-y-2">
                {[
                  { label: 'Interviews', done: interviews.length > 0, val: `${interviews.length} completed` },
                  { label: 'Quizzes', done: quizzes.length > 0, val: `${quizzes.length} completed` },
                  { label: 'Resume', done: hasResume, val: hasResume ? `ATS: ${atsScore}%` : 'Not uploaded' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {item.done
                        ? <IoCheckmarkCircle size={14} className="text-emerald-500 shrink-0" />
                        : <IoCloseCircle size={14} className="text-text-tertiary shrink-0" />}
                      <span className="text-text-secondary">{item.label}</span>
                    </div>
                    <span className={`font-semibold ${item.done ? 'text-text-primary' : 'text-text-tertiary'}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill breakdown — latest interview */}
            <div className="lg:col-span-8 rounded-2xl border border-border-primary bg-bg-secondary p-6">
              <h3 className="text-sm font-bold text-text-primary mb-5">
                Latest Interview — Skill Breakdown
                {latestInterview && <span className="ml-2 text-xs font-normal text-text-tertiary">{latestInterview.company} · {latestInterview.date}</span>}
              </h3>
              {skillBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {skillBreakdown.map(skill => (
                    <div key={skill.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-text-secondary">{skill.label}</span>
                        <span className="font-bold text-text-primary font-mono">{skill.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-border-primary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: skill.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-text-tertiary text-sm">
                  Complete an interview to see skill analysis
                </div>
              )}
            </div>
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Competency Radar</h3>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={chartStroke} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: chartText, fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: chartText, fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-60 flex items-center justify-center text-sm text-text-tertiary">Complete an interview to unlock</div>
              )}
            </div>

            {/* Line chart */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Interview Score Progression</h3>
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} />
                    <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: chartText, fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 12 }}
                      labelStyle={{ color: 'var(--text-secondary)', fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} name="Overall" />
                    <Line type="monotone" dataKey="technical" stroke="#3b82f6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Technical" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-60 flex items-center justify-center text-sm text-text-tertiary">Complete interviews to track progression</div>
              )}
            </div>
          </div>

          {/* Quiz bar chart */}
          {quizBarData.length > 0 && (
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4">Quiz Performance History</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={quizBarData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartStroke} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: chartText, fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 12 }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {quizBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#3b82f6' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Interview history table */}
          {interviews.length > 0 && (
            <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
              <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">Interview History</h3>
                <span className="text-xs text-text-tertiary">{interviews.length} session{interviews.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      <th className="px-6 py-3 text-left">Company</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Difficulty</th>
                      <th className="px-6 py-3 text-left">Score</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-primary">
                    {interviews.map(iv => (
                      <tr key={iv.id} className="hover:bg-surface-hover/50 transition-colors text-sm">
                        <td className="px-6 py-4 font-semibold text-text-primary">{iv.company}</td>
                        <td className="px-6 py-4 text-text-secondary">{iv.role}</td>
                        <td className="px-6 py-4 text-text-tertiary font-mono text-xs">{iv.date}</td>
                        <td className="px-6 py-4">
                          <Badge color={iv.difficulty === 'Hard' ? 'red' : iv.difficulty === 'Medium' ? 'amber' : 'green'}>
                            {iv.difficulty}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold font-mono ${iv.scores.overall >= 75 ? 'text-emerald-500' : iv.scores.overall >= 55 ? 'text-brand-blue' : 'text-amber-500'}`}>
                            {iv.scores.overall}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to="/interview" className="text-xs font-semibold text-brand-blue hover:underline inline-flex items-center gap-1">
                            View <IoArrowForwardOutline size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quiz history */}
          {quizzes.length > 0 && (
            <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
              <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">Quiz History</h3>
                <span className="text-xs text-text-tertiary">{quizzes.length} completed</span>
              </div>
              <div className="divide-y divide-border-primary">
                {quizzes.map(q => (
                  <div key={q.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                        q.score >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                      }`}>
                        {q.score}%
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{q.category}</p>
                        <p className="text-xs text-text-tertiary">{q.correctAnswers}/{q.totalQuestions} correct · {q.date}</p>
                      </div>
                    </div>
                    <Badge color="purple">+{q.xpGained || 0} XP</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
