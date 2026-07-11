import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCheckmarkCircleSharp, 
  IoCloseCircleSharp,
  IoArrowForwardOutline,
  IoRibbonOutline,
  IoArrowBackOutline,
  IoSparklesOutline
} from 'react-icons/io5';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary benefit of React 19's useTransition hook compared to traditional state updates?",
    options: [
      "It makes components render synchronously to avoid layout shifts",
      "It allows marking updates as non-blocking, keeping the browser responsive during rendering passes",
      "It auto-memoizes custom hooks and eliminates useMemo completely",
      "It shifts component rendering entirely to background service workers"
    ],
    answerIndex: 1,
    explanation: "In React 19, useTransition allows you to mark state updates as Transitions. They are non-blocking, so browser inputs (like typing) can interrupt the render to keep the UI fluid at 60fps."
  },
  {
    id: 2,
    question: "How does the new useActionState hook in React 19 optimize form submissions?",
    options: [
      "It automatically runs submissions inside a client-side web socket stream",
      "It stores form parameters in standard local storage caches",
      "It handles form action transitions, auto-pending states, and returns error responses directly",
      "It validates CSS grid variables using regex patterns"
    ],
    answerIndex: 2,
    explanation: "useActionState accepts an action handler function and returns the current state, a dispatch trigger, and an isPending flag. It abstracts the boilerplate of loading states and error handling during submissions."
  },
  {
    id: 3,
    question: "To optimize Cumulative Layout Shift (CLS) on a slow network, which strategy should you prioritize?",
    options: [
      "Use absolute position values for all text blocks",
      "Ensure all images have explicit aspect-ratio or height/width slots declared",
      "Bundle entire React routes inside a single lazy bundle",
      "Force browser redraws by running recursive requestAnimationFrame loops"
    ],
    answerIndex: 1,
    explanation: "Explicitly declaring sizes or utilizing modern CSS aspect-ratio prevents layout shifting when browser engines download and render image assets asynchronously."
  },
  {
    id: 4,
    question: "Which of the following describes a javascript closure memory leak threat?",
    options: [
      "An inner function referencing a large outer variable scope that is continuously retained in a global reference hook",
      "An API fetch returning a JSON array with duplicate key properties",
      "Evaluating string commands using standard template literal strings",
      "Running asynchronous timeouts without returning setTimeout numerical IDs"
    ],
    answerIndex: 0,
    explanation: "Closures capture outer scope variables. If the closure is retained in memory (e.g. event listeners or globals), those outer variables cannot be garbage collected, creating memory leaks."
  },
  {
    id: 5,
    question: "What does the React 19 'use()' hook do when passed a Promise as an argument?",
    options: [
      "It pauses javascript compilation until the promise settles",
      "It rejects the promise automatically if it takes more than 500ms",
      "It suspends the rendering component until the promise resolves, integrating directly with Suspense boundaries",
      "It converts the promise into a standard local storage cookie"
    ],
    answerIndex: 2,
    explanation: "React 19's use() hook reads promises or context inline. Passing a promise suspends rendering, prompting the nearest Suspense wrapper to show its fallback placeholder until resolution."
  }
];

