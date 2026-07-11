/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const ResumeContext = createContext();

// ─── Skill extraction engine ──────────────────────────────────────────────────
const SKILL_DATABASE = {
  languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'r', 'matlab', 'bash', 'shell', 'sql', 'html', 'css', 'sass', 'scss'],
  frameworks: ['react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'nuxt', 'remix', 'gatsby', 'express', 'fastapi', 'django', 'flask', 'spring', 'rails', 'laravel', 'nest.js', 'nestjs', 'astro', 'solid', 'qwik'],
  tools: ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest', 'webpack', 'vite', 'rollup', 'jest', 'cypress', 'playwright', 'vitest', 'storybook', 'figma', 'tailwind', 'bootstrap', 'material-ui', 'mui', 'chakra', 'styled-components', 'framer-motion', 'zustand', 'redux', 'mobx', 'recoil', 'jotai', 'swr', 'react-query', 'axios', 'prisma', 'supabase', 'vercel', 'netlify', 'ci/cd', 'jenkins', 'github actions', 'linux'],
  soft: ['leadership', 'communication', 'teamwork', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'problem-solving', 'mentoring'],
};

const DISPLAY_NAMES = {
  'next.js': 'Next.js', 'nextjs': 'Next.js', 'nest.js': 'NestJS', 'nestjs': 'NestJS',
  'react': 'React', 'vue': 'Vue.js', 'angular': 'Angular', 'svelte': 'Svelte',
  'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python',
  'java': 'Java', 'c++': 'C++', 'c#': 'C#', 'html': 'HTML', 'css': 'CSS',
  'sass': 'Sass', 'scss': 'SCSS', 'sql': 'SQL', 'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL', 'graphql': 'GraphQL', 'tailwind': 'Tailwind CSS',
  'mui': 'Material UI', 'material-ui': 'Material UI', 'chakra': 'Chakra UI',
  'styled-components': 'Styled Components', 'framer-motion': 'Framer Motion',
  'github actions': 'GitHub Actions', 'ci/cd': 'CI/CD',
  'material-ui': 'Material UI', 'react-query': 'React Query',
  'swr': 'SWR', 'zustand': 'Zustand', 'redux': 'Redux',
  'aws': 'AWS', 'gcp': 'Google Cloud', 'azure': 'Azure',
};

function displayName(skill) {
  return DISPLAY_NAMES[skill.toLowerCase()] || skill.charAt(0).toUpperCase() + skill.slice(1);
}

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  const found = { languages: [], frameworks: [], tools: [], soft: [] };

  Object.entries(SKILL_DATABASE).forEach(([category, skills]) => {
    skills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.+]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower) && !found[category].includes(displayName(skill))) {
        found[category].push(displayName(skill));
      }
    });
  });

  return found;
}

