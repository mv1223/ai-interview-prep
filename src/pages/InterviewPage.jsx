import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  IoPlayOutline, 
  IoReloadOutline,
  IoCodeSlashOutline,
  IoSparklesOutline,
  IoEyeOutline,
  IoSpeedometerOutline
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
    startNewInterview, 
    submitAnswer, 
    finishActiveInterview, 
    resetInterview 
  } = useInterview();

  const { user } = useAuth();

  // Wizard Configuration State
  const [role, setRole] = useState('Frontend Engineer');
  const [company, setCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState('Hard');

  // Active Panel state
  const [userTextResponse, setUserTextResponse] = useState('');
  const [compileOutput, setCompileOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleStartSetup = (e) => {
    e.preventDefault();
    startNewInterview({ role, company, difficulty });
  };

  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!userTextResponse.trim() && !codeAnswer) return;
    
    // Send response to context
    submitAnswer(userTextResponse);
    setUserTextResponse('');
    setCompileOutput('');
  };

  const handleCompileCode = () => {
    setIsCompiling(true);
    setCompileOutput('Compiling code files...\nRunning unit test framework...');
    
    setTimeout(() => {
      setCompileOutput(
        '✔ Test Suite Passed: 3/3 specs completed.\n' + 
        '✔ Spec 1: Correct output return on normal boundaries.\n' +
        '✔ Spec 2: Handled edge cases (null inputs, empty limits).\n' +
        '✔ Spec 3: Time complexity within optimized parameters (O(N)).\n\n' +
        'Console Output: Execution successful.'
      );
      setIsCompiling(false);
    }, 1200);
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
              Configure Your Mock Session
            </h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Select your role, company settings, and challenge difficulty to start the recruiter simulator.
            </p>
          </div>

          <form onSubmit={handleStartSetup} className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-6">
            {/* Role selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-700 dark:text-slate-200"
              >
                <option value="Frontend Engineer" className="bg-white dark:bg-neutral-900 text-slate-850 dark:text-slate-200">Frontend Engineer</option>
                <option value="Senior React Architect" className="bg-white dark:bg-neutral-900 text-slate-850 dark:text-slate-200">Senior React Architect</option>
                <option value="Software Engineer" className="bg-white dark:bg-neutral-900 text-slate-850 dark:text-slate-200">Software Engineer</option>
                <option value="Product Manager" className="bg-white dark:bg-neutral-900 text-slate-850 dark:text-slate-200">Product Manager</option>
              </select>
            </div>

            {/* Company Customization Grid */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Target Company (AI Theme)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
                {['Google', 'Stripe', 'Apple', 'Vercel', 'Meta'].map((compName) => (
                  <button
                    key={compName}
                    type="button"
                    onClick={() => setCompany(compName)}
                    className={`p-4 rounded-xl border text-center font-heading font-semibold text-xs transition-all ${
                      company === compName 
                        ? 'border-brand-blue bg-blue-50/20 text-brand-blue dark:border-blue-500 dark:bg-blue-950/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 dark:border-neutral-850 dark:bg-neutral-900 dark:text-neutral-400'
                    }`}
                  >
                    {compName}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Difficulty Level
              </label>
              <div className="flex gap-4 mt-3">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                      difficulty === diff 
                        ? 'border-brand-blue bg-blue-50/20 text-brand-blue dark:border-blue-500 dark:bg-blue-950/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 dark:border-neutral-850 dark:bg-neutral-900 dark:text-neutral-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-4 text-sm font-semibold text-white hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-all shadow-premium"
            >
              <IoPlayOutline size={18} /> Initialize AI Coordinator
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
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white mt-6">Scaffolding Simulation Workspace</h2>
          <p className="text-xs text-slate-400 dark:text-neutral-500 mt-2 max-w-sm">
            Tuning LLM voice layers, preparing coding compilers, and calibrating metrics dashboards...
          </p>
        </div>
      )}

      {/* 3. Active Interview Screen */}
      {interviewStatus === 'active' && (
        <div className="grid lg:grid-cols-12 gap-8 items-stretch h-[calc(100vh-140px)]">
          
          {/* LEFT PANEL: Chat with Recruiter */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm">
            {/* Header / Recruiter Avatar */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 flex items-center gap-4 shrink-0">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm">
                  AI
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-neutral-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-neutral-200 leading-tight">
                  AI Coordinator ({company} Mode)
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-xxs font-semibold text-slate-400 dark:text-neutral-500">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
                  Voice Feed Active
                </div>
              </div>

              {/* Pulsing Audio wave mockup */}
              <div className="ml-auto flex items-center gap-0.5 h-6">
                {[12, 24, 16, 28, 10, 20, 14, 26, 8].map((height, i) => (
                  <span 
                    key={i} 
                    className="w-[2px] bg-brand-blue/70 rounded-full"
                    style={{
                      height: `${height}px`,
                      animation: isAiResponding ? 'pulse 1s infinite alternate' : 'none',
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-950 text-white rounded-br-none dark:bg-neutral-200 dark:text-slate-900' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none dark:bg-neutral-850 dark:text-neutral-200 border border-slate-200/50 dark:border-neutral-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.code && (
                      <pre className="mt-3 p-3 bg-neutral-950 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto border border-neutral-900 leading-tight">
                        <code>{msg.code}</code>
                      </pre>
                    )}
                    <span className="block text-xxs text-right mt-1.5 opacity-60 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isAiResponding && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-neutral-850 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200/50 dark:border-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Answer Input Panel */}
            <div className="p-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/20 dark:bg-neutral-900/20 shrink-0">
              <form onSubmit={handleSendResponse} className="flex gap-3">
                <input
                  type="text"
                  placeholder={isAiResponding ? "AI is responding..." : "Formulate your answer..."}
                  disabled={isAiResponding}
                  value={userTextResponse}
                  onChange={(e) => setUserTextResponse(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-brand-blue"
                />
                
                {/* Submit / Finish Actions */}
                <button
                  type="submit"
                  disabled={isAiResponding}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 disabled:opacity-50 transition-all font-semibold text-sm shrink-0"
                >
                  Submit
                </button>

                {currentQuestionIndex === activeInterview.questions.length - 1 && (
                  <button
                    type="button"
                    onClick={finishActiveInterview}
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-500 font-semibold text-sm shrink-0 transition-all shadow-md"
                  >
                    View Report
                  </button>
                )}
              </form>
              <div className="flex justify-between text-xxs text-slate-400 dark:text-neutral-500 mt-2.5 px-1">
                <span>Question {currentQuestionIndex + 1} of {activeInterview.questions.length}</span>
                <span className="flex items-center gap-1"><IoSparklesOutline /> Tip: {currentQuestion?.tip}</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Code Editor OR Webcam Simulator */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Webcam / Biometrics Simulator Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm shrink-0 relative overflow-hidden">
              {/* Simulated camera grid screen */}
              <div className="aspect-video w-full rounded-xl bg-neutral-950 flex items-center justify-center relative overflow-hidden border border-neutral-850 group">
                {/* Visual Scanner overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent animate-pulse pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-brand-blue/20 animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
                
                {/* User avatar mockup inside "Webcam frame" */}
                <div className="text-center z-10">
                  <div className="relative inline-block">
                    <img 
                      src={user?.avatarUrl} 
                      alt="User avatar" 
                      className="h-20 w-20 rounded-full border-2 border-brand-blue object-cover group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-neutral-950 bg-red-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-450 mt-2.5">Recruiter Webcam Stream</p>
                </div>

                {/* Floating biometrics stats */}
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-sm">
                  <IoEyeOutline size={12} className="text-brand-blue" />
                  Attention Span: 94%
                </div>
                <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 shadow-sm">
                  <IoSpeedometerOutline size={12} className="text-brand-purple" />
                  Speech Pace: 125 wpm
                </div>
              </div>
            </div>

            {/* Visual Code Editor Panel */}
            {isCodingQuestion && (
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-neutral-950 overflow-hidden shadow-sm dark:border-neutral-850">
                {/* Editor Header tabs */}
                <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-850 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <IoCodeSlashOutline className="text-emerald-400" />
                    <span className="text-xs font-bold text-neutral-300 font-mono">Workspace.jsx</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCompileCode}
                      disabled={isCompiling}
                      className="rounded bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xxs font-semibold text-emerald-400 font-mono transition-colors"
                    >
                      {isCompiling ? 'Running...' : 'Run Test Cases'}
                    </button>
                  </div>
                </div>

                {/* Textarea Editor Area */}
                <div className="flex-1 relative flex">
                  {/* Line numbers dummy column */}
                  <div className="w-12 bg-neutral-950 select-none text-right pr-3 pt-4 text-xs font-mono text-neutral-700 leading-[1.5]">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Core textarea */}
                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    className="flex-1 bg-neutral-950 text-slate-100 p-4 pt-4 text-xs font-mono outline-none custom-editor-textarea focus:ring-0 leading-[1.5]"
                  />
                </div>

                {/* Compile Terminal Output Console */}
                {compileOutput && (
                  <div className="h-40 border-t border-neutral-850 bg-neutral-950 p-4 font-mono text-xxs overflow-y-auto text-neutral-350 shrink-0">
                    <span className="block text-slate-500 border-b border-neutral-850 pb-1.5 mb-1.5 uppercase font-bold tracking-wider">Console Output Terminal</span>
                    <pre className="whitespace-pre-wrap">{compileOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Post-Interview Feedback Screen */}
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
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
                Deep analytical evaluation dashboard compiled by InterviewAI Coach.
              </p>
            </div>
            <button
              onClick={resetInterview}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all dark:border-neutral-850 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer shrink-0"
            >
              <IoReloadOutline size={18} /> Reset & Restart
            </button>
          </div>

          {/* Core Analytics Banner */}
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            
            {/* Overall Score conic-gradient Speedometer */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-850 dark:bg-neutral-900 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-6">Overall Competency Score</span>
              
              <div 
                className="relative h-44 w-44 rounded-full flex items-center justify-center shadow-inner"
                style={{
                  background: `conic-gradient(#3b82f6 ${activeInterview.scores.overall * 3.6}deg, #e2e8f0 0deg)`
                }}
              >
                {/* Inner mask card */}
                <div className="h-[148px] w-[148px] rounded-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white">{activeInterview.scores.overall}%</span>
                  <span className="text-xxs text-slate-400 dark:text-neutral-500 mt-1 font-semibold uppercase tracking-wider">PASSED</span>
                </div>
              </div>
              
              <span className="mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Top 15% Candidate Standard
              </span>
            </div>

            {/* Scores category bars */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-850 dark:bg-neutral-900 shadow-sm flex flex-col justify-center space-y-5">
              {[
                { label: 'Technical Accuracy', score: activeInterview.scores.technical, color: 'bg-brand-blue' },
                { label: 'Communication clarity', score: activeInterview.scores.communication, color: 'bg-brand-purple' },
                { label: 'Problem Solving Method', score: activeInterview.scores.problemSolving, color: 'bg-brand-pink' },
                { label: 'Behavioral alignment', score: activeInterview.scores.behavioral, color: 'bg-orange-500' }
              ].map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-neutral-350">{cat.label}</span>
                    <span className="font-mono text-slate-900 dark:text-white">{cat.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-neutral-850 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 0.8, delay: i * 100 }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach overall note */}
          <div className="rounded-2xl border border-blue-200/50 bg-blue-50/20 p-6 dark:border-blue-900/30 dark:bg-blue-950/10 flex items-start gap-4">
            <IoSparklesOutline size={22} className="text-brand-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">AI Coach Executive Summary</h4>
              <p className="text-xs text-slate-500 dark:text-neutral-450 mt-1 leading-relaxed">
                {activeInterview.feedback}
              </p>
            </div>
          </div>

          {/* Question by Question Detailed Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              Question-by-Question Evaluation
            </h3>

            {activeInterview.qaReviews?.map((item, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-neutral-850 dark:bg-neutral-900 shadow-sm"
              >
                {/* Header title */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 dark:bg-neutral-950 dark:border-neutral-850 flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">QUESTION {index + 1}</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200 truncate mt-0.5">{item.question}</h4>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 dark:bg-neutral-850 dark:text-neutral-350 shrink-0">
                    Score: {item.coachScore}%
                  </span>
                </div>

                {/* Body comparative logs */}
                <div className="p-6 space-y-5 text-xs">
                  {/* Your Answer */}
                  <div className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Your Answer</h5>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-neutral-850 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {item.userAnswer}
                    </div>
                    {item.userCode && (
                      <pre className="p-3 bg-neutral-950 text-emerald-400 border border-neutral-900 rounded-lg font-mono overflow-x-auto leading-normal">
                        <code>{item.userCode}</code>
                      </pre>
                    )}
                  </div>

                  {/* Ideal Answer */}
                  <div className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Ideal Answer Focus</h5>
                    <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                      {item.idealAnswer}
                    </div>
                  </div>

                  {/* Coach Actionable feedback */}
                  <div className="space-y-1.5">
                    <h5 className="font-semibold uppercase tracking-wider text-slate-450 dark:text-neutral-500 flex items-center gap-1">
                      <IoSparklesOutline className="text-brand-purple" /> AI Coach Feedback
                    </h5>
                    <div className="bg-purple-50/40 p-3 rounded-lg border border-purple-100/50 dark:bg-purple-950/10 dark:border-purple-900/30 text-brand-purple dark:text-purple-300">
                      {item.coachFeedback}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