export default function QuizPage() {
  const { addCompletedQuiz } = useInterview();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Results details
  const [scorePercent, setScorePercent] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.answerIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < QUIZ_QUESTIONS.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Calculate final score metrics
      const score = Math.floor((correctCount / QUIZ_QUESTIONS.length) * 100);
      const xp = correctCount * 50; // 50 XP per correct question
      setScorePercent(score);
      setXpGained(xp);
      setIsCompleted(true);

      // Save results to Context history database
      addCompletedQuiz({
        id: 'quiz-' + Date.now(),
        category: 'Frontend Placement Prep',
        score,
        xpGained: xp,
        date: new Date().toISOString().split('T')[0],
        correctAnswers: correctCount,
        totalQuestions: QUIZ_QUESTIONS.length
      });
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">
            Syllabus Challenge Quiz
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Validate frontend competencies and earn preparation XP marks.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary bg-bg-secondary px-3.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
        >
          <IoArrowBackOutline /> Quit Quiz
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={`question-${currentQ.id}`}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="rounded-2xl border border-border-primary bg-bg-secondary p-8 shadow-sm space-y-6"
          >
            {/* Step status */}
            <div className="flex justify-between items-center text-xxs font-bold text-text-secondary uppercase tracking-widest">
              <span>Question {currentQ.id} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-brand-purple">Earn up to 250 XP</span>
            </div>

            {/* Question title */}
            <h2 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
              {currentQ.question}
            </h2>

            {/* Options list */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectAnswer = idx === currentQ.answerIndex;
                let cardClass = 'border-border-primary hover:border-text-secondary bg-bg-secondary text-text-primary';
                
                if (isAnswered) {
                  if (isCorrectAnswer) {
                    cardClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold';
                  } else if (isSelected) {
                    cardClass = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400';
                  } else {
                    cardClass = 'border-border-primary opacity-50 bg-bg-secondary';
                  }
                } else if (isSelected) {
                  cardClass = 'border-brand-blue bg-blue-50/20 text-brand-blue';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs transition-all duration-200 ${
                      !isAnswered ? 'hover:scale-[1.005] active:scale-[0.995] cursor-pointer' : ''
                    } ${cardClass}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <IoCheckmarkCircleSharp className="text-emerald-500 shrink-0" size={18} />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <IoCloseCircleSharp className="text-red-500 shrink-0" size={18} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Explanation Drawer */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-purple-50/15 border border-purple-250/20 text-xxs text-text-secondary leading-relaxed dark:bg-purple-950/10 dark:border-purple-900/20">
                    <div className="flex items-center gap-1.5 font-bold text-brand-purple mb-1">
                      <IoSparklesOutline /> AI Coach Insights
                    </div>
                    <p>{currentQ.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next trigger */}
            {isAnswered && (
              <div className="flex justify-end pt-4 border-t border-border-primary">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-premium"
                >
                  {currentIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Challenge' : 'Next Question'} <IoArrowForwardOutline />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-results"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            className="rounded-2xl border border-border-primary bg-bg-secondary p-8 text-center space-y-6 max-w-md mx-auto"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shadow-inner">
              <IoRibbonOutline size={32} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-heading text-text-primary">Challenge Completed</h2>
              <p className="text-xs text-text-secondary">You evaluated core concepts index parameters.</p>
            </div>

            {/* Score grids */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border-primary bg-bg-primary/30">
                <span className="text-xxs font-bold text-text-secondary uppercase">ACCURACY</span>
                <span className="block text-2xl font-extrabold text-brand-blue font-heading mt-1">{scorePercent}%</span>
              </div>
              <div className="p-4 rounded-xl border border-border-primary bg-bg-primary/30">
                <span className="text-xxs font-bold text-text-secondary uppercase">XP EARNED</span>
                <span className="block text-2xl font-extrabold text-brand-purple font-heading mt-1">+{xpGained} XP</span>
              </div>
            </div>

            {/* Performance status breakdown */}
            <p className="text-xs text-text-secondary leading-relaxed px-2">
              {scorePercent >= 80 
                ? 'Excellent score! You have calibrated your frontend React concurrency and layout performance concepts to senior engineering expectations.'
                : 'A healthy score. Re-read target explanations and retry checkpoints to secure perfect placement evaluations.'
              }
            </p>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setCorrectCount(0);
                  setIsCompleted(false);
                }}
                className="flex-1 rounded-xl border border-border-primary py-3 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer transition-colors"
              >
                Retry Challenge
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl bg-text-primary py-3 text-xs font-semibold text-bg-secondary hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-premium"
              >
                Return to Workspace
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