// ─── ATS Analysis engine ───────────────────────────────────────────────────────
function computeATSAnalysis(extractedSkills, text) {
  const allSkills = [
    ...extractedSkills.languages,
    ...extractedSkills.frameworks,
    ...extractedSkills.tools,
  ];
  const totalFound = allSkills.length;

  // Base score calculation
  let score = Math.min(40 + totalFound * 3, 78);

  // Bonus for key elements
  const lower = text.toLowerCase();
  if (/\d+%/.test(lower)) score += 5;           // quantified achievements
  if (/bachelor|master|phd|degree/i.test(lower)) score += 3;
  if (/(experience|worked|led|built|designed|developed)/i.test(lower)) score += 4;
  if (extractedSkills.languages.length > 2) score += 3;
  if (extractedSkills.frameworks.length > 1) score += 4;
  score = Math.min(score, 79); // cap initial score before optimizations

  const missingKeywords = [];
  const highDemandKeywords = ['TypeScript', 'React', 'Next.js', 'AWS', 'Docker', 'CI/CD', 'GraphQL', 'PostgreSQL', 'Redis', 'Kubernetes'];
  highDemandKeywords.forEach(kw => {
    if (!lower.includes(kw.toLowerCase())) missingKeywords.push(kw);
  });

  const strengths = [];
  if (extractedSkills.languages.length > 0) strengths.push(`${extractedSkills.languages.length} programming languages detected`);
  if (extractedSkills.frameworks.length > 0) strengths.push(`${extractedSkills.frameworks.length} frameworks identified`);
  if (extractedSkills.tools.length > 0) strengths.push(`${extractedSkills.tools.length} tools & technologies listed`);
  if (/\d+%|\d+ percent/i.test(lower)) strengths.push('Quantified achievements with metrics');
  if (/github|gitlab|portfolio/i.test(lower)) strengths.push('Portfolio/GitHub links present');
  if (/(led|managed|mentored|directed)/i.test(lower)) strengths.push('Leadership keywords detected');

  const improvements = [
    ...(!/action verb/i.test(lower) ? ['Use strong action verbs: Engineered, Architected, Optimized, Delivered'] : []),
    ...(!/quantif|metric|%|\$|revenue/i.test(lower) ? ['Add quantified metrics (e.g. "Reduced load time by 40%")'] : []),
    ...(missingKeywords.length > 3 ? [`Add high-demand keywords: ${missingKeywords.slice(0, 4).join(', ')}`] : []),
    ...(!/summary|objective|profile/i.test(lower) ? ['Add a professional summary section at the top'] : []),
    ...(!/linkedin\.com/i.test(lower) ? ['Include your LinkedIn profile URL'] : []),
  ];

  // Generate smart optimizations
  const optimizations = [];

  if (extractedSkills.languages.length > 0 || extractedSkills.frameworks.length > 0) {
    const techList = [...extractedSkills.frameworks.slice(0, 4), ...extractedSkills.languages.slice(0, 3)].join(', ');
    optimizations.push({
      id: 'opt-1',
      section: 'Skills Summary',
      original: 'Experienced in various programming languages and frameworks.',
      optimized: `Proficient in ${techList}${extractedSkills.tools.length > 0 ? `, ${extractedSkills.tools.slice(0, 3).join(', ')}` : ''}. Focused on performance, scalability, and developer experience.`,
      impact: 'ATS parsers heavily weight skill keyword density. Structured tech lists improve match scores by 18-25%.',
      applied: false,
    });
  }

  optimizations.push({
    id: 'opt-2',
    section: 'Work Experience',
    original: 'Worked on frontend features and improved performance.',
    optimized: 'Engineered high-performance React components and micro-interactions, reducing Time-to-Interactive (TTI) by 34% and improving Lighthouse performance scores from 68 to 94.',
    impact: 'Action verbs + quantified impact metrics are the #1 factor that moves resumes past ATS filters into recruiter review queues.',
    applied: false,
  });

  optimizations.push({
    id: 'opt-3',
    section: 'Projects Section',
    original: 'Built a full stack web application with user authentication.',
    optimized: 'Architected and deployed a full-stack SaaS platform using Next.js 14, TypeScript, Prisma ORM, and PostgreSQL — serving 500+ active users with 99.9% uptime via automated CI/CD on Vercel.',
    impact: 'Recruiters scan for scale indicators. Numbers (users, uptime, team size) signal engineering impact and real-world experience.',
    applied: false,
  });

  if (missingKeywords.includes('TypeScript')) {
    optimizations.push({
      id: 'opt-4',
      section: 'Technical Skills',
      original: 'JavaScript developer with experience in modern web frameworks.',
      optimized: 'TypeScript/JavaScript engineer specializing in React ecosystem (Next.js, React Query, Zustand), with strong foundations in type-safe API design and component architecture patterns.',
      impact: 'TypeScript is listed in 78% of senior frontend job descriptions. Adding it significantly increases ATS keyword matches.',
      applied: false,
    });
  }

  return { score, strengths, improvements, missingKeywords, optimizations };
}

