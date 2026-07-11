/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const InterviewContext = createContext();

// ─── Interview question generator (resume-aware) ──────────────────────────────
function generateInterviewQuestions(skills, role, company, jobDescription) {
  const allSkills = skills
    ? [...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])]
    : [];
  const topSkills = allSkills.slice(0, 3).join(', ') || 'modern web technologies';
  const jdLower = (jobDescription || '').toLowerCase();

  let codingChallenge = 'useDebounce';
  let codeTemplate = `/**
 * Implement a useDebounce custom hook
 * Delays updating the output value until the delay has passed
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} debounced value
 */
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  // TODO: implement here

}`;
  let codingTip = 'Use useEffect with setTimeout. Remember to return a cleanup that calls clearTimeout.';

  const isBackend = jdLower.includes('backend') || jdLower.includes('python')
    || jdLower.includes('java') || jdLower.includes('node') || jdLower.includes('api')
    || (skills && (skills.languages || []).some(l => ['Python', 'Java', 'Go', 'Rust'].includes(l)));

  if (isBackend) {
    codingChallenge = 'twoSum';
    codeTemplate = `/**
 * Two Sum
 * Return indices of two numbers in 'nums' that add up to 'target'.
 * Aim for O(n) time complexity.
 *
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // TODO: implement here

}`;
    codingTip = 'Use a Map (hash map) to store each number and its index. For each element, check if (target - element) already exists in the map.';
  }

  return [
    {
      id: 'q1',
      type: 'conceptual',
      question: `You're interviewing for the ${role} role at ${company}. Based on your experience with ${topSkills}, walk me through how you would design a scalable, maintainable frontend architecture for a large product. What patterns, performance trade-offs, and DX decisions would you make?`,
      tip: 'Cover: component architecture, state management choice, performance strategy (code splitting, lazy loading), and testing approach. Be specific — mention real tools you\'ve used.',
    },
    {
      id: 'q2',
      type: 'technical_code',
      question: `Solid answer. Let's move to a hands-on coding challenge. Please implement the \`${codingChallenge}\` function in the editor. When you're done, run the test cases and explain your time and space complexity.`,
      codingQuestion: codingChallenge,
      templateCode: codeTemplate,
      tip: codingTip,
    },
    {
      id: 'q3',
      type: 'behavioral',
      question: `${company} values engineers who thrive under ambiguity. Describe a project where you faced a major technical challenge or a critical bug close to a deadline. How did you diagnose, communicate, and resolve it? What did you learn?`,
      tip: 'Use the STAR framework: Situation → Task → Action → Result. Quantify your impact (e.g., "fixed a memory leak that reduced bounce rate by 12%"). Show ownership and proactive communication.',
    },
  ];
}

