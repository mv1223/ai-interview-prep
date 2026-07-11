/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const MOCK_OPTIMIZATIONS = [
  {
    id: 'opt-1',
    section: 'Experience (Vercel)',
    original: 'Helped in building frontend components for the Vercel dashboard and speeded up page loading times.',
    optimized: 'Engineered high-performance React components for Vercel Dashboard, resulting in a 27% reduction in Time-to-Interactive (TTI) and improving overall lighthouse scores.',
    impact: 'Increased ATS compatibility by adding action verbs (Engineered, Reduced) and quantifiable metrics (27% reduction).',
    applied: false,
  },
  {
    id: 'opt-2',
    section: 'Experience (Vercel)',
    original: 'Wrote some unit tests for our hooks and API layer.',
    optimized: 'Implemented comprehensive test suites using Vitest and React Testing Library, expanding test coverage from 60% to 94% and eliminating production crash regressions.',
    impact: 'Replaced vague phrasing ("wrote some tests") with precise frameworks (Vitest, React Testing Library) and specific test coverage figures (94%).',
    applied: false,
  },
  {
    id: 'opt-3',
    section: 'Skills Summary',
    original: 'Experienced in CSS, HTML, JS, React, and Git.',
    optimized: 'React, Next.js, TypeScript, Tailwind CSS, State Management (Zustand/Redux), CI/CD, Git Version Control.',
    impact: 'Replaced outdated skill keywords with high-demand ATS-indexed keywords (Next.js, TypeScript, Tailwind CSS, Zustand).',
    applied: false,
  }
];

export function ResumeProvider({ children }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [fileName, setFileName] = useState(null);
  const [optimizations, setOptimizations] = useState([]);

  const uploadResume = (file) => {
    setIsAnalyzing(true);
    setFileName(file.name);
    
    // Simulate analyzing file...
    setTimeout(() => {
      setAtsScore(74); // New start score
      setOptimizations(MOCK_OPTIMIZATIONS.map(opt => ({ ...opt, applied: false })));
      setIsAnalyzing(false);
    }, 2000);
  };

  const applyOptimization = (id) => {
    setOptimizations((prev) => 
      prev.map((opt) => {
        if (opt.id === id) {
          if (!opt.applied) {
            // Add to ATS score when optimization is applied!
            setAtsScore(score => Math.min(score + 8, 100));
          }
          return { ...opt, applied: true };
        }
        return opt;
      })
    );
  };

  const resetResume = () => {
    setAtsScore(0);
    setFileName(null);
    setOptimizations([]);
  };

  const loadDemoResume = () => {
    setAtsScore(74);
    setFileName('Sarah_Connor_Resume_Draft.pdf');
    setOptimizations(MOCK_OPTIMIZATIONS.map(opt => ({ ...opt, applied: false })));
  };

  return (
    <ResumeContext.Provider value={{
      isAnalyzing,
      atsScore,
      fileName,
      optimizations,
      uploadResume,
      applyOptimization,
      resetResume,
      loadDemoResume,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
