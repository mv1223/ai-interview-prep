import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoArrowForwardOutline, IoArrowBackOutline, IoCodeSlashOutline,
  IoServerOutline, IoBriefcaseOutline, IoSparklesOutline,
  IoSchoolOutline, IoCheckmarkCircleSharp, IoCloudUploadOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import Button from '../components/ui/Button';

const CAREER_OPTIONS = [
  { id: 'Frontend', title: 'Frontend Engineer', icon: IoCodeSlashOutline, desc: 'React, Next.js, CSS architecture, web performance, UI/UX.' },
  { id: 'Backend', title: 'Backend Engineer', icon: IoServerOutline, desc: 'APIs, databases, microservices, caching, system scaling.' },
  { id: 'Full Stack', title: 'Full Stack Engineer', icon: IoBriefcaseOutline, desc: 'End-to-end development from UI to infrastructure.' },
  { id: 'AI/ML', title: 'AI / ML Engineer', icon: IoSparklesOutline, desc: 'Model training, neural networks, vector databases, LLMs.' },
  { id: 'Data', title: 'Data Analyst', icon: IoSchoolOutline, desc: 'Analytical pipelines, BI, statistical modelling.' },
];

const EXPERIENCE_OPTIONS = [
  { id: 'Intern', title: 'Intern / Fresher', desc: 'Seeking first industry exposure.' },
  { id: 'Junior', title: 'Junior (0–2 years)', desc: 'Building core skills and best practices.' },
  { id: 'Mid-Level', title: 'Mid-Level (2–5 years)', desc: 'Architecting features and leading modules.' },
  { id: 'Senior', title: 'Senior (5+ years)', desc: 'Technical leadership and system design.' },
];

const COMPANY_OPTIONS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Stripe', 'Startup', 'Custom'];

