import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCheckmarkCircle, IoCloseCircle, IoArrowForward, IoArrowBack,
  IoRibbonOutline, IoSparklesOutline, IoTimerOutline, IoReloadOutline,
  IoDocumentTextOutline, IoHelpCircleOutline,
} from 'react-icons/io5';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ProgressRing from '../components/ui/ProgressRing';

// Fallback general questions
const FALLBACK_QUESTIONS = [
  {
    id: 'f1', skill: 'General',
    question: 'What is the difference between synchronous and asynchronous programming?',
    options: [
      'No practical difference',
      'Synchronous blocks execution; asynchronous allows other code to run while waiting',
      'Async is always faster than sync',
      'Sync uses callbacks; async uses promises only',
    ],
    answer: 1,
    explanation: 'Synchronous code runs sequentially, blocking until each operation completes. Async code (Promises, async/await) allows non-blocking I/O so other tasks can run while waiting for slow operations like network requests.',
  },
  {
    id: 'f2', skill: 'General',
    question: 'What does "Big O notation" express in algorithm analysis?',
    options: [
      'The exact number of CPU cycles an algorithm uses',
      'How algorithm runtime or space grows relative to input size — its scalability',
      'The amount of RAM an algorithm requires in bytes',
      'The number of lines of code in a function',
    ],
    answer: 1,
    explanation: 'Big O describes the upper bound of complexity. O(1) is constant, O(n) is linear, O(n²) is quadratic. It helps compare algorithm efficiency and choose optimal solutions.',
  },
  {
    id: 'f3', skill: 'General',
    question: 'What is the purpose of version control systems like Git?',
    options: [
      'To speed up code compilation',
      'To track every change to a codebase over time, enabling collaboration and rollbacks',
      'To manage server deployments',
      'To replace documentation',
    ],
    answer: 1,
    explanation: 'Version control tracks every change with author, timestamp, and message. This enables safe collaboration (branches/merges), rollbacks to previous states, and a complete history of architectural decisions.',
  },
  {
    id: 'f4', skill: 'Architecture',
    question: 'What is "separation of concerns" in software design?',
    options: [
      'A deployment strategy for microservices',
      'Dividing a program into distinct sections, each addressing a single concern to improve maintainability',
      'A CSS methodology using BEM naming',
      'A testing pattern for unit tests',
    ],
    answer: 1,
    explanation: 'Separation of concerns means each module/component handles one specific responsibility. This reduces coupling, improves testability, and makes the codebase easier to navigate and change.',
  },
  {
    id: 'f5', skill: 'Web',
    question: 'What is the purpose of semantic HTML elements?',
    options: [
      'To make pages render faster',
      'To convey meaning to browsers, screen readers, and search engines — improving accessibility and SEO',
      'To replace all CSS styling',
      'To enable JavaScript features',
    ],
    answer: 1,
    explanation: 'Semantic elements like <header>, <nav>, <main>, <article> describe purpose. This improves accessibility (screen readers), SEO (search engines understand content), and code maintainability.',
  },
];

