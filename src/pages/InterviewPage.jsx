import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoPlayOutline, IoCodeSlashOutline, IoSparklesOutline,
  IoEyeOutline, IoChatbubbleEllipsesOutline, IoArrowBackOutline,
  IoVideocamOutline, IoSendOutline, IoCheckmarkCircle, IoCloseCircle,
} from 'react-icons/io5';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';

export default function InterviewPage() {
  const {
    activeInterview, currentQuestionIndex, chatHistory,
    codeAnswer, setCodeAnswer, isAiResponding, interviewStatus,
    testCasesStatus, consoleLogs, interviewTimer, formatTimer,
    startNewInterview, submitAnswer, runCode, finishActiveInterview, resetInterview,
  } = useInterview();
  const { extractedSkills, hasResume } = useResume();
  const { user } = useAuth();

  const [role, setRole] = useState(user?.role || 'Frontend Engineer');
  const [company, setCompany] = useState(user?.company || '');
  const [difficulty, setDifficulty] = useState('Medium');
  const [jobDescription, setJobDescription] = useState('');
  const [userText, setUserText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleStart = (e) => {
    e.preventDefault();
    startNewInterview({ role, company: company || 'Global Tech Corp', difficulty, jobDescription, extractedSkills });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!userText.trim()) return;
    submitAnswer(userText);
    setUserText('');
  };

  const currentQ = activeInterview?.questions?.[currentQuestionIndex];
  const isCoding = currentQ?.type === 'technical_code';
  const totalQ = activeInterview?.questions?.length || 0;

  const timerColor = interviewTimer > 2400 ? 'text-amber-500' : 'text-text-secondary';

  return (
    <div className="pb-8">
      <AnimatePresence mode="wait">

        {/* ── IDLE: Setup form ── */}
        {interviewStatus === 'idle' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-7">
            <div>
              <h1 className="text-3xl font-bold font-heading text-text-primary">Mock Interview</h1>
              <p className="text-sm text-text-secondary mt-1">
                Configure your session. Paste a job description for AI-tailored questions.
              </p>
            </div>
            {hasResume && extractedSkills && (
              <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3 flex items-start gap-3">
                <IoSparklesOutline size={16} className="text-brand-blue mt-0.5 shrink-0" />
                <p className="text-xs text-brand-blue leading-relaxed">
                  Resume detected — questions will be tailored to your skills:{' '}
                  <strong>{[...extractedSkills.languages, ...extractedSkills.frameworks].slice(0, 4).join(', ')}</strong>
                </p>
              </div>
            )}
            <form onSubmit={handleStart} className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Target Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)}
                    className="w-full rounded-xl border border-border-primary bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-blue">
                    {['Frontend Engineer', 'Senior React Engineer', 'Full Stack Engineer', 'Backend Engineer', 'Software Engineer'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Target Company</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google, Stripe, Microsoft..."
                    className="w-full rounded-xl border border-border-primary bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-blue transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Job Description</label>
                <textarea rows={4} value={jobDescription} onChange={e => setJobDescription(e.target.value)} required
                  placeholder="Paste the job description here. The AI will scan for keywords to generate relevant technical and behavioural questions..."
                  className="w-full rounded-xl border border-border-primary bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-blue transition-all resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Difficulty</label>
                <div className="flex gap-3">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button key={d} type="button" onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                        difficulty === d ? 'border-brand-blue bg-brand-blue/8 text-brand-blue' : 'border-border-primary text-text-secondary hover:bg-surface-hover'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" leftIcon={<IoPlayOutline />}>
                Start AI Interview
              </Button>
            </form>
          </motion.div>
        )}

        {/* ── SETTING UP ── */}
        {interviewStatus === 'setting_up' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-[60vh] flex flex-col items-center justify-center text-center gap-6">
            <div className="relative h-16 w-16">
              <span className="absolute inset-0 rounded-full border-2 border-border-primary border-t-brand-blue animate-spin" />
              <IoSparklesOutline size={22} className="absolute inset-0 m-auto text-brand-blue animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-text-primary">Setting up your interview...</h2>
              <p className="text-sm text-text-secondary mt-1">Analysing job description and configuring questions</p>
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE interview ── */}
        {interviewStatus === 'active' && activeInterview && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid lg:grid-cols-12 gap-5 h-[calc(100vh-120px)] min-h-[600px]">

            {/* Left — webcam + chat */}
            <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
              {/* Webcam HUD */}
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-4 shrink-0">
                <div className="relative h-36 rounded-xl bg-neutral-950 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f620_1px,transparent_1px)] [background-size:18px_18px]" />
                  <motion.div className="absolute inset-x-0 h-px bg-brand-blue/50 shadow-glow-blue"
                    animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                  <div className="z-10 flex flex-col items-center gap-1.5">
                    <IoVideocamOutline size={24} className="text-neutral-500" />
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">WEBCAM ACTIVE</span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-brand-blue border border-brand-blue/20">
                    REC
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                    {formatTimer(interviewTimer)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="rounded-lg bg-surface border border-border-secondary p-2 text-center">
                    <p className="text-[9px] text-text-tertiary">Question</p>
                    <p className="text-xs font-bold text-text-primary">{currentQuestionIndex + 1}/{totalQ}</p>
                  </div>
                  <div className="rounded-lg bg-surface border border-border-secondary p-2 text-center">
                    <p className="text-[9px] text-text-tertiary">Difficulty</p>
                    <p className="text-xs font-bold text-text-primary">{activeInterview.difficulty}</p>
                  </div>
                  <div className="rounded-lg bg-surface border border-border-secondary p-2 text-center">
                    <p className="text-[9px] text-text-tertiary">Progress</p>
                    <p className="text-xs font-bold text-brand-blue">{Math.round((currentQuestionIndex / totalQ) * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Chat stream */}
              <div className="flex-1 flex flex-col rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden min-h-0">
                <div className="px-4 py-2.5 border-b border-border-primary bg-surface shrink-0 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                    {activeInterview.company} AI Interviewer
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex flex-col max-w-[88%] ${msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start'}`}>
                      <span className="text-[9px] text-text-tertiary font-mono uppercase mb-1">
                        {msg.sender === 'user' ? (user?.name || 'You') : activeInterview.company}
                      </span>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-text-primary text-bg-secondary rounded-tr-sm'
                          : 'bg-surface text-text-primary rounded-tl-sm border border-border-secondary'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiResponding && (
                    <div className="self-start flex gap-1.5 px-3.5 py-2.5 bg-surface rounded-2xl rounded-tl-sm border border-border-secondary">
                      {[0,1,2].map(i => (
                        <span key={i} className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>

            {/* Right — answer/code panel */}
            <div className="lg:col-span-7 flex flex-col min-h-0">
              {!isCoding ? (
                <div className="flex-1 flex flex-col rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border-primary shrink-0 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                      <IoChatbubbleEllipsesOutline size={15} /> Your Answer
                    </span>
                    <Badge color="blue">Q{currentQuestionIndex + 1} · {currentQ?.type === 'behavioral' ? 'Behavioral' : 'Conceptual'}</Badge>
                  </div>
                  {currentQ?.tip && (
                    <div className="mx-5 mt-4 rounded-xl border border-amber-200/30 bg-amber-50/20 dark:bg-amber-950/10 dark:border-amber-800/20 px-4 py-3">
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                        <strong>Tip:</strong> {currentQ.tip}
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleSend} className="flex-1 flex flex-col p-5 gap-4">
                    <textarea value={userText} onChange={e => setUserText(e.target.value)} required
                      placeholder="Type your answer here. Use the STAR method for behavioral questions (Situation → Task → Action → Result)..."
                      className="flex-1 rounded-xl border border-border-primary bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-blue resize-none min-h-[200px]" />
                    <div className="flex items-center justify-between shrink-0">
                      <span className="text-xs text-text-tertiary">{userText.length} chars</span>
                      <div className="flex gap-2">
                        {currentQuestionIndex === totalQ - 1 ? (
                          <Button type="button" onClick={() => { submitAnswer(userText); setUserText(''); setTimeout(finishActiveInterview, 1800); }}>
                            Submit & Finish
                          </Button>
                        ) : (
                          <Button type="submit" rightIcon={<IoSendOutline size={14} />}>Submit Answer</Button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Code editor */
                <div className="flex-1 flex flex-col rounded-2xl border border-border-primary bg-neutral-950 overflow-hidden">
                  <div className="bg-neutral-900 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <IoCodeSlashOutline size={15} className="text-emerald-400" />
                      <span className="text-xs font-mono text-neutral-300">solution.js</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="xs" variant="secondary"
                        onClick={() => runCode(codeAnswer, currentQ?.codingQuestion || 'useDebounce')}
                        disabled={testCasesStatus === 'running'}
                        className="!bg-neutral-800 !border-neutral-700 !text-emerald-400 hover:!bg-neutral-700">
                        {testCasesStatus === 'running' ? 'Running...' : 'Run Tests'}
                      </Button>
                      <Button size="xs"
                        onClick={() => { submitAnswer('[Code submitted]'); setUserText(''); }}
                        className="!bg-brand-blue">
                        Submit
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-1 overflow-hidden min-h-0">
                    <div className="w-10 bg-neutral-950 pt-4 pr-2 text-right select-none border-r border-neutral-800 shrink-0">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="text-[10px] font-mono text-neutral-700 leading-[1.6]">{i + 1}</div>
                      ))}
                    </div>
                    <textarea value={codeAnswer} onChange={e => setCodeAnswer(e.target.value)}
                      spellCheck={false}
                      className="flex-1 bg-neutral-950 text-slate-100 p-4 text-[12.5px] font-mono outline-none resize-none leading-[1.6] editor-textarea" />
                  </div>
                  {/* Console */}
                  <div className="h-36 border-t border-neutral-800 bg-neutral-950 p-3 font-mono text-[10px] overflow-y-auto shrink-0">
                    <p className="text-neutral-600 uppercase tracking-wider font-bold mb-1.5 text-[9px]">Console Output</p>
                    {testCasesStatus === 'running' && (
                      <p className="text-amber-400 animate-pulse flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" /> Running test cases...
                      </p>
                    )}
                    {consoleLogs.map((log, i) => (
                      <div key={i} className={
                        log.startsWith('✓') ? 'text-emerald-400' :
                        log.startsWith('✗') ? 'text-red-400' :
                        log.startsWith('>') ? 'text-neutral-500' : 'text-neutral-300'
                      }>{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── REVIEW: Report ── */}
        {interviewStatus === 'review' && activeInterview && (
          <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-heading text-text-primary">Interview Report</h1>
                <p className="text-sm text-text-secondary mt-1">
                  {activeInterview.company} · {activeInterview.role} · {activeInterview.date}
                </p>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<IoArrowBackOutline size={14} />} onClick={resetInterview}>
                New Session
              </Button>
            </div>

            {/* Overall score */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 flex flex-col sm:flex-row items-center gap-6">
              <ProgressRing
                value={activeInterview.scores.overall}
                size={140}
                strokeWidth={11}
                color={activeInterview.scores.overall >= 75 ? '#10b981' : activeInterview.scores.overall >= 55 ? '#3b82f6' : '#f97316'}
                label={`${activeInterview.scores.overall}%`}
                sublabel="OVERALL"
              />
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold font-heading text-text-primary">AI Diagnostic Feedback</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{activeInterview.feedback}</p>
              </div>
            </div>

            {/* Category bars */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Technical Accuracy', val: activeInterview.scores.technical, color: '#3b82f6' },
                { label: 'Communication', val: activeInterview.scores.communication, color: '#8b5cf6' },
                { label: 'Problem Solving', val: activeInterview.scores.problemSolving, color: '#10b981' },
                { label: 'Behavioral Fit', val: activeInterview.scores.behavioral, color: '#f97316' },
              ].map(cat => (
                <div key={cat.label} className="rounded-2xl border border-border-primary bg-bg-secondary p-5 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-text-primary">{cat.label}</span>
                    <span className="font-bold font-mono" style={{ color: cat.color }}>{cat.val}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-border-primary overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.val}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Q&A review */}
            {activeInterview.qaReviews?.length > 0 && (
              <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
                <div className="px-6 py-4 border-b border-border-primary">
                  <h3 className="text-sm font-bold text-text-primary">Q&A Review</h3>
                </div>
                <div className="divide-y divide-border-primary">
                  {activeInterview.qaReviews.map((qa, i) => (
                    <div key={i} className="p-6 space-y-4">
                      <div className="flex gap-2.5 items-start">
                        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded shrink-0 mt-0.5">Q{i+1}</span>
                        <p className="text-sm font-semibold text-text-primary leading-snug">{qa.question}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border-secondary bg-surface p-4 space-y-1.5">
                          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Your answer</p>
                          <p className="text-xs text-text-secondary leading-relaxed italic">"{qa.userAnswer}"</p>
                          {qa.userCode && (
                            <pre className="mt-2 p-2.5 rounded-lg bg-neutral-950 text-emerald-400 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">{qa.userCode}</pre>
                          )}
                        </div>
                        <div className="rounded-xl border border-brand-blue/15 bg-brand-blue/5 p-4 space-y-1.5">
                          <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Coach guidance</p>
                          <p className="text-xs text-text-secondary leading-relaxed">{qa.idealAnswer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-surface border border-border-secondary p-3">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${qa.coachScore >= 70 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                          Score: {qa.coachScore}%
                        </span>
                        <p className="text-xs text-text-secondary leading-relaxed"><strong>AI Coach:</strong> {qa.coachFeedback}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
