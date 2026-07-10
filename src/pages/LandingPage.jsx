import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/ui/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMicOutline, 
  IoDocumentTextOutline, 
  IoGitBranchOutline, 
  IoBarChartOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleSharp,
  IoSparklesOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoStarSharp,
  IoTerminalOutline,
  IoVideocamOutline,
  IoCalendarOutline
} from 'react-icons/io5';

export default function LandingPage() {
  const { user, setAuthModalOpen, setAuthModalTab } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  // Interactive Live Chat Demo State
  const [chatOption, setChatOption] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I'm your AI career coach. Choose one of the questions below to see how I help you prepare."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const demoOptions = [
    {
      id: 'opt1',
      label: 'Google Frontend: Concurrency & React 19',
      userMsg: 'How should I explain React 19 concurrent features in a Google interview?',
      aiResponse: 'In a Google frontend interview, explain that concurrency allows React to prepare multiple versions of UI at the same time. Focus on two main pillars:\n1. **Transitions (useTransition)**: Allows marking updates as non-blocking (e.g. searching a list while typing).\n2. **React Server Actions**: Streamlined server-side data submission directly integrated with form state APIs. Google recruiters love structured answers: explain the Situation, the Bottleneck, your Action using Transitions, and the Resulting 60fps performance.'
    },
    {
      id: 'opt2',
      label: 'Stripe Technical: Reversing Linked Lists',
      userMsg: 'Here is my answer to reversing a linked list. Is it correct?',
      aiResponse: 'Your logic is correct, but you used recursion which introduces O(N) call stack space complexity. In an interview, first mention the iterative approach using three pointers (prev, curr, next) which optimizes space to O(1). Under pressure, developers often forget to handle the null root edge-case, so state that explicitly to score maximum points.'
    },
    {
      id: 'opt3',
      label: 'Apple Design: Polishing Resume Action Hooks',
      userMsg: 'How can I make "wrote React components" sound better?',
      aiResponse: 'Refactor that bullet point using action verbs and concrete impact metrics:\n*   **Before**: "Wrote React components and improved page speed."\n*   **After**: "Engineered high-performance React components, reducing Time-to-Interactive (TTI) by 27% and boosting search engine indexability."\nThis immediately triggers ATS keyword matches and shows recruiters you focus on results, not just tasks.'
    }
  ];

  const handleDemoInteraction = (option) => {
    if (isTyping || chatOption === option.id) return;
    setChatOption(option.id);
    
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: option.userMsg }]);
    setIsTyping(true);

    // Simulate AI thinking and streaming response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'ai', text: option.aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How does the AI evaluate my coding and communication?",
      a: "InterviewAI Pro utilizes state-of-the-art LLMs combined with audio-amplitude scanners. We evaluate your code for time/space complexity, syntax soundness, and style. For communication, we scan semantic structure, STAR method compliance, and pacing speed."
    },
    {
      q: "Can I practice for specific companies like Google, Stripe, or Vercel?",
      a: "Yes. When you start an interview, you can toggle company presets. This adjusts the interviewer's style, question profiles (e.g. system design at Google vs. API architecture at Stripe), and theme accents dynamically."
    },
    {
      q: "How does the Resume ATS Optimizer work?",
      a: "We scan your CV against core engineering keywords, structure guidelines, and impact patterns. The optimizer outputs a side-by-side red/green diff view, allowing you to merge optimizations directly into your file and increase compatibility ratings instantly."
    },
    {
      q: "Is my webcam data safe during mock video sessions?",
      a: "Absolutely. All webcam video analytics and pacing scans are executed client-side in your local browser workspace. We do not store or transmit raw video feeds to external server layers."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthModalTab('signup');
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-200 selection:bg-brand-blue/30 overflow-x-hidden">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-28">
        {/* Glow ambient background graphics */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px] dark:bg-brand-blue/5" />
        <div className="absolute top-1/3 left-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-brand-purple/10 blur-[150px] dark:bg-brand-purple/5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-brand-blue dark:bg-neutral-800 dark:text-blue-400 border border-slate-200/50 dark:border-neutral-750">
              <IoSparklesOutline /> Series A Scaffolding Complete
            </span>
            <h1 className="mt-6 text-4xl font-extrabold font-heading tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.05]">
              Land Your Dream Offer With <span className="text-gradient">InterviewAI Pro</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              The premium career coaching workspace. Simulate realistic webcam coding interviews, receive diagnostic STAR scores, and optimize your resume for ATS scanners.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
              <button
                onClick={handleCTA}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-all shadow-premium hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Start Preparing Free <IoArrowForwardOutline />
              </button>
              <a
                href="#demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/50 px-8 py-4 text-base font-semibold hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 transition-colors"
              >
                Watch Interactive Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMPANY LOGOS */}
      <section className="py-8 bg-slate-50/20 dark:bg-neutral-950/20 border-y border-slate-200/50 dark:border-neutral-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
            Engineers at top tech firms use our simulator
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20 opacity-40 grayscale dark:invert">
            <span className="font-heading font-black text-lg tracking-wider">GOOGLE</span>
            <span className="font-heading font-black text-lg tracking-wider">STRIPE</span>
            <span className="font-heading font-black text-lg tracking-wider">META</span>
            <span className="font-heading font-black text-lg tracking-wider">VERCEL</span>
            <span className="font-heading font-black text-lg tracking-wider">APPLE</span>
          </div>
        </div>
      </section>

      {/* 3. BENTO FEATURES GRID */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white">
              Everything You Need to Outperform
            </h2>
            <p className="mt-4 text-slate-500 dark:text-neutral-450 text-sm sm:text-base">
              A bespoke collection of features engineered to prepare you for highly competitive technical assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mock Interview Card */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-neutral-700 transition-colors group">
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-brand-blue flex items-center justify-center mb-6">
                  <IoMicOutline size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Interactive Recruiter Simulator</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Practice behavioral articulation and live coding compile tests. Toggle company profiles (Google, Stripe, Apple) to adjust recruiter logic and ambient themes.
                </p>
              </div>
              <div className="mt-8 border border-slate-100 rounded-xl bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50 flex items-center gap-4">
                <span className="flex h-3 w-3 shrink-0 rounded-full bg-red-500 animate-pulse-slow" />
                <div className="flex-1 text-[10px] font-mono text-slate-500 dark:text-neutral-450 uppercase tracking-wider">
                  CAMERA ACTIVE // terminal debugger compiled
                </div>
              </div>
            </div>

            {/* Performance Analytics Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <div>
                <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-brand-purple flex items-center justify-center mb-6">
                  <IoBarChartOutline size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">STAR Feedback Sheets</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  View diagnostic scores mapped across 5 core categories. Compare responses side-by-side with coach-compiled ideal targets.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-5 gap-1.5 h-16 items-end">
                {[35, 60, 85, 45, 90].map((val, idx) => (
                  <div key={idx} className="h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${val}%` }}
                      viewport={{ once: true }}
                      className="w-full bg-gradient-to-t from-brand-blue to-brand-purple rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Resume Analyzer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <div>
                <div className="h-12 w-12 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-brand-pink flex items-center justify-center mb-6">
                  <IoDocumentTextOutline size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Resume & ATS Analyzer</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Spot structure gaps and weak phrasing instantly. Use our interactive red/green diff widget to merge high-impact bullet suggestions.
                </p>
              </div>
              <div className="mt-8 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-250/30 dark:border-emerald-900/20 p-3.5 text-xs text-emerald-800 dark:text-emerald-450 font-mono">
                + Optimized page TTI speed by 27%
              </div>
            </div>

            {/* Roadmaps */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-neutral-700 transition-colors">
              <div>
                <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center mb-6">
                  <IoGitBranchOutline size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Competency Roadmaps</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Interactive node trees mapping developer competencies (Reconciliation, Hydration, System Architecture) alongside curated prep flashcards.
                </p>
              </div>
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {['React Concurrency', 'Network Caching API', 'System Gateways', 'STAR Behavior Method'].map((pathName, idx) => (
                  <span 
                    key={idx}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-250 bg-slate-50 text-slate-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                  >
                    {pathName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-slate-50/50 dark:bg-neutral-900/30 border-y border-slate-200/50 dark:border-neutral-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              The 3-Step Prep Flow
            </h2>
            <p className="mt-2 text-slate-500 dark:text-neutral-450 text-sm">
              How InterviewAI Pro guides you from target presets to live diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Set Recruiter Presets',
                desc: 'Select your role target, difficulty, and company ambient theme to load tailored technical/behavioral question arrays.',
                icon: IoCalendarOutline
              },
              {
                step: '02',
                title: 'Run Video & Code Simulation',
                desc: 'Speak via audio visualizers, write clean syntax in our custom IDE editor, and compile test specs in real-time.',
                icon: IoTerminalOutline
              },
              {
                step: '03',
                title: 'Refructure Your Gaps',
                desc: 'Review side-by-side coach breakdowns, optimize your ATS keywords, and patch concepts via timeline nodes.',
                icon: IoVideocamOutline
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm relative group hover:border-slate-300 dark:hover:border-neutral-750 transition-colors">
                  <span className="absolute top-4 right-4 text-3xl font-black font-heading text-slate-100 dark:text-neutral-800 group-hover:text-brand-blue/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/55 text-brand-blue flex items-center justify-center mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DEMO PREVIEW */}
      <section id="demo" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Try It Live
            </h2>
            <p className="mt-2 text-slate-550 dark:text-neutral-400 text-sm">
              Click a question below to interact with our AI Coach in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            {/* Options list */}
            <div className="md:col-span-5 flex flex-col justify-center gap-3">
              {demoOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleDemoInteraction(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm font-semibold ${
                    chatOption === opt.id 
                      ? 'border-brand-blue bg-blue-50/20 text-brand-blue dark:bg-blue-950/20 dark:border-blue-500' 
                      : 'border-slate-200 bg-white hover:border-slate-350 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Interactive Chat Window */}
            <div className="md:col-span-7 flex flex-col rounded-2xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-premium overflow-hidden h-[420px]">
              <div className="bg-slate-50 px-4 py-3.5 border-b border-slate-200 flex items-center gap-2 dark:bg-neutral-900 dark:border-neutral-800 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-650 dark:text-neutral-400">AI Coach Workspace Simulator</span>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-end">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start'}`}
                  >
                    <div 
                      className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user' 
                          ? 'bg-slate-950 text-white rounded-br-none dark:bg-neutral-200 dark:text-slate-900' 
                          : 'bg-slate-100 text-slate-800 rounded-bl-none dark:bg-neutral-850 dark:text-neutral-200 border border-slate-200/50 dark:border-neutral-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="self-start bg-slate-100 dark:bg-neutral-850 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200/50 dark:border-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STATISTICS */}
      <section className="py-20 bg-slate-50/50 dark:bg-neutral-900/30 border-y border-slate-200/50 dark:border-neutral-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: '94%', label: 'ATS Target Compatibility' },
              { val: '8.6x', label: 'More Interview Invites' },
              { val: '14k+', label: 'Successful Offers Secured' },
              { val: '$42k', label: 'Average Salary Increase' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="block text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white text-gradient">
                  {stat.val}
                </span>
                <span className="block text-xxs sm:text-xs font-semibold text-slate-450 dark:text-neutral-450 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Success Stories
            </h2>
            <p className="mt-2 text-slate-500 dark:text-neutral-450 text-sm">
              See how our candidates landed senior roles at major companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InterviewAI Pro was a total game-changer. The Google simulator predicted the exact React 19 concurrent questions I got. Secured my L5 Senior Role!",
                author: "Sarah Connor",
                role: "Senior React Developer, Google",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "The ATS resume checks elevated my score from 60% to 92%. I got 8 interview callbacks in two weeks. Merging the suggestions was seamless.",
                author: "Alex Rivers",
                role: "Lead Engineer, Stripe",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                quote: "Practicing with live biometric pacing alerts calmed my interview anxiety. The split code terminal compile specs feel highly realistic.",
                author: "Devon May",
                role: "Senior PM, Meta",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ].map((card, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-350 dark:hover:border-neutral-750 transition-colors">
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <IoStarSharp key={i} size={16} />)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 italic leading-relaxed">
                    "{card.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-neutral-850">
                  <img src={card.avatar} alt={card.author} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-neutral-200">{card.author}</h4>
                    <p className="text-[10px] text-slate-450 dark:text-neutral-500 mt-0.5">{card.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRICING */}
      <section id="pricing" className="py-20 bg-slate-50/50 dark:bg-neutral-900/30 border-y border-slate-200/50 dark:border-neutral-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Transparent, Value-First Pricing
            </h2>
            <p className="mt-2 text-slate-500 dark:text-neutral-450 text-sm">
              Prepare for free, or upgrade to Pro to unlock unlimited coaching feedback.
            </p>

            {/* Billing Cycle Selector */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-neutral-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Annual (20% Off)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-850 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-350 dark:hover:border-neutral-700 transition-colors">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Starter</h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">Perfect to test capabilities</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-450 ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-neutral-350">
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> 1 Mock Interview session / mo</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Basic interview questions</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> ATS resume check (score only)</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Standard dashboard templates</li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-55 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-brand-blue bg-white p-8 dark:bg-neutral-900 shadow-premium relative flex flex-col justify-between hover:scale-[1.01] transition-all">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue px-3 py-1 text-xxs font-extrabold uppercase tracking-wide text-white">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Pro</h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">For ambitious professionals</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {billingCycle === 'monthly' ? '$19' : '$15'}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-neutral-350">
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Unlimited Mock Interviews</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Custom Role & Company modes</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Integrated Coding compiler simulator</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Interactive Resume optimization diffs</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Full Interactive Roadmaps</li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-glow-blue active:scale-[0.98] cursor-pointer"
              >
                Go Pro Now
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-neutral-850 dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-slate-350 dark:hover:border-neutral-700 transition-colors">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Enterprise</h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">For university cohorts</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {billingCycle === 'monthly' ? '$49' : '$39'}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-neutral-350">
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Dedicated HR templates</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Live recruiter dashboards logs</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Cohort API analytics</li>
                  <li className="flex items-center gap-2.5"><IoCheckmarkCircleSharp className="text-brand-blue shrink-0" /> Priority 24/7 dedicated support</li>
                </ul>
              </div>
              <button
                onClick={handleCTA}
                className="mt-8 w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-55 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-all active:scale-[0.98] cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-550 dark:text-neutral-400 text-sm">
              Answers to questions regarding data integrity, evaluation parameters, and billing scopes.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900 shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-neutral-850/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <IoChevronUpOutline className="text-slate-400" size={16} /> : <IoChevronDownOutline className="text-slate-400" size={16} />}
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-slate-100 dark:border-neutral-850"
                    >
                      <div className="p-5 text-xs leading-relaxed text-slate-500 dark:text-neutral-450 bg-slate-50/20 dark:bg-neutral-950/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="py-12 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950 px-8 py-16 text-center text-white dark:bg-neutral-900 border border-neutral-800 relative overflow-hidden shadow-premium">
            {/* Glow overlays */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-[90px]" />
            <div className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-brand-purple/20 blur-[100px]" />

            <h2 className="text-3xl font-bold font-heading">
              Ready to Secure Your Placement?
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Unlock the entire simulator catalog, ATS analyzer diffs, and structured roadmap competencies today. Join thousands of high-earning developers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCTA}
                className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 hover:bg-neutral-100 active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                Start Preparing Free
              </button>
              <button
                onClick={handleCTA}
                className="w-full sm:w-auto rounded-xl border border-neutral-750 px-8 py-3.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-white border-t border-slate-200/50 py-16 dark:bg-dark-bg dark:border-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-150 dark:border-neutral-850">
            <div className="space-y-4 col-span-2 md:col-span-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple text-white shadow-premium text-sm font-bold font-heading">
                I
              </span>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                Your personal AI Career Coach. Simulate interviews, check ATS scores, and structure prep tracks dynamically.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-neutral-450">
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Simulator</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Resume Check</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Skill Paths</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-neutral-450">
                <li className="hover:text-brand-blue cursor-pointer transition-colors">STAR Method Guide</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Developer Blog</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">API Docs</li>
                <li className="hover:text-brand-blue cursor-pointer transition-colors">Help Desk</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xxs text-slate-400 dark:text-neutral-500">
            <p>&copy; 2026 InterviewAI Pro. Handcrafted with precision for Placement interviews.</p>
            <div className="flex gap-6">
              <span className="hover:text-brand-blue cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-brand-blue cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-brand-blue cursor-pointer transition-colors">Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login modal overlay */}
      <AuthModal />
    </div>
  );
}