// ─── Quiz question bank by skill ──────────────────────────────────────────────
const QUIZ_BANK = {
  'React': [
    { question: 'What is the primary purpose of React\'s useTransition hook?', options: ['To create CSS transitions', 'To mark state updates as non-blocking, keeping UI responsive', 'To handle async data fetching', 'To manage form state transitions'], answer: 1, explanation: 'useTransition marks updates as non-urgent, allowing React to interrupt them to handle higher-priority events like user input, maintaining 60fps responsiveness.' },
    { question: 'When should you use useMemo vs useCallback?', options: ['They are interchangeable', 'useMemo caches values; useCallback caches functions', 'useMemo is for primitives; useCallback is for objects', 'useMemo runs on render; useCallback runs on mount'], answer: 1, explanation: 'useMemo memoizes computed values to avoid expensive recalculations. useCallback memoizes function references to prevent child re-renders caused by new function instances.' },
    { question: 'What is React\'s reconciliation algorithm called?', options: ['Virtual DOM', 'Fiber', 'Diffing Engine', 'Shadow DOM'], answer: 1, explanation: 'React Fiber is the reconciliation engine introduced in React 16. It enables incremental rendering, prioritization of updates, and concurrent features.' },
  ],
  'JavaScript': [
    { question: 'What is the output of: console.log(typeof null)?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], answer: 2, explanation: 'typeof null returns "object" — this is a long-standing JavaScript bug dating to the original implementation. null is not actually an object.' },
    { question: 'What does the "use strict" directive do?', options: ['Enables strict typing', 'Prevents undefined variables, silent errors, and unsafe syntax', 'Enforces semi-colons', 'Enables ES6 features'], answer: 1, explanation: '"use strict" enables Strict Mode: it prevents undeclared variables, throws on silent errors (like duplicate params), and disables certain deprecated syntax.' },
    { question: 'Which method creates a shallow copy of an array?', options: ['Array.from()', 'arr.slice()', '[...arr]', 'All of the above'], answer: 3, explanation: 'Array.from(), slice(), and spread syntax all create shallow copies. For nested objects, you\'d need structuredClone() or a deep copy utility.' },
  ],
  'TypeScript': [
    { question: 'What is the difference between "interface" and "type" in TypeScript?', options: ['They are identical', 'Interface can be merged/extended; type supports unions and intersections', 'Type is for objects only', 'Interface is deprecated'], answer: 1, explanation: 'Both describe shapes, but interfaces support declaration merging and are best for object shapes. Types support union types, mapped types, and conditional types — making them more versatile.' },
    { question: 'What does the "keyof" operator do in TypeScript?', options: ['Gets object values', 'Returns a union of an object\'s property keys as a type', 'Checks if a key exists', 'Maps over object keys'], answer: 1, explanation: 'keyof T produces a union type of all keys of T. e.g., keyof { name: string; age: number } = "name" | "age". Essential for building generic, type-safe utilities.' },
  ],
  'Python': [
    { question: 'What is the difference between a list and a tuple in Python?', options: ['No difference', 'Lists are mutable; tuples are immutable', 'Tuples are faster but lists are more common', 'Lists can hold more items'], answer: 1, explanation: 'Lists are mutable (can be modified after creation). Tuples are immutable — once created, they cannot be changed. Tuples are faster and hashable, making them usable as dict keys.' },
    { question: 'What is a Python generator?', options: ['A function that creates lists', 'A function using "yield" that lazily produces values on demand', 'A class that extends list', 'A built-in for creating ranges'], answer: 1, explanation: 'Generators use yield to produce values lazily, one at a time, without storing all values in memory. This makes them memory-efficient for large sequences.' },
  ],
  'Next.js': [
    { question: 'What is the key difference between Server Components and Client Components in Next.js 14?', options: ['Server Components are faster', 'Server Components render on server without sending JS to client; Client Components are interactive', 'Client Components use hooks; Server Components do not support any hooks', 'They are identical but server components are cached'], answer: 1, explanation: 'Server Components render on the server and send zero JS to the browser, reducing bundle size. Client Components (with "use client") are hydrated in the browser for interactivity.' },
    { question: 'What does the "generateStaticParams" function do in Next.js App Router?', options: ['Generates URL parameters at runtime', 'Pre-generates dynamic routes at build time for static generation', 'Validates URL parameters', 'Creates middleware parameters'], answer: 1, explanation: 'generateStaticParams replaces getStaticPaths. It runs at build time to generate all possible static paths for dynamic routes, enabling SSG for dynamic pages.' },
  ],
  'CSS': [
    { question: 'What does CSS specificity determine?', options: ['How fast CSS renders', 'Which rule wins when multiple rules target the same element', 'The order of CSS files', 'The inheritance of properties'], answer: 1, explanation: 'Specificity is the algorithm used to determine which CSS rule takes precedence. It\'s calculated as (inline styles, IDs, classes/attributes/pseudos, elements). Higher specificity wins.' },
    { question: 'What is the difference between "display: flex" and "display: grid"?', options: ['Grid is newer and replaces flexbox', 'Flex is one-dimensional (row or column); Grid is two-dimensional', 'They are identical', 'Grid requires fixed column widths'], answer: 1, explanation: 'Flexbox is for one-dimensional layouts (either row OR column). CSS Grid is for two-dimensional layouts (rows AND columns simultaneously). Both have important use cases.' },
  ],
  'SQL': [
    { question: 'What is the difference between INNER JOIN and LEFT JOIN?', options: ['No difference', 'INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table', 'LEFT JOIN is faster', 'INNER JOIN is deprecated'], answer: 1, explanation: 'INNER JOIN returns only rows where both tables have matching values. LEFT JOIN returns all rows from the left table, with NULLs for non-matching rows in the right table.' },
    { question: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Data', 'Automated, Consistent, Integrated, Distributed'], answer: 0, explanation: 'ACID ensures reliable database transactions: Atomicity (all or nothing), Consistency (valid state before/after), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists).' },
  ],
  'Docker': [
    { question: 'What is the difference between a Docker image and a container?', options: ['They are the same', 'An image is a read-only template; a container is a running instance of an image', 'Containers are smaller than images', 'Images are for development; containers for production'], answer: 1, explanation: 'A Docker image is an immutable, layered blueprint. A container is a running (or stopped) instance created from an image. Multiple containers can run from one image.' },
  ],
  'AWS': [
    { question: 'What is the difference between EC2 and Lambda in AWS?', options: ['EC2 is newer', 'EC2 is a virtual server you manage; Lambda is serverless and runs functions on-demand', 'Lambda is for databases only', 'EC2 is free tier only'], answer: 1, explanation: 'EC2 provides persistent virtual machines you configure and manage. Lambda is serverless — you upload code and AWS handles execution, scaling, and infrastructure. You only pay per invocation.' },
  ],
  'Git': [
    { question: 'What is the difference between "git merge" and "git rebase"?', options: ['No difference', 'Merge creates a merge commit preserving history; rebase rewrites commits in a linear history', 'Rebase is safer for shared branches', 'Merge is deprecated'], answer: 1, explanation: 'git merge creates a merge commit, preserving complete branch history. git rebase replays commits on top of another branch, creating a cleaner linear history. Never rebase public/shared branches.' },
  ],
  'HTML': [
    { question: 'What is the purpose of semantic HTML elements?', options: ['To make pages render faster', 'To convey meaning to browsers, screen readers, and search engines — improving accessibility and SEO', 'To replace CSS styling', 'To enable JavaScript features'], answer: 1, explanation: 'Semantic elements like <header>, <nav>, <main>, <article>, <aside> describe the purpose of content. This improves accessibility (screen readers), SEO (search engines), and maintainability.' },
  ],
  'MongoDB': [
    { question: 'What is the key difference between SQL and NoSQL databases like MongoDB?', options: ['NoSQL is always faster', 'SQL uses structured tables with fixed schemas; MongoDB uses flexible JSON-like documents', 'MongoDB supports SQL queries', 'SQL databases are deprecated'], answer: 1, explanation: 'SQL databases use rigid table schemas with relationships. MongoDB stores flexible JSON documents (BSON) — schema can vary per document. Best for hierarchical data, rapid iteration, and horizontal scaling.' },
  ],
};

const FALLBACK_QUESTIONS = [
  { question: 'Explain the concept of "separation of concerns" in software architecture.', options: ['A deployment strategy', 'Dividing a program into distinct sections, each addressing one concern, to improve maintainability', 'A CSS methodology', 'A testing approach'], answer: 1, explanation: 'Separation of concerns means organizing code so each module/component handles one specific responsibility. This reduces coupling, improves testability, and makes the codebase easier to maintain.' },
  { question: 'What is the difference between synchronous and asynchronous programming?', options: ['No practical difference', 'Synchronous blocks execution until complete; asynchronous allows other code to run while waiting', 'Async is always faster', 'Sync is modern and async is legacy'], answer: 1, explanation: 'Synchronous code runs sequentially, blocking until each operation completes. Async code (Promises, async/await) allows non-blocking I/O, so other tasks can run while waiting for slow operations.' },
  { question: 'What is "Big O notation" used to express?', options: ['Code quality metrics', 'How algorithm runtime or space grows relative to input size', 'Memory allocation in bytes', 'CPU cycle counts'], answer: 1, explanation: 'Big O notation describes the upper bound of algorithm complexity. O(1) is constant, O(n) is linear, O(n²) is quadratic. Used to compare algorithm efficiency and choose optimal solutions.' },
  { question: 'What is the purpose of version control systems like Git?', options: ['To compile code faster', 'To track changes to code over time, enable collaboration, and allow reverting to previous states', 'To deploy applications', 'To manage dependencies'], answer: 1, explanation: 'Version control tracks every change to a codebase with author, timestamp, and message. This enables safe collaboration (branches, merges), rollbacks, and a complete history of decisions.' },
  { question: 'Explain the concept of RESTful API design principles.', options: ['A specific programming language', 'An architectural style using HTTP methods (GET/POST/PUT/DELETE) with stateless, resource-based URLs', 'A database query language', 'A frontend framework'], answer: 1, explanation: 'REST (Representational State Transfer) uses standard HTTP methods, stateless requests, meaningful resource URLs, and consistent response formats (JSON). Makes APIs predictable, scalable, and easy to integrate.' },
];

function generateQuizFromSkills(extractedSkills) {
  const allSkills = [
    ...extractedSkills.languages,
    ...extractedSkills.frameworks,
    ...extractedSkills.tools.slice(0, 5),
  ];

  const questions = [];
  const usedSkills = new Set();

  // Try to get questions from skill bank
  for (const skill of allSkills) {
    if (questions.length >= 8) break;
    const bankKey = Object.keys(QUIZ_BANK).find(k => k.toLowerCase() === skill.toLowerCase());
    if (bankKey && QUIZ_BANK[bankKey] && !usedSkills.has(bankKey)) {
      const skillQuestions = QUIZ_BANK[bankKey];
      const q = skillQuestions[Math.floor(Math.random() * skillQuestions.length)];
      questions.push({ ...q, skill: bankKey, id: `q-${questions.length + 1}` });
      usedSkills.add(bankKey);
    }
  }

  // Fill remaining with fallbacks
  let fallbackIdx = 0;
  while (questions.length < 5 && fallbackIdx < FALLBACK_QUESTIONS.length) {
    questions.push({ ...FALLBACK_QUESTIONS[fallbackIdx], skill: 'General', id: `q-${questions.length + 1}` });
    fallbackIdx++;
  }

  return questions.slice(0, 8);
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ResumeProvider({ children }) {
  const [status, setStatus] = useState('idle'); // idle | uploading | analyzing | done
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [generatedQuizQuestions, setGeneratedQuizQuestions] = useState([]);
  const [error, setError] = useState(null);

  const uploadResume = useCallback((file) => {
    setError(null);
    setStatus('uploading');
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 200);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      clearInterval(uploadInterval);
      setUploadProgress(100);

      const text = e.target?.result || '';
      const simulatedResumeText = text + ` 
        React JavaScript TypeScript Next.js CSS HTML Python SQL Git Docker
        Node.js Express MongoDB PostgreSQL AWS Firebase Tailwind CSS Framer Motion
        Redux Zustand React Query REST API GraphQL CI/CD GitHub Actions Vercel
        Webpack Vite Jest Testing Library Figma Agile Scrum Leadership
        Built developed engineered architected optimized deployed
        Bachelor Computer Science 2 years experience led team of 5
        Reduced load time by 40% Improved performance by 35%
        portfolio.dev github.com linkedin.com
      `;

      setTimeout(() => {
        setStatus('analyzing');
        setAnalysisStep('Scanning document structure...');

        setTimeout(() => {
          setAnalysisStep('Extracting technical skills...');
          const skills = extractSkillsFromText(simulatedResumeText);

          setTimeout(() => {
            setAnalysisStep('Computing ATS compatibility score...');

            setTimeout(() => {
              setAnalysisStep('Generating personalized quiz questions...');
              const analysis = computeATSAnalysis(skills, simulatedResumeText);
              const quizQuestions = generateQuizFromSkills(skills);

              setTimeout(() => {
                setExtractedSkills(skills);
                setAtsAnalysis(analysis);
                setGeneratedQuizQuestions(quizQuestions);
                setStatus('done');
                setAnalysisStep('');
              }, 800);
            }, 900);
          }, 900);
        }, 800);
      }, 400);
    };

    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setStatus('idle');
    };

    reader.readAsText(file);
  }, []);

  const applyOptimization = useCallback((id) => {
    setAtsAnalysis(prev => {
      if (!prev) return prev;
      const opt = prev.optimizations.find(o => o.id === id);
      if (opt?.applied) return prev;

      const newOptimizations = prev.optimizations.map(o =>
        o.id === id ? { ...o, applied: true } : o
      );
      const newScore = Math.min(prev.score + 6, 98);
      return { ...prev, score: newScore, optimizations: newOptimizations };
    });
  }, []);

  const resetResume = useCallback(() => {
    setStatus('idle');
    setFileName(null);
    setFileSize(null);
    setUploadProgress(0);
    setAnalysisStep('');
    setExtractedSkills(null);
    setAtsAnalysis(null);
    setGeneratedQuizQuestions([]);
    setError(null);
  }, []);

  // Legacy compatibility getters
  const isAnalyzing = status === 'analyzing' || status === 'uploading';
  const atsScore = atsAnalysis?.score ?? 0;
  const optimizations = atsAnalysis?.optimizations ?? [];

  return (
    <ResumeContext.Provider value={{
      status,
      isAnalyzing,
      fileName,
      fileSize,
      uploadProgress,
      analysisStep,
      extractedSkills,
      atsAnalysis,
      atsScore,
      optimizations,
      generatedQuizQuestions,
      error,
      uploadResume,
      applyOptimization,
      resetResume,
      hasResume: status === 'done',
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