const slide = {
  initial: { opacity: 0, x: 24 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

export default function OnboardingPage() {
  const { user, completeOnboarding, isAuthenticated } = useAuth();
  const { uploadResume } = useResume();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1–7
  const [careerGoal, setCareerGoal] = useState('Frontend');
  const [experience, setExperience] = useState('Junior');
  const [targets, setTargets] = useState(['Google']);
  const [customCo, setCustomCo] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | done
  const [uploadedName, setUploadedName] = useState('');
  const [roadmapStatus, setRoadmapStatus] = useState('idle'); // idle | building | done
  const [roadmapProgress, setRoadmapProgress] = useState(0);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.onboardingCompleted) return <Navigate to="/dashboard" replace />;

  const toggleTarget = (c) => setTargets(prev =>
    prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedName(file.name);
    setUploadStatus('uploading');
    setTimeout(() => {
      uploadResume(file);
      setUploadStatus('done');
    }, 1800);
  };

  const buildRoadmap = () => {
    setRoadmapStatus('building');
    const iv = setInterval(() => {
      setRoadmapProgress(p => {
        if (p >= 100) { clearInterval(iv); setRoadmapStatus('done'); return 100; }
        return p + 5;
      });
    }, 80);
  };

  const handleFinish = () => {
    const finalTargets = targets.map(c => c === 'Custom' ? customCo : c).filter(Boolean);
    completeOnboarding({
      careerGoal, experienceLevel: experience,
      targetCompanies: finalTargets,
      role: `${careerGoal} Engineer`,
      company: finalTargets[0] || '',
    });
    toast.success('Setup complete!', 'Welcome to your workspace.');
    navigate('/dashboard');
  };

  const roadmapMsg = (p) => {
    if (p < 25) return 'Analysing target company requirements...';
    if (p < 50) return 'Calibrating experience benchmarks...';
    if (p < 75) return 'Compiling interview question banks...';
    if (p < 100) return 'Finalising your learning roadmap...';
    return 'Roadmap ready!';
  };

  const TOTAL_STEPS = 6;
  const progressPct = step > 1 && step < 8 ? ((step - 1) / TOTAL_STEPS) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg relative">
        {/* Progress bar */}
        {step > 1 && step < 8 && (
          <div className="h-0.5 bg-border-primary rounded-full mb-8 overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <div className="rounded-3xl border border-border-primary bg-bg-secondary shadow-premium p-8 overflow-hidden min-h-[480px] flex flex-col justify-between">
          <AnimatePresence mode="wait">

            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div key="s1" variants={slide} initial="initial" animate="enter" exit="exit" className="flex flex-col items-center text-center gap-6 flex-1 justify-center py-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-brand-blue/20 flex items-center justify-center">
                  <IoSparklesOutline size={28} className="text-brand-blue animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold font-heading text-text-primary">Welcome, {user?.name?.split(' ')[0]}!</h1>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
                    Let's set up your personalised interview prep workspace in a few quick steps.
                  </p>
                </div>
                <Button size="lg" onClick={() => setStep(2)} rightIcon={<IoArrowForwardOutline />}>
                  Let's get started
                </Button>
              </motion.div>
            )}

            {/* Step 2: Career goal */}
            {step === 2 && (
              <motion.div key="s2" variants={slide} initial="initial" animate="enter" exit="exit" className="space-y-5 flex flex-col flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Step 1 of {TOTAL_STEPS}</p>
                  <h2 className="text-xl font-bold font-heading text-text-primary mt-1">What's your target role?</h2>
                  <p className="text-xs text-text-tertiary mt-1">We'll tailor questions and roadmaps to this discipline.</p>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {CAREER_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.id} onClick={() => setCareerGoal(opt.id)}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          careerGoal === opt.id ? 'border-brand-blue bg-brand-blue/5' : 'border-border-primary hover:bg-surface-hover'
                        }`}>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${careerGoal === opt.id ? 'bg-brand-blue/15 text-brand-blue' : 'bg-surface text-text-tertiary'}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{opt.title}</p>
                          <p className="text-xs text-text-tertiary mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <NavButtons onBack={() => setStep(1)} onNext={() => setStep(3)} />
              </motion.div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <motion.div key="s3" variants={slide} initial="initial" animate="enter" exit="exit" className="space-y-5 flex flex-col flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Step 2 of {TOTAL_STEPS}</p>
                  <h2 className="text-xl font-bold font-heading text-text-primary mt-1">Your experience level?</h2>
                  <p className="text-xs text-text-tertiary mt-1">We'll scale interview difficulty accordingly.</p>
                </div>
                <div className="space-y-2.5 flex-1">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setExperience(opt.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        experience === opt.id ? 'border-brand-blue bg-brand-blue/5' : 'border-border-primary hover:bg-surface-hover'
                      }`}>
                      <p className="text-sm font-semibold text-text-primary">{opt.title}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <NavButtons onBack={() => setStep(2)} onNext={() => setStep(4)} />
              </motion.div>
            )}

            {/* Step 4: Resume upload */}
            {step === 4 && (
              <motion.div key="s4" variants={slide} initial="initial" animate="enter" exit="exit" className="space-y-5 flex flex-col flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Step 3 of {TOTAL_STEPS}</p>
                  <h2 className="text-xl font-bold font-heading text-text-primary mt-1">Upload your resume</h2>
                  <p className="text-xs text-text-tertiary mt-1">We'll extract your skills to personalise quizzes and interview questions.</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {uploadStatus === 'idle' && (
                    <label htmlFor="ob-upload" className="w-full cursor-pointer">
                      <div className="border-2 border-dashed border-border-primary rounded-2xl p-10 text-center hover:border-brand-blue/50 hover:bg-surface transition-all">
                        <IoCloudUploadOutline size={32} className="mx-auto text-text-tertiary mb-3" />
                        <p className="text-sm font-semibold text-text-primary">Drop your resume here</p>
                        <p className="text-xs text-text-tertiary mt-1">or click to select · PDF, DOCX, TXT</p>
                      </div>
                      <input id="ob-upload" type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                  {uploadStatus === 'uploading' && (
                    <div className="text-center space-y-4 py-4">
                      <span className="h-10 w-10 mx-auto rounded-full border-2 border-border-primary border-t-brand-blue animate-spin block" />
                      <div>
                        <p className="text-sm font-semibold text-brand-blue">Uploading & analysing...</p>
                        <p className="text-xs text-text-tertiary mt-1 font-mono">{uploadedName}</p>
                      </div>
                    </div>
                  )}
                  {uploadStatus === 'done' && (
                    <div className="text-center space-y-3 py-4">
                      <div className="h-12 w-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
                        <IoShieldCheckmarkOutline size={24} className="text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Resume uploaded!</p>
                      <p className="text-xs text-text-tertiary font-mono">{uploadedName}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border-primary">
                  <Button variant="ghost" size="sm" onClick={() => setStep(3)} leftIcon={<IoArrowBackOutline size={14} />}>Back</Button>
                  <div className="flex gap-2">
                    {uploadStatus !== 'done' && (
                      <Button variant="secondary" size="sm" onClick={() => setStep(5)}>Skip</Button>
                    )}
                    <Button size="sm" onClick={() => setStep(5)} disabled={uploadStatus === 'uploading'} rightIcon={<IoArrowForwardOutline size={14} />}>
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Target companies */}
            {step === 5 && (
              <motion.div key="s5" variants={slide} initial="initial" animate="enter" exit="exit" className="space-y-5 flex flex-col flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Step 4 of {TOTAL_STEPS}</p>
                  <h2 className="text-xl font-bold font-heading text-text-primary mt-1">Target companies</h2>
                  <p className="text-xs text-text-tertiary mt-1">We'll align interview questions to these companies' engineering cultures.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 content-start">
                  {COMPANY_OPTIONS.map(co => {
                    const sel = targets.includes(co);
                    return (
                      <button key={co} onClick={() => toggleTarget(co)}
                        className={`py-3 rounded-xl border text-sm font-semibold text-center cursor-pointer transition-all ${
                          sel ? 'border-brand-blue bg-brand-blue/8 text-brand-blue' : 'border-border-primary text-text-secondary hover:bg-surface-hover'
                        }`}>
                        {co}
                      </button>
                    );
                  })}
                </div>
                {targets.includes('Custom') && (
                  <input
                    type="text"
                    placeholder="e.g. Netflix, Airbnb, OpenAI..."
                    value={customCo}
                    onChange={e => setCustomCo(e.target.value)}
                    className="w-full rounded-xl border border-border-primary bg-surface px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-blue"
                  />
                )}
                <NavButtons
                  onBack={() => setStep(4)}
                  onNext={() => setStep(6)}
                  nextDisabled={targets.includes('Custom') && !customCo.trim()}
                />
              </motion.div>
            )}

            {/* Step 6: Build roadmap */}
            {step === 6 && (
              <motion.div key="s6" variants={slide} initial="initial" animate="enter" exit="exit" className="space-y-5 flex flex-col flex-1">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">Step 5 of {TOTAL_STEPS}</p>
                  <h2 className="text-xl font-bold font-heading text-text-primary mt-1">Build your roadmap</h2>
                  <p className="text-xs text-text-tertiary mt-1">We'll compile a personalised learning path based on your setup.</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {roadmapStatus === 'idle' && (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-text-secondary">Your goals are configured. Build your roadmap now.</p>
                      <Button leftIcon={<IoSparklesOutline />} onClick={buildRoadmap}>
                        Generate Roadmap
                      </Button>
                    </div>
                  )}
                  {roadmapStatus === 'building' && (
                    <div className="w-full text-center space-y-4">
                      <span className="h-10 w-10 mx-auto rounded-full border-2 border-border-primary border-t-brand-purple animate-spin block" />
                      <p className="text-sm font-semibold text-brand-purple">{roadmapMsg(roadmapProgress)}</p>
                      <div className="w-48 mx-auto h-1.5 rounded-full bg-border-primary overflow-hidden">
                        <motion.div animate={{ width: `${roadmapProgress}%` }} className="h-full bg-brand-purple rounded-full" />
                      </div>
                      <p className="text-xs text-text-tertiary">{roadmapProgress}%</p>
                    </div>
                  )}
                  {roadmapStatus === 'done' && (
                    <div className="text-center space-y-3">
                      <div className="h-12 w-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
                        <IoCheckmarkCircleSharp size={24} className="text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Roadmap compiled!</p>
                      <p className="text-xs text-text-tertiary">5 learning checkpoints ready.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border-primary">
                  <Button variant="ghost" size="sm" onClick={() => setStep(5)} leftIcon={<IoArrowBackOutline size={14} />} disabled={roadmapStatus === 'building'}>Back</Button>
                  <Button size="sm" onClick={() => setStep(7)} disabled={roadmapStatus !== 'done'} rightIcon={<IoArrowForwardOutline size={14} />}>
                    Finish setup
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Done */}
            {step === 7 && (
              <motion.div key="s7" variants={slide} initial="initial" animate="enter" exit="exit" className="flex flex-col items-center text-center gap-6 flex-1 justify-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center"
                >
                  <IoCheckmarkCircleSharp size={36} className="text-emerald-500" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-heading text-text-primary">All set!</h2>
                  <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                    Your workspace is personalised. Start with a mock interview or check your resume ATS score.
                  </p>
                </div>
                <Button size="lg" onClick={handleFinish} rightIcon={<IoArrowForwardOutline />}>
                  Enter workspace
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextDisabled = false }) {
  return (
    <div className="flex justify-between items-center pt-4 border-t border-border-primary">
      <Button variant="ghost" size="sm" onClick={onBack} leftIcon={<IoArrowBackOutline size={14} />}>Back</Button>
      <Button size="sm" onClick={onNext} disabled={nextDisabled} rightIcon={<IoArrowForwardOutline size={14} />}>Next</Button>
    </div>
  );
}
