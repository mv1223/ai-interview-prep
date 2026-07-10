import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCheckmarkCircleSharp, 
  IoLockClosedOutline, 
  IoBookOutline,
  IoHelpCircleOutline,
  IoSparklesOutline,
  IoChevronForwardOutline
} from 'react-icons/io5';

export default function RoadmapPage() {
  const [activeNode, setActiveNode] = useState('node-2'); // default highlight the in-progress node
  
  const nodes = [
    {
      id: 'node-1',
      title: 'React Core Fundamentals',
      subtitle: 'Fiber reconciliation, Virtual DOM, and hooks lifecycle management.',
      status: 'completed', // 'completed' | 'active' | 'locked'
      progress: 100,
      score: '92%',
      resources: [
        { type: 'Concept', name: 'Virtual DOM vs Fiber Trees reconciler algorithms' },
        { type: 'Template', name: 'Custom hooks template lifecycle closures' },
        { type: 'Practice Quiz', name: 'React component render passes and state batches' }
      ]
    },
    {
      id: 'node-2',
      title: 'React 19 Concurrency & Server Actions',
      subtitle: 'Transitions mechanism, Server actions, form APIs and resource prefetching.',
      status: 'active',
      progress: 40,
      score: '78%',
      resources: [
        { type: 'Interactive Concept', name: 'Transitions (useTransition) vs Debouncing mechanisms' },
        { type: 'React 19 Hook Guide', name: 'Form States (useActionState, useFormStatus) and the use() Hook' },
        { type: 'Mock Interview Quiz', name: 'Server Actions error handling and optimistic UI updates' }
      ]
    },
    {
      id: 'node-3',
      title: 'State Management & Web APIs Architectures',
      subtitle: 'Global cache synchronization: Context API vs Zustand, and data fetch layers.',
      status: 'locked',
      progress: 0,
      score: '--',
      resources: [
        { type: 'Interactive Concept', name: 'Zustand vs Redux Toolkit optimization differences' },
        { type: 'Practice Code', name: 'Preventing memory leaks and race conditions in useEffect dependencies' },
        { type: 'Mock Interview Quiz', name: 'WebSockets, HTTP caching, and REST/GraphQL optimization patterns' }
      ]
    },
    {
      id: 'node-4',
      title: 'Web Performance Optimization',
      subtitle: 'Lighthouse audit metrics, bundler code-splitting, lazy routing, and image rendering.',
      status: 'locked',
      progress: 0,
      score: '--',
      resources: [
        { type: 'Performance Checklist', name: 'Cumulative Layout Shift (CLS) and Time-to-Interactive (TTI) tune-ups' },
        { type: 'Practice Code', name: 'Code splitting with React.lazy and Suspense boundaries' },
        { type: 'Concept', name: 'HTTP/3, Brotli encoding, and CDN content strategies' }
      ]
    },
    {
      id: 'node-5',
      title: 'Enterprise System Design',
      subtitle: 'System architecture, API gateways, microservices integration, and scalable data layers.',
      status: 'locked',
      progress: 0,
      score: '--',
      resources: [
        { type: 'System Architecture Map', name: 'Designing resilient microfrontends configurations' },
        { type: 'Concept Guide', name: 'Rate limiters, caching hierarchies, and database read replica configs' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
          Career Skill Roadmap
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
          Structured learning checkpoints designed to build you into an elite engineer. Focus path: **Senior React Developer**.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Visual Roadmap Tree */}
        <div className="lg:col-span-7 space-y-6 relative pl-8 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-neutral-800">
          
          {nodes.map((node) => {
            const isActive = activeNode === node.id;
            
            return (
              <div 
                key={node.id} 
                className="relative group cursor-pointer"
                onClick={() => setActiveNode(node.id)}
              >
                {/* Visual marker dot */}
                <div className={`absolute -left-8 top-1.5 h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  node.status === 'completed' 
                    ? 'border-emerald-500 bg-emerald-500 text-white dark:bg-emerald-500' 
                    : node.status === 'active'
                      ? 'border-brand-blue bg-white text-brand-blue dark:bg-neutral-900 dark:border-blue-500'
                      : 'border-slate-200 bg-white text-slate-400 dark:border-neutral-800 dark:bg-neutral-900'
                }`}>
                  {node.status === 'completed' && <IoCheckmarkCircleSharp size={18} />}
                  {node.status === 'active' && <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />}
                  {node.status === 'locked' && <IoLockClosedOutline size={12} />}
                </div>

                {/* Node card content wrapper */}
                <div className={`rounded-2xl border p-5 transition-all duration-200 ${
                  isActive 
                    ? 'border-brand-blue bg-white dark:bg-neutral-900 shadow-sm' 
                    : 'border-slate-200 bg-white/60 hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-750'
                }`}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className={`text-base font-bold font-heading transition-colors ${
                        isActive ? 'text-brand-blue dark:text-blue-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {node.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-lg leading-relaxed">
                        {node.subtitle}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xxs font-bold text-slate-400 dark:text-neutral-500 uppercase block">QUIZ GRADE</span>
                      <span className="text-sm font-semibold font-mono text-slate-900 dark:text-white block mt-0.5">{node.score}</span>
                    </div>
                  </div>

                  {/* Progress bar (only for active or completed) */}
                  {node.status !== 'locked' && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${node.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-blue'}`}
                          style={{ width: `${node.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-450 dark:text-neutral-500 font-mono shrink-0">
                        {node.progress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Resource Drawer details */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-5"
              >
                {/* Heading */}
                <div>
                  <span className="text-xxs font-bold uppercase tracking-wider text-brand-purple bg-purple-50 dark:bg-purple-950/30 px-2.5 py-0.5 rounded">
                    Curated Coach resources
                  </span>
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mt-3">
                    {nodes.find(n => n.id === activeNode)?.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-450 mt-1">
                    Study these core materials compiled to prepare you for mock scenarios.
                  </p>
                </div>

                {/* Resource items */}
                <div className="space-y-3">
                  {nodes.find(n => n.id === activeNode)?.resources.map((res, i) => (
                    <div 
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 dark:border-neutral-850 dark:bg-neutral-950/30 dark:hover:bg-neutral-950/70 transition-colors flex items-center gap-3 text-xs"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-850 text-slate-500 dark:text-neutral-400 flex items-center justify-center shrink-0 shadow-sm">
                        {res.type.includes('Quiz') ? <IoHelpCircleOutline size={18} /> : <IoBookOutline size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wide block">{res.type}</span>
                        <span className="font-medium text-slate-800 dark:text-neutral-250 truncate block mt-0.5">{res.name}</span>
                      </div>
                      <IoChevronForwardOutline className="text-slate-400 shrink-0" size={14} />
                    </div>
                  ))}
                </div>

                {/* Direct action button depending on status */}
                {nodes.find(n => n.id === activeNode)?.status === 'locked' ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-center flex flex-col items-center justify-center dark:bg-neutral-950 dark:border-neutral-850 text-xs">
                    <IoLockClosedOutline size={20} className="text-slate-400 mb-1.5" />
                    <span className="font-semibold text-slate-500 dark:text-neutral-400">Section Locked</span>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 mt-0.5">Complete previous checkpoints to proceed.</span>
                  </div>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-all shadow-sm">
                    <IoSparklesOutline /> Review Flashcards & Code Exercises
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