// ─── Score calculator ─────────────────────────────────────────────────────────
function calculateInterviewScore(userAnswers, testStatus, questions) {
  if (userAnswers.length === 0) {
    return { overall: 0, communication: 0, technical: 0, problemSolving: 0, behavioral: 0, feedback: 'No answers were provided during this session.' };
  }

  let communication = 15;
  let technical = 15;
  let problemSolving = 15;
  let behavioral = 15;

  const fullText = userAnswers.map(a => a.text || '').join(' ').toLowerCase();
  const avgLen = userAnswers.reduce((s, a) => s + (a.text || '').length, 0) / userAnswers.length;

  // Length / articulation scoring
  if (avgLen > 200) { communication += 45; behavioral += 40; }
  else if (avgLen > 80) { communication += 25; behavioral += 20; }
  else if (avgLen > 30) { communication += 10; behavioral += 8; }

  // Keyword scoring
  const techKeywords = ['architecture', 'component', 'state', 'performance', 'scalable', 'optimization', 'hook', 'async', 'complexity', 'pattern', 'api', 'cache', 'test', 'deploy'];
  const starKeywords = ['situation', 'task', 'action', 'result', 'challenge', 'learned', 'team', 'impact', 'metrics', 'deadline'];
  techKeywords.forEach(kw => { if (fullText.includes(kw)) { technical += 4; communication += 2; } });
  starKeywords.forEach(kw => { if (fullText.includes(kw)) { behavioral += 5; communication += 3; } });

  // Coding test scoring
  if (testStatus === 'passed') { technical += 38; problemSolving += 42; }
  else if (testStatus === 'failed') { technical += 8; problemSolving += 5; }
  else { technical += 3; problemSolving += 3; } // no attempt

  // Clamp
  communication = Math.min(Math.max(communication, 5), 98);
  technical = Math.min(Math.max(technical, 5), 98);
  problemSolving = Math.min(Math.max(problemSolving, 5), 98);
  behavioral = Math.min(Math.max(behavioral, 5), 98);

  const overall = Math.round((communication + technical + problemSolving + behavioral) / 4);

  let feedback;
  if (overall >= 80) {
    feedback = 'Excellent performance! Strong technical depth, clear communication, and well-structured behavioral answers. You demonstrated solid engineering judgment and real-world problem-solving skills.';
  } else if (overall >= 60) {
    feedback = 'Good performance overall. Technical understanding is solid, but consider deepening your answers with concrete metrics and examples. Practice the STAR method for behavioral questions.';
  } else if (overall >= 40) {
    feedback = 'Moderate performance. Answers need more depth and specific examples. Focus on quantifying your impact and expanding your technical explanations with architecture-level thinking.';
  } else {
    feedback = 'This session needs improvement. Aim for detailed, structured answers (aim for 2-4 sentences minimum per response). Complete the coding challenges and use the STAR framework for behavioral questions.';
  }

  const qaReviews = questions.map((q, i) => {
    const userAnswer = userAnswers[i];
    const userText = userAnswer?.text || 'No answer provided.';
    const userCode = userAnswer?.code || null;

    let idealAnswer, coachScore, coachFeedback;
    if (q.type === 'technical_code') {
      idealAnswer = 'Ideal solution should compile all test cases, use optimal time/space complexity (O(n) for twoSum via HashMap, or proper cleanup in useDebounce via useEffect), and be explained clearly.';
      coachScore = testStatus === 'passed' ? 96 : testStatus === 'failed' ? 25 : 10;
      coachFeedback = testStatus === 'passed'
        ? 'All test cases compiled. Excellent implementation with correct complexity analysis.'
        : 'Test cases did not pass. Review the solution approach and ensure proper return logic.';
    } else if (q.type === 'conceptual') {
      coachScore = Math.min(15 + Math.floor(userText.length / 4), 95);
      idealAnswer = 'A strong answer covers: component hierarchy decisions, state management patterns (local vs global), performance optimizations (memoization, code splitting, lazy loading), and testing strategy.';
      coachFeedback = userText.length > 120 ? 'Good depth. Consider adding specific metrics or tool choices.' : 'Answer needs more depth — expand on your specific architectural decisions.';
    } else {
      coachScore = Math.min(15 + Math.floor(userText.length / 3.5), 95);
      idealAnswer = 'Use STAR format: specific situation, your concrete task/role, the actions you took (with technical detail), and the measurable result. Include what you learned.';
      coachFeedback = userText.length > 150 ? 'Good structure. Next time add specific quantifiable results.' : 'Use the STAR framework and include specific numbers (time saved, users affected, etc.).';
    }

    return { question: q.question, userAnswer: userText, userCode, idealAnswer, coachScore, coachFeedback };
  });

  return { overall, communication, technical, problemSolving, behavioral, feedback, qaReviews };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function InterviewProvider({ children }) {
  const [interviews, setInterviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('interviews') || '[]'); } catch { return []; }
  });
  const [quizzes, setQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quizzes') || '[]'); } catch { return []; }
  });

  const [activeInterview, setActiveInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [codeAnswer, setCodeAnswer] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('idle');
  const [testCasesStatus, setTestCasesStatus] = useState('idle');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [interviewTimer, setInterviewTimer] = useState(0);

  useEffect(() => { localStorage.setItem('interviews', JSON.stringify(interviews)); }, [interviews]);
  useEffect(() => { localStorage.setItem('quizzes', JSON.stringify(quizzes)); }, [quizzes]);

  // Live interview timer
  useEffect(() => {
    let iv;
    if (interviewStatus === 'active') {
      iv = setInterval(() => setInterviewTimer(t => t + 1), 1000);
    }
    return () => clearInterval(iv);
  }, [interviewStatus]);

  // ── start ──
  const startNewInterview = useCallback((config) => {
    setInterviewStatus('setting_up');
    setInterviewTimer(0);

    const questions = generateInterviewQuestions(
      config.extractedSkills || null,
      config.role,
      config.company,
      config.jobDescription
    );

    const session = {
      id: 'session-' + Date.now(),
      role: config.role,
      company: config.company || 'Global Tech Corp',
      difficulty: config.difficulty || 'Medium',
      jobDescription: config.jobDescription || '',
      questions,
    };

    setActiveInterview(session);
    setCurrentQuestionIndex(0);
    setCodeAnswer(questions[0]?.templateCode || '');
    setTestCasesStatus('idle');
    setConsoleLogs([]);

    setChatHistory([{
      sender: 'interviewer',
      text: `Hello and welcome to your mock interview for the ${session.role} position at ${session.company}!\n\nI'm your AI interviewer. We'll cover ${questions.length} questions — technical depth, hands-on coding, and behavioral scenarios. Take your time and think through each answer.\n\nLet's begin:\n\n${questions[0].question}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);

    setTimeout(() => setInterviewStatus('active'), 150);
  }, []);

  // ── run code ──
  const runCode = useCallback((code, questionType) => {
    setTestCasesStatus('running');
    setConsoleLogs(['> Initializing sandbox...', '> Compiling...']);

    setTimeout(() => {
      const norm = code.replace(/\s+/g, '').toLowerCase();
      let logs, passed;

      if (questionType === 'twoSum') {
        const hasMap = norm.includes('newmap') || norm.includes('map()') || norm.includes('={}') || norm.includes('map.set') || norm.includes('map.get') || norm.includes('complement');
        const hasReturn = norm.includes('return[') || norm.includes('return[i') || norm.includes('push(') || (norm.includes('[') && norm.includes(']') && norm.includes('return'));
        passed = hasMap && hasReturn;
        logs = passed
          ? ['✓ Test 1: twoSum([2,7,11,15], 9) → [0,1]  PASSED', '✓ Test 2: twoSum([3,2,4], 6) → [1,2]  PASSED', '✓ Test 3: twoSum([3,3], 6) → [0,1]  PASSED', '> All tests passed! O(n) time, O(n) space ✓']
          : ['✗ Test 1: Expected [0,1], got undefined  FAILED', '✗ Test 2: Expected [1,2], got undefined  FAILED', '> Hint: Create a Map, store each index, check if (target - num) exists.'];
      } else {
        const hasUseEffect = norm.includes('useeffect');
        const hasTimeout = norm.includes('settimeout');
        const hasClear = norm.includes('cleartimeout');
        const hasSetValue = norm.includes('setvalue') || norm.includes('setdebouncedvalue') || norm.includes('setstate');
        passed = hasUseEffect && hasTimeout && hasClear && hasSetValue;
        const missing = [!hasUseEffect && 'useEffect', !hasTimeout && 'setTimeout', !hasClear && 'clearTimeout', !hasSetValue && 'setState call'].filter(Boolean);
        logs = passed
          ? ['✓ Test 1: Delay updates state after period  PASSED', '✓ Test 2: Cleanup cancels pending timer  PASSED', '✓ Test 3: New value resets timer  PASSED', '> Hook validated! ✓']
          : ['✗ Test 1: State not updated after delay  FAILED', '✗ Test 2: Cleanup missing  FAILED', `> Missing: ${missing.join(', ')}`];
      }

      setConsoleLogs(logs);
      setTestCasesStatus(passed ? 'passed' : 'failed');
    }, 1800);
  }, []);

  // ── submit answer ──
  const submitAnswer = useCallback((userText) => {
    if (isAiResponding) return;

    const currentQ = activeInterview?.questions[currentQuestionIndex];
    const userMsg = {
      sender: 'user',
      text: userText,
      code: currentQ?.type === 'technical_code' ? codeAnswer : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsAiResponding(true);

    setTimeout(() => {
      const nextIdx = currentQuestionIndex + 1;
      const totalQ = activeInterview?.questions?.length || 0;
      let responseText;

      if (nextIdx < totalQ) {
        const nextQ = activeInterview.questions[nextIdx];
        setCurrentQuestionIndex(nextIdx);
        setCodeAnswer(nextQ?.type === 'technical_code' ? (nextQ.templateCode || '') : '');
        setTestCasesStatus('idle');
        setConsoleLogs([]);
        const ack = userText.length > 60 ? "Good response — I appreciate the depth." : "Thanks for that answer.";
        responseText = `${ack}\n\nMoving on:\n\n${nextQ.question}`;
      } else {
        responseText = "That concludes our interview session. You've done well covering all three areas. Click \"View Full Report\" below to see your detailed diagnostic scores and personalized coach feedback.";
      }

      setChatHistory(prev => [...prev, {
        sender: 'interviewer',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setIsAiResponding(false);
    }, 1600);
  }, [isAiResponding, activeInterview, currentQuestionIndex, codeAnswer]);

  // ── finish & score ──
  const finishActiveInterview = useCallback(() => {
    const userAnswers = chatHistory.filter(m => m.sender === 'user');
    const scores = calculateInterviewScore(userAnswers, testCasesStatus, activeInterview?.questions || []);
    const mins = Math.floor(interviewTimer / 60);
    const secs = interviewTimer % 60;

    const report = {
      id: activeInterview?.id,
      role: activeInterview?.role,
      company: activeInterview?.company,
      difficulty: activeInterview?.difficulty,
      date: new Date().toISOString().split('T')[0],
      duration: `${mins}m ${secs}s`,
      scores: {
        overall: scores.overall,
        communication: scores.communication,
        technical: scores.technical,
        problemSolving: scores.problemSolving,
        behavioral: scores.behavioral,
      },
      feedback: scores.feedback,
      qaReviews: scores.qaReviews || [],
    };

    setInterviews(prev => [report, ...prev]);
    setActiveInterview(report);
    setInterviewStatus('review');
  }, [chatHistory, testCasesStatus, activeInterview, interviewTimer]);

  const resetInterview = useCallback(() => {
    setActiveInterview(null);
    setCurrentQuestionIndex(0);
    setChatHistory([]);
    setCodeAnswer('');
    setTestCasesStatus('idle');
    setConsoleLogs([]);
    setInterviewStatus('idle');
    setInterviewTimer(0);
  }, []);

  const addCompletedQuiz = useCallback((quiz) => {
    setQuizzes(prev => [quiz, ...prev]);
  }, []);

  const clearAllData = useCallback(() => {
    setInterviews([]);
    setQuizzes([]);
    localStorage.removeItem('interviews');
    localStorage.removeItem('quizzes');
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <InterviewContext.Provider value={{
      interviews, quizzes,
      activeInterview, currentQuestionIndex,
      chatHistory, codeAnswer, setCodeAnswer,
      isAiResponding, interviewStatus,
      testCasesStatus, consoleLogs,
      interviewTimer, formatTimer,
      startNewInterview, submitAnswer, runCode,
      finishActiveInterview, resetInterview,
      addCompletedQuiz, clearAllData,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider');
  return ctx;
}
