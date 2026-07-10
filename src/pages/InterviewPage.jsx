import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  IoPlayOutline, 
  IoCodeSlashOutline, 
  IoSparklesOutline, 
  IoEyeOutline, 
  IoSpeedometerOutline, 
  IoSearchOutline, 
  IoChatbubbleEllipsesOutline, 
  IoArrowBackOutline, 
  IoVideocamOutline 
} from 'react-icons/io5';

export default function InterviewPage() {
  const { 
    activeInterview, 
    currentQuestionIndex, 
    chatHistory, 
    codeAnswer, 
    setCodeAnswer, 
    isAiResponding, 
    interviewStatus, 
    testCasesStatus,
    consoleLogs,
    startNewInterview, 
    submitAnswer, 
    runCode,
    finishActiveInterview, 
    resetInterview 
  } = useInterview();

  const { user } = useAuth();

  // Onboarding configurations
  const [role, setRole] = useState('Frontend Engineer');
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState('Hard');
  const [jobDescription, setJobDescription] = useState('');
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);
  const [companyMeta, setCompanyMeta] = useState(null);

  // Active panel variables
  const [userTextResponse, setUserTextResponse] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleCompanySearch = (e) => {
    const value = e.target.value;
    setCompany(value);
    if (!value) {
      setCompanyMeta(null);
      return;
    }
    
    // Simulate query to Google/LinkedIn API parameters
    setIsSearchingCompany(true);
    const debounceTimer = setTimeout(() => {
      setCompanyMeta({
        name: value.charAt(0).toUpperCase() + value.slice(1),
        culture: `Fetched culture profile: High collaboration & speed (Google / LinkedIn metadata matches).`
      });
      setIsSearchingCompany(false);
    }, 800);

    return () => clearTimeout(debounceTimer);
  };

  const handleStartSetup = (e) => {
    e.preventDefault();
    startNewInterview({ 
      role, 
      company: company || 'Global Technology Corp', 
      difficulty, 
      jobDescription: jobDescription || 'Standard software engineering scope.' 
    });
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!userTextResponse.trim() && !codeAnswer) return;
    
    submitAnswer(userTextResponse);
    setUserTextResponse('');
  };

  const handleCompileCode = () => {
    runCode(codeAnswer, activeInterview?.questions[currentQuestionIndex]?.codingQuestion || 'useDebounce');
  };

  const currentQuestion = activeInterview?.questions[currentQuestionIndex];
  const isCodingQuestion = currentQuestion?.type === 'technical_code';

  return (
    <div className="h-full">
      {/* 1. Setup Wizard */}
      {interviewStatus === 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Configure Mock Simulator
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Search target companies (Google/LinkedIn details) and paste the job description to align AI questions.
            </p>
          </div>

          <form onSubmit={handleStartSetup} className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-6">
            
            {/* Target Role */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-855 dark:text-slate-200 dark:focus:bg-neutral-900 text-slate-700"
              >
                <option value="Frontend Engineer" className="bg-white dark:bg-neutral-850">Frontend Engineer</option>
                <option value="Senior React Architect" className="bg-white dark:bg-neutral-850">Senior React Architect</option>
                <option value="Software Engineer" className="bg-white dark:bg-neutral-850">Software Engineer</option>
                <option value="Product Manager" className="bg-white dark:bg-neutral-850">Product Manager</option>
              </select>
            </div>

            {/* Target Company Search Field */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Target Company (Fetches Google / LinkedIn details)
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="e.g. Google, LinkedIn, Microsoft, Amazon..."
                  value={company}
                  onChange={handleCompanySearch}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-250"
                />
                <IoSearchOutline className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              </div>
              
              {isSearchingCompany && (
                <span className="block text-[10px] text-brand-purple mt-1.5 animate-pulse">Querying recruiter portals...</span>
              )}

              {companyMeta && !isSearchingCompany && (
                <div className="mt-3 p-3 rounded-lg bg-blue-50/20 border border-blue-200/30 dark:bg-blue-950/10 dark:border-blue-900/20 text-xxs text-brand-blue flex items-center gap-2">
                  <IoSparklesOutline />
                  <span>{companyMeta.culture}</span>
                </div>
              )}
            </div>

            {/* Job Description Pasting Area */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Job Description (JD)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Paste the target Job Description (JD) here. The AI Agent will scan the keywords (e.g. React, Python, Database) to compile relevant coding test-cases and behavioral questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-250 font-sans leading-relaxed"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Difficulty Level
              </label>
              <div className="flex gap-4 mt-3">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-3 rounded-lg border text-center text-xs font-semibold transition-all cursor-pointer ${
                      difficulty === diff 
                        ? 'border-brand-blue bg-blue-50/20 text-brand-blue dark:border-blue-500 dark:bg-blue-950/20' 
                        : 'border-slate-200 bg-white hover:border-slate-350 text-slate-650 dark:border-neutral-850 dark:bg-neutral-900 dark:text-neutral-450'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-4 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-all shadow-premium cursor-pointer"
            >
              <IoPlayOutline size={16} /> Initialize AI Coordinator
            </button>
          </form>
        </motion.div>
      )}

      {/* 2. Setup Screen (Loading) */}
      {interviewStatus === 'setting_up' && (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-16 w-16 rounded-full border-4 border-slate-200 border-t-brand-blue animate-spin" />
            <IoSparklesOutline size={26} className="text-brand-blue animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mt-8">
            Compiling Coordinator Presets
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-450 mt-2 max-w-sm leading-relaxed">
            Parsing the job description and linking simulated Google/LinkedIn datasets...
          </p>
        </div>
      )}

      {/* 3. Active Interview Screen */}
      {interviewStatus === 'active' && activeInterview && (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column: Webcam Scanner HUD & AI Recruiter Pane */}
          <div className="lg:w-5/12 flex flex-col gap-6">
            
            {/* Webcam HUD Frame */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="relative h-44 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-slate-200/50 dark:border-neutral-850">
                
                {/* Simulated Webcam */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Scanline Sweep */}
                <div className="absolute inset-x-0 h-[2px] bg-brand-blue/60 shadow-glow-blue animate-sweep" />

                <div className="z-10 flex flex-col items-center gap-2">
                  <IoVideocamOutline size={28} className="text-slate-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">WEBCAM SIMULATOR ACTIVE</span>
                </div>

                {/* Info flags */}
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md rounded px-2 py-1 text-[8px] font-mono text-brand-blue border border-brand-blue/30 uppercase tracking-wide">
                  FPS: 60 // RESOLUTION: 1080P
                </div>
              </div>

              {/* Speech & Attention Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-neutral-850 dark:bg-neutral-950/40 text-[10px] font-semibold text-slate-500 dark:text-neutral-450 flex items-center gap-2">
                  <IoEyeOutline className="text-brand-blue" size={16} />
                  <span>Attention level: 94%</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-neutral-850 dark:bg-neutral-950/40 text-[10px] font-semibold text-slate-500 dark:text-neutral-450 flex items-center gap-2">
                  <IoSpeedometerOutline className="text-brand-purple" size={16} />
                  <span>Speech pace: 125 wpm</span>
                </div>
              </div>
            </div>

            {/* AI Recruiter Dialog Stream Panel */}
            <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden h-[340px]">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2 dark:bg-neutral-950 dark:border-neutral-850 shrink-0">
                <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wide">AI Agent Recruiter Stream</span>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start'}`}
                  >
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                      {msg.sender === 'user' ? (user?.name || 'Candidate') : activeInterview.company}
                    </span>
                    <div 
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-slate-905 text-white rounded-tr-none dark:bg-neutral-200 dark:text-slate-900 font-semibold' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none dark:bg-neutral-850 dark:text-neutral-200 border border-slate-200/50 dark:border-neutral-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiResponding && (
                  <div className="self-start space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">{activeInterview.company}</span>
                    <div className="bg-slate-100 dark:bg-neutral-850 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/50 dark:border-neutral-800">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" />
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Answers Panel or Code Editor */}
          <div className="flex-1 flex flex-col">
            
            {/* Conceptual / Behavioral Answer Input Form */}
            {!isCodingQuestion && (
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-450 uppercase tracking-wide">
                    <IoChatbubbleEllipsesOutline /> Answer Submission Area
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50/30 border border-orange-200/30 text-xxs text-orange-600 leading-relaxed dark:bg-orange-950/10 dark:border-orange-900/20">
                    <strong>Tip:</strong> {currentQuestion?.tip}
                  </div>
                </div>

                <form onSubmit={handleSendResponse} className="space-y-4 mt-6">
                  <textarea
                    rows={8}
                    required
                    placeholder="Type your response here using the STAR method..."
                    value={userTextResponse}
                    onChange={(e) => setUserTextResponse(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-850 dark:bg-neutral-950 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200 font-sans leading-relaxed flex-1"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xxs text-slate-400">Question {currentQuestionIndex + 1} of {activeInterview.questions.length}</span>
                    <div className="flex gap-2">
                      {currentQuestionIndex === activeInterview.questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            submitAnswer(userTextResponse);
                            setUserTextResponse('');
                            setTimeout(finishActiveInterview, 800);
                          }}
                          className="rounded-lg bg-brand-blue px-6 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          Submit & Finish
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="rounded-lg bg-slate-950 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* IDE Coding Workspace Panel */}
            {isCodingQuestion && (
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-neutral-950 overflow-hidden shadow-sm dark:border-neutral-850 justify-between">
                
                {/* Editor Header */}
                <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-850 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <IoCodeSlashOutline className="text-emerald-400" />
                    <span className="text-xs font-bold text-neutral-300 font-mono">Workspace.jsx</span>
                  </div>
                  <button
                    onClick={handleCompileCode}
                    disabled={testCasesStatus === 'running'}
                    className="rounded bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xxs font-semibold text-emerald-400 font-mono transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {testCasesStatus === 'running' ? 'Compiling...' : 'Run Test Cases'}
                  </button>
                </div>

                {/* Textarea Editor */}
                <div className="flex-1 relative flex overflow-y-auto">
                  <div className="w-12 bg-neutral-950 select-none text-right pr-3 pt-4 text-xs font-mono text-neutral-700 leading-[1.5] border-r border-neutral-850">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    className="flex-1 bg-neutral-950 text-slate-100 p-4 pt-4 text-xs font-mono outline-none focus:ring-0 leading-[1.5] resize-none"
                  />
                </div>

                {/* Output Console */}
                <div className="h-44 border-t border-neutral-850 bg-neutral-950 p-4 font-mono text-[10px] overflow-y-auto shrink-0 flex flex-col justify-between">
                  <div>
                    <span className="block text-slate-500 border-b border-neutral-850 pb-1.5 mb-1.5 uppercase font-bold tracking-wider">Console Output Terminal</span>
                    {testCasesStatus === 'running' && (
                      <div className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" /> Running unit assertions...
                      </div>
                    )}
                    <div className="space-y-1">
                      {consoleLogs.map((log, idx) => (
                        <div key={idx} className={
                          log.includes('[error]') ? 'text-red-400 font-semibold' :
                          log.includes('[success]') ? 'text-emerald-400 font-semibold' :
                          log.includes('[system]') ? 'text-slate-500' : 'text-slate-200'
                        }>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Flow */}
                  <div className="flex justify-between items-center border-t border-neutral-850 pt-3 mt-3">
                    <span className="text-neutral-500">Press Submit once code tests compile correctly.</span>
                    <button
                      onClick={() => {
                        submitAnswer('[Code Submitted]');
                        setUserTextResponse('');
                      }}
                      className="rounded bg-brand-blue hover:bg-blue-600 px-4 py-2 text-xxs font-semibold text-white font-mono transition-colors cursor-pointer"
                    >
                      Submit Code Solution
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. Post-Interview Evaluation Report */}
      {interviewStatus === 'review' && activeInterview && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                Interview Performance Review
              </h1>
              <p className="text-sm text-slate-500 dark:text-neutral-450 mt-1">
                Target Preset: {activeInterview.company} // Role: {activeInterview.role}
              </p>
            </div>
            <button
              onClick={resetInterview}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <IoArrowBackOutline /> Start New Session
            </button>
          </div>

          {/* Overall Score Dial Widget */}
          <div className="grid md:grid-cols-12 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative h-40 w-40 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 dark:bg-neutral-950 dark:border-neutral-850">
                {/* Conic progress fallback circle */}
                <div 
                  className="absolute inset-1 rounded-full flex items-center justify-center bg-white dark:bg-neutral-900"
                  style={{
                    background: `conic-gradient(#3b82f6 ${activeInterview.scores.overall * 3.6}deg, #e2e8f0 0deg)`
                  }}
                >
                  <div className="h-32 w-32 rounded-full bg-slate-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold font-heading text-slate-905 dark:text-white">{activeInterview.scores.overall}%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">OVERALL FIT</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-8 space-y-4">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">AI Diagnostics & Analysis</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-450 leading-relaxed font-sans">
                {activeInterview.feedback}
              </p>
            </div>
          </div>

          {/* Granular Categories Bar Grids */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: 'Technical Accuracy', val: activeInterview.scores.technical, desc: 'Syntax checks, big-O optimization targets.' },
              { label: 'Communication pacing', val: activeInterview.scores.communication, desc: 'STAR articulation, pacing speeds.' },
              { label: 'Problem Solving logic', val: activeInterview.scores.problemSolving, desc: 'Edge-case handling, pointer operations.' },
              { label: 'Behavioral alignment', val: activeInterview.scores.behavioral, desc: 'Company values matching, collaborative benchmarks.' }
            ].map((cat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-850 dark:bg-neutral-950/20 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">{cat.label}</span>
                  <span className="text-xs font-bold font-mono text-brand-blue">{cat.val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-neutral-800">
                  <div className="bg-brand-blue h-2 rounded-full transition-all duration-1000" style={{ width: `${cat.val}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Q&A Side-by-Side Review Section */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">Q&A Dialogue Review</h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-neutral-800">
              {activeInterview.qaReviews.map((qa, i) => (
                <div key={i} className="p-6 space-y-4">
                  <div className="flex gap-2.5 items-start">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-brand-blue dark:bg-blue-950/30 shrink-0">Q{i + 1}</span>
                    <p className="text-xs font-bold text-slate-905 dark:text-white leading-relaxed">{qa.question}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    {/* User response */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 dark:bg-neutral-950/40 dark:border-neutral-850 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Your response</span>
                      <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed italic">
                        "{qa.userAnswer}"
                      </p>
                      {qa.userCode && (
                        <pre className="p-2 rounded bg-neutral-950 text-emerald-400 font-mono text-[9px] overflow-x-auto mt-2 whitespace-pre-wrap">
                          {qa.userCode}
                        </pre>
                      )}
                    </div>

                    {/* Ideal answer suggestion */}
                    <div className="p-4 rounded-xl bg-blue-50/10 border border-blue-200/25 dark:bg-blue-950/5 dark:border-blue-900/10 space-y-2">
                      <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wide">Coach Target Suggestion</span>
                      <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans">
                        {qa.idealAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Coach rating banner */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/55 dark:bg-neutral-950/10 text-xxs leading-relaxed">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold shrink-0 ${
                      qa.coachScore >= 75 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      Score: {qa.coachScore}%
                    </span>
                    <p className="text-slate-500 dark:text-neutral-400">
                      <strong>AI Coach:</strong> {qa.coachFeedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