// Timer display helper
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function QuizPage() {
  const { addCompletedQuiz } = useInterview();
  const { generatedQuizQuestions, hasResume } = useResume();
  const toast = useToast();
  const navigate = useNavigate();

  const questions = generatedQuizQuestions.length > 0 ? generatedQuizQuestions : FALLBACK_QUESTIONS;

  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState([]); // {questionId, selected, correct}
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);

  // Timer
  useEffect(() => {
    if (!timerActive || answered) return;
    if (timer <= 0) {
      setTimeExpired(true);
      setAnswered(true);
      setTimerActive(false);
      return;
    }
    const iv = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(iv);
  }, [timerActive, answered, timer]);

  const currentQ = questions[currentIdx];

  const handleStart = () => {
    setPhase('quiz');
    setCurrentIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setAnswers([]);
    setTimer(30);
    setTimerActive(true);
    setTimeExpired(false);
  };

  const handleSelect = (optionIdx) => {
    if (answered) return;
    setSelected(optionIdx);
    setAnswered(true);
    setTimerActive(false);

    const isCorrect = optionIdx === currentQ.answer;
    if (isCorrect) setCorrectCount(c => c + 1);

    setAnswers(prev => [...prev, {
      questionId: currentQ.id,
      questionText: currentQ.question,
      selected: optionIdx,
      correct: isCorrect,
      correctAnswer: currentQ.answer,
      explanation: currentQ.explanation,
      skill: currentQ.skill,
      options: currentQ.options,
    }]);
  };

  const handleNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelected(null);
      setAnswered(false);
      setTimer(30);
      setTimerActive(true);
      setTimeExpired(false);
    } else {
      // Finish
      const score = Math.round(((correctCount + (selected === currentQ?.answer ? 1 : 0)) / questions.length) * 100);
      const xp = Math.round(score / 100 * questions.length * 50);
      setScorePercent(score);
      setXpGained(xp);
      setPhase('result');
      addCompletedQuiz({
        id: 'quiz-' + Date.now(),
        category: hasResume ? 'Resume-Based Skills' : 'General Knowledge',
        score,
        xpGained: xp,
        date: new Date().toISOString().split('T')[0],
        correctAnswers: correctCount,
        totalQuestions: questions.length,
      });
      toast.success('Quiz complete!', `You scored ${score}% — +${xp} XP earned!`);
    }
  };

  const handleRetry = () => {
    setPhase('intro');
    setCurrentIdx(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setAnswers([]);
    setTimer(30);
    setTimerActive(false);
    setTimeExpired(false);
  };

  const timerColor = timer <= 5 ? 'text-danger' : timer <= 10 ? 'text-amber-500' : 'text-brand-blue';
  const timerBg = timer <= 5 ? 'bg-danger/10' : timer <= 10 ? 'bg-amber-500/10' : 'bg-brand-blue/10';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <AnimatePresence mode="wait">

        {/* ── INTRO phase ── */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold font-heading text-text-primary">Skill Quiz</h1>
              <p className="text-sm text-text-secondary mt-1">
                {hasResume
                  ? 'Questions generated from your uploaded resume skills.'
                  : 'General knowledge questions. Upload your resume for personalised quizzes.'}
              </p>
            </div>

            {/* Info card */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-5">
              {/* Skill tags */}
              <div>
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Quiz covers</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(questions.map(q => q.skill))].map(skill => (
                    <Badge key={skill} color="blue">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Quiz format */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-primary">
                {[
                  { label: 'Questions', value: questions.length },
                  { label: 'Time per Q', value: '30s' },
                  { label: 'XP Reward', value: `${questions.length * 50}` },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-surface border border-border-secondary">
                    <p className="text-xl font-extrabold font-heading text-text-primary">{s.value}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button fullWidth size="lg" onClick={handleStart} rightIcon={<IoArrowForward />}>
                Start Quiz
              </Button>

              {!hasResume && (
                <p className="text-center text-xs text-text-tertiary">
                  <Link to="/resume" className="text-brand-blue hover:underline">Upload your resume</Link> to get personalised skill questions.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── QUIZ phase ── */}
        {phase === 'quiz' && currentQ && (
          <motion.div
            key={`q-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-primary">
                  {currentIdx + 1} <span className="text-text-tertiary font-normal">/ {questions.length}</span>
                </span>
                <Badge color="blue">{currentQ.skill}</Badge>
              </div>
              {/* Timer */}
              <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 ${timerBg}`}>
                <IoTimerOutline size={15} className={timerColor} />
                <span className={`font-mono text-sm font-bold ${timerColor}`}>{formatTime(timer)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-border-primary overflow-hidden">
              <motion.div
                initial={{ width: `${(currentIdx / questions.length) * 100}%` }}
                animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-full bg-brand-blue"
              />
            </div>

            {/* Question card */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-5">
              {timeExpired && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400">
                  <IoTimerOutline /> Time expired — the correct answer is highlighted below.
                </div>
              )}

              <h2 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selected === idx;
                  const isCorrect = idx === currentQ.answer;

                  let cls = 'border-border-primary bg-bg-secondary text-text-primary hover:border-text-tertiary/50 hover:bg-surface-hover';
                  if (answered) {
                    if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400';
                    else if (isSelected) cls = 'border-danger bg-danger/8 text-danger';
                    else cls = 'border-border-primary bg-surface opacity-50 text-text-tertiary';
                  } else if (isSelected) {
                    cls = 'border-brand-blue bg-brand-blue/8 text-brand-blue';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${!answered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'} ${cls}`}
                    >
                      <span className="flex-1">{option}</span>
                      {answered && isCorrect && <IoCheckmarkCircle size={18} className="text-emerald-500 shrink-0" />}
                      {answered && isSelected && !isCorrect && <IoCloseCircle size={18} className="text-danger shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 px-4 py-3">
                      <p className="text-xs font-bold text-brand-purple flex items-center gap-1.5 mb-1.5">
                        <IoSparklesOutline size={13} /> AI Explanation
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {answered && (
                <div className="flex justify-between items-center pt-2 border-t border-border-primary">
                  <p className="text-xs text-text-tertiary">{correctCount} correct so far</p>
                  <Button size="sm" onClick={handleNext} rightIcon={<IoArrowForward size={14} />}>
                    {currentIdx === questions.length - 1 ? 'Finish' : 'Next question'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULT phase ── */}
        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold font-heading text-text-primary">Quiz Complete</h1>
              <p className="text-sm text-text-secondary mt-1">Here's how you did.</p>
            </div>

            {/* Score card */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary p-8 flex flex-col sm:flex-row items-center gap-6">
              <ProgressRing
                value={scorePercent}
                size={130}
                strokeWidth={10}
                color={scorePercent >= 80 ? '#10b981' : scorePercent >= 60 ? '#3b82f6' : '#f97316'}
                label={`${scorePercent}%`}
                sublabel="ACCURACY"
              />
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <h2 className="text-xl font-bold font-heading text-text-primary">
                  {scorePercent >= 80 ? '🎉 Excellent work!' : scorePercent >= 60 ? '👍 Good effort!' : '📚 Keep practising!'}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {scorePercent >= 80
                    ? 'Outstanding score! You have a strong grasp of these concepts. Ready for mock interviews!'
                    : scorePercent >= 60
                    ? 'Solid performance. Review the explanations for missed questions and try again to improve.'
                    : 'Review the concepts below and retry. Consistent practice builds interview confidence.'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Badge color="blue">{correctCount} / {questions.length} correct</Badge>
                  <Badge color="purple">+{xpGained} XP earned</Badge>
                </div>
              </div>
            </div>

            {/* Answer review */}
            <div className="rounded-2xl border border-border-primary bg-bg-secondary overflow-hidden">
              <div className="px-6 py-4 border-b border-border-primary">
                <h3 className="text-sm font-bold text-text-primary">Answer Review</h3>
              </div>
              <div className="divide-y divide-border-primary">
                {answers.map((ans, i) => (
                  <div key={ans.questionId} className="px-6 py-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {ans.correct
                          ? <IoCheckmarkCircle size={18} className="text-emerald-500" />
                          : <IoCloseCircle size={18} className="text-danger" />
                        }
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge color="gray">Q{i + 1}</Badge>
                          <Badge color={ans.correct ? 'green' : 'red'}>{ans.skill}</Badge>
                        </div>
                        <p className="text-sm font-medium text-text-primary leading-snug">{ans.questionText}</p>
                        {!ans.correct && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-danger">
                              ✗ Your answer: {ans.options[ans.selected]}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                              ✓ Correct: {ans.options[ans.correctAnswer]}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-text-tertiary leading-relaxed mt-2 bg-surface rounded-lg px-3 py-2">
                          💡 {ans.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" fullWidth onClick={handleRetry} leftIcon={<IoReloadOutline />}>
                Retry Quiz
              </Button>
              <Button fullWidth onClick={() => navigate('/dashboard')} rightIcon={<IoArrowForward />}>
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
