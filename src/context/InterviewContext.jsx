/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const InterviewContext = createContext();



export function InterviewProvider({ children }) {
  const [interviews, setInterviews] = useState(() => {
    const saved = localStorage.getItem('interviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeInterview, setActiveInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [codeAnswer, setCodeAnswer] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('idle'); // 'idle' | 'setting_up' | 'active' | 'review'

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  const startNewInterview = (config) => {
    setInterviewStatus('setting_up');
    
    // Define questions based on role
    let questions;
    if (config.role.includes('React') || config.role.includes('Frontend') || config.role.includes('UI')) {
      questions = [
        {
          id: 'q1',
          question: "Can you explain how React 19 Server Actions work, and how they differ from standard client-side API requests using state handlers?",
          type: 'behavioral',
          tip: "Focus on how server actions integrate with forms, the useActionState hook, and benefits like automatic pending states and progressive enhancement."
        },
        {
          id: 'q2',
          question: "Write a custom React hook `useDebounce` that delays updating a state value. Explain how your cleanup mechanism prevents race conditions and memory leaks.",
          type: 'technical_code',
          templateCode: `/**
 * Custom React Hook: useDebounce
 * Complete the hook below:
 */
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  // Your code here
  
}`,
          tip: "Think about useEffect, setTimeout, and returning a cleanup function that calls clearTimeout when the value or delay changes."
        },
        {
          id: 'q3',
          question: "Tell me about a time you had to optimize a slow React application. What profiling tools did you use, what bottlenecks did you discover, and how did you resolve them?",
          type: 'behavioral',
          tip: "Structure your response using the STAR method. Mention React DevTools, Profiler, Flamegraphs, Bundle Analyzer, useMemo, dynamic imports, or virtualization."
        }
      ];
    } else {
      questions = [
        {
          id: 'q1',
          question: "What is your approach to system architecture when designing high-throughput, low-latency microservices?",
          type: 'behavioral',
          tip: "Discuss load balancers, caching layers, database indexing, message queues, and API gateways."
        },
        {
          id: 'q2',
          question: "Implement a function `twoSum` that takes an array of integers and a target sum, returning the indices of the two elements that add up to target.",
          type: 'technical_code',
          templateCode: `/**
 * Two Sum Solution
 * Output indices of elements that sum up to target.
 */
function twoSum(nums, target) {
  // Your code here
  
}`,
          tip: "A hashmap provides O(N) time complexity. Iterate through the array and store the complement value along with its index."
        },
        {
          id: 'q3',
          question: "Describe a situation where you had a disagreement with your product manager regarding the technical scope of a feature. How did you negotiate and reach a resolution?",
          type: 'behavioral',
          tip: "Keep it professional. Focus on data-driven arguments, understanding business objectives, trade-offs, and collaborative compromise."
        }
      ];
    }

    const newSession = {
      id: 'session-' + Date.now(),
      role: config.role,
      company: config.company,
      difficulty: config.difficulty || 'Medium',
      questions,
    };

    setActiveInterview(newSession);
    setCurrentQuestionIndex(0);
    setCodeAnswer(questions[0].type === 'technical_code' ? questions[0].templateCode : '');
    
    // AI Recruiter opening statement
    const openingMsg = {
      sender: 'interviewer',
      text: `Hello! Welcome to your simulated interview for the ${config.role} position here at ${config.company}. I'm your AI recruiter today. We'll go through ${questions.length} questions, covering both conceptual knowledge and coding. Let's get started with the first question: ${questions[0].question}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory([openingMsg]);
    setInterviewStatus('active');
  };

  const submitAnswer = (userText) => {
    if (isAiResponding) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      sender: 'user',
      text: userText,
      code: activeInterview.questions[currentQuestionIndex].type === 'technical_code' ? codeAnswer : null,
      timestamp,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Simulate AI recruiter processing and moving to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      let nextMsgText = '';

      if (nextIndex < activeInterview.questions.length) {
        const nextQuestion = activeInterview.questions[nextIndex];
        setCurrentQuestionIndex(nextIndex);
        setCodeAnswer(nextQuestion.type === 'technical_code' ? nextQuestion.templateCode : '');
        nextMsgText = `Thank you for sharing. That's a helpful perspective. Let's move on to the next question. Here it is: ${nextQuestion.question}`;
      } else {
        nextMsgText = `Thank you! That concludes our questions. I will now process your responses and compile your feedback report. Please click 'View Report' below.`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'interviewer',
          text: nextMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiResponding(false);
    }, 1500);
  };

  const finishActiveInterview = () => {
    // Generate simulated scores based on chat answers length and role difficulty
    const finalScores = {
      overall: Math.floor(Math.random() * (96 - 80 + 1)) + 80,
      communication: Math.floor(Math.random() * (98 - 78 + 1)) + 78,
      technical: Math.floor(Math.random() * (96 - 82 + 1)) + 82,
      problemSolving: Math.floor(Math.random() * (95 - 75 + 1)) + 75,
      behavioral: Math.floor(Math.random() * (98 - 80 + 1)) + 80,
    };

    const finalReport = {
      id: activeInterview.id,
      role: activeInterview.role,
      company: activeInterview.company,
      difficulty: activeInterview.difficulty,
      date: new Date().toISOString().split('T')[0],
      duration: '35 mins',
      scores: finalScores,
      feedback: `Strong performance overall during the interview for ${activeInterview.company}. Demonstrates crisp articulation and high technical competency in core roles. Coding exercises were well-structured. For improvement: expand on architectural scalability trade-offs in early system answers.`,
      // Add questions review
      qaReviews: activeInterview.questions.map((q, idx) => {
        const userAnswer = chatHistory.filter(c => c.sender === 'user')[idx];
        return {
          question: q.question,
          userAnswer: userAnswer ? userAnswer.text : 'N/A',
          userCode: userAnswer ? userAnswer.code : null,
          idealAnswer: q.type === 'technical_code' 
            ? `Ideal solution should demonstrate correct logic, optimal time/space complexity (e.g. O(N) using HashMap for twoSum, clean cleanup in useDebounce), and clear comments.`
            : `A model response should structure points using the STAR methodology (Situation, Task, Action, Result), providing specific metrics of success and outlining the technologies clearly.`,
          coachScore: Math.floor(Math.random() * (98 - 80 + 1)) + 80,
          coachFeedback: `The candidate showed good conceptual understanding. A recommended addition would be highlighting edge-cases (like network timeouts or stale state updates) and detailing the exact debugging toolchain used.`
        };
      })
    };

    setInterviews((prev) => [finalReport, ...prev]);
    setActiveInterview(finalReport); // Replace activeInterview with the evaluated report version
    setInterviewStatus('review');
  };

  const resetInterview = () => {
    setActiveInterview(null);
    setCurrentQuestionIndex(0);
    setChatHistory([]);
    setCodeAnswer('');
    setInterviewStatus('idle');
  };

  return (
    <InterviewContext.Provider value={{
      interviews,
      activeInterview,
      currentQuestionIndex,
      chatHistory,
      codeAnswer,
      setCodeAnswer,
      isAiResponding,
      interviewStatus,
      startNewInterview,
      submitAnswer,
      finishActiveInterview,
      resetInterview,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
