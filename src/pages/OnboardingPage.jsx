import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoArrowForwardOutline, 
  IoArrowBackOutline,
  IoSchoolOutline,
  IoCodeSlashOutline,
  IoServerOutline,
  IoBriefcaseOutline,
  IoCheckmarkCircleSharp,
  IoCloudUploadOutline,
  IoSparklesOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5';

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const { uploadResume } = useResume();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [careerGoal, setCareerGoal] = useState('Frontend');
  const [experience, setExperience] = useState('Junior');
  const [targetCompanies, setTargetCompanies] = useState(['Google']);
  const [customCompany, setCustomCompany] = useState('');
  
  // Resume upload status simulation
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'analyzing' | 'extracting' | 'success'

  // Roadmap generation state simulation
  const [roadmapStatus, setRoadmapStatus] = useState('idle'); // 'idle' | 'compiling' | 'success'
  const [roadmapProgress, setRoadmapProgress] = useState(0);

  const careerGoalOptions = [
    { id: 'Frontend', title: 'Frontend Engineer', icon: IoCodeSlashOutline, desc: 'React, Next.js, CSS architecture, performance optimizations, and web core vitals.' },
    { id: 'Backend', title: 'Backend Architect', icon: IoServerOutline, desc: 'APIs design, database optimization, caching systems, microservices, and system scaling.' },
    { id: 'Full Stack', title: 'Full Stack Engineer', icon: IoBriefcaseOutline, desc: 'Client components routing integration with database layers and DevOps deployment structures.' },
    { id: 'AI/ML', title: 'AI / ML Engineer', icon: IoSparklesOutline, desc: 'Model architectures training, neural networks, vector databases, and weights fine-tuning.' },
    { id: 'Data Analyst', title: 'Data Analyst', icon: IoSchoolOutline, desc: 'Analytical pipelines metrics, business intelligence tracking, and statistical aggregations.' }
  ];

  const experienceOptions = [
    { id: 'Intern', title: 'Intern / Apprentice', desc: 'Seeking foundational industry placement parameters.' },
    { id: 'Junior', title: 'Junior Engineer (0-2 years)', desc: 'Focusing on clean logic implementation and collaborative workflows.' },
    { id: 'Mid-Level', title: 'Mid-Level Architect (2-5 years)', desc: 'Focusing on scalable component hierarchies and systems optimizations.' },
    { id: 'Senior', title: 'Senior Tech Lead (5+ years)', desc: 'Directing system architectures, mentoring teams, and scaling core infrastructure.' }
  ];

  const companyOptions = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Accenture', 'Startup', 'Custom'];

  const handleToggleCompany = (comp) => {
    setTargetCompanies(prev => 
      prev.includes(comp) 
        ? prev.filter(c => c !== comp) 
        : [...prev, comp]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadStatus('uploading');

    // Simulate Step 4 upload experience triggers
    setTimeout(() => {
      setUploadStatus('analyzing');
      setTimeout(() => {
        setUploadStatus('extracting');
        setTimeout(() => {
          setUploadStatus('success');
          setFileUploaded(true);
          uploadResume(file); // Synchronizes the resume context
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const triggerRoadmapGeneration = () => {
    setRoadmapStatus('compiling');
    
    // Simulate Step 6 progression counter with status texts
    const interval = setInterval(() => {
      setRoadmapProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRoadmapStatus('success');
          return 100;
        }
        return p + 4;
      });
    }, 100);
  };

  const handleFinalize = () => {
    // Map custom company choice
    const finalCompanies = targetCompanies.map(c => c === 'Custom' ? customCompany : c).filter(Boolean);
    
    // Save onboarding details into Auth Profile Context
    completeOnboarding({
      careerGoal,
      experienceLevel: experience,
      targetCompanies: finalCompanies,
      role: `${careerGoal} Developer`,
      company: finalCompanies[0] || 'Enterprise Corp'
    });
    navigate('/dashboard');
  };

  const getRoadmapStatusText = (progress) => {
    if (progress < 25) return 'Scanning target company requirements...';
    if (progress < 50) return 'Calibrating experience level guidelines...';
    if (progress < 75) return 'Compiling diagnostic practice syllabus...';
    if (progress < 100) return 'Designing custom mock interview milestones...';
    return 'Roadmap compiled successfully!';
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 transition-colors duration-300">
      {/* Onboarding Box */}
      <div className="w-full max-w-2xl bg-bg-secondary border border-border-primary rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col justify-between min-h-[540px] transition-all duration-300 relative overflow-hidden">
        
        {/* Top Progress bar */}
        {step > 1 && step < 7 && (
          <div className="absolute top-0 inset-x-0 h-1 bg-border-primary">
            <div 
              className="h-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-300"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME SCREEN */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 text-center py-6"
            >
              <div className="mx-auto h-16 w-16 rounded-3xl bg-blue-50/20 dark:bg-blue-950/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                <IoSparklesOutline size={30} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight">
                  Calibrate Your Career Path
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                  Welcome, <span className="font-bold text-text-primary">{user?.name}</span>. Let's calibrate your tech goals to build a personalized interview roadmap.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-text-primary px-6 py-3.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer shadow-premium"
                >
                  Configure Career Goal <IoArrowForwardOutline size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHOOSE CAREER GOAL */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Step 1 of 5</span>
                  <h2 className="text-xl font-bold font-heading text-text-primary">Choose Your Tech Discipline</h2>
                  <p className="text-xs text-text-secondary">We will tailor behavioral questions and roadmap checkpoints to this stack.</p>
                </div>

                <div className="grid gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {careerGoalOptions.map(opt => {
                    const Icon = opt.icon;
                    const isSelected = careerGoal === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setCareerGoal(opt.id)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-brand-blue bg-blue-50/10 dark:border-blue-500 dark:bg-blue-950/15' 
                            : 'border-border-primary hover:bg-surface-hover bg-bg-secondary'
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSelected 
                            ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' 
                            : 'bg-bg-primary border-border-primary text-text-secondary'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-text-primary block">{opt.title}</span>
                          <span className="text-[10px] text-text-secondary block mt-1 leading-relaxed">{opt.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border-primary mt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                >
                  <IoArrowBackOutline /> Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer"
                >
                  Next Step <IoArrowForwardOutline />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT EXPERIENCE LEVEL */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Step 2 of 5</span>
                  <h2 className="text-xl font-bold font-heading text-text-primary">What is Your Experience Level?</h2>
                  <p className="text-xs text-text-secondary">We will scale interviewer difficulty and algorithm criteria accordingly.</p>
                </div>

                <div className="grid gap-3">
                  {experienceOptions.map(opt => {
                    const isSelected = experience === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setExperience(opt.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-brand-blue bg-blue-50/10 dark:border-blue-500 dark:bg-blue-950/15' 
                            : 'border-border-primary hover:bg-surface-hover bg-bg-secondary'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-primary block">{opt.title}</span>
                        <span className="text-[10px] text-text-secondary block mt-1">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border-primary mt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                >
                  <IoArrowBackOutline /> Back
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer"
                >
                  Next Step <IoArrowForwardOutline />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: UPLOAD RESUME ANALYSIS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Step 3 of 5</span>
                  <h2 className="text-xl font-bold font-heading text-text-primary">Calibrate Your Resume Document</h2>
                  <p className="text-xs text-text-secondary">Upload your resume. Our AI parser will index key skills and compile custom test metrics.</p>
                </div>

                {/* Upload sandbox area */}
                <div className="border border-border-primary rounded-2xl bg-bg-primary/50 p-6 space-y-4">
                  {uploadStatus === 'idle' && (
                    <div className="border border-dashed border-border-primary hover:border-brand-blue/50 rounded-xl p-8 text-center transition-all bg-bg-secondary relative">
                      <input 
                        type="file" 
                        id="onb-upload"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="onb-upload" className="cursor-pointer flex flex-col items-center">
                        <IoCloudUploadOutline size={26} className="text-text-secondary mb-2" />
                        <span className="text-xs font-bold text-text-primary">Drag & drop resume PDF here</span>
                        <span className="text-[10px] text-text-secondary mt-0.5">or click to choose files from disk</span>
                      </label>
                    </div>
                  )}

                  {/* Upload status simulations */}
                  {uploadStatus !== 'idle' && (
                    <div className="p-6 rounded-xl bg-bg-secondary border border-border-primary space-y-4 text-center">
                      <div className="flex justify-center">
                        {uploadStatus === 'success' ? (
                          <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center animate-bounce">
                            <IoShieldCheckmarkOutline size={22} />
                          </div>
                        ) : (
                          <span className="h-8 w-8 rounded-full border-2 border-border-primary border-t-brand-blue animate-spin" />
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        {uploadStatus === 'uploading' && <p className="font-semibold text-brand-blue">Connecting secure document server...</p>}
                        {uploadStatus === 'analyzing' && <p className="font-semibold text-brand-purple">Scanning ATS compatibility grids...</p>}
                        {uploadStatus === 'extracting' && <p className="font-semibold text-orange-500">Mapping job-matching indices...</p>}
                        {uploadStatus === 'success' && (
                          <div>
                            <p className="font-semibold text-emerald-605 text-emerald-600">CV calibrated successfully!</p>
                            <span className="text-[10px] text-text-secondary mt-1 block font-mono">{uploadedFileName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border-primary mt-4">
                <button 
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                >
                  <IoArrowBackOutline /> Back
                </button>
                <div className="flex gap-2">
                  {!fileUploaded && (
                    <button 
                      onClick={() => setStep(5)}
                      className="px-4 py-2.5 rounded-xl border border-border-primary text-xs font-semibold hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      Skip Resume
                    </button>
                  )}
                  <button 
                    onClick={() => setStep(5)}
                    disabled={uploadStatus !== 'success' && uploadStatus !== 'idle'}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                  >
                    Next Step <IoArrowForwardOutline />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CHOOSE TARGET COMPANIES */}
          {step === 5 && (
            <motion.div
              key="step-5"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Step 4 of 5</span>
                  <h2 className="text-xl font-bold font-heading text-text-primary">Select Target Companies</h2>
                  <p className="text-xs text-text-secondary">We will map interview scenarios to the engineering structures of these companies.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {companyOptions.map(comp => {
                    const isSelected = targetCompanies.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => handleToggleCompany(comp)}
                        className={`p-3 rounded-xl border text-center font-heading font-semibold text-xs transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-brand-blue bg-blue-50/20 text-brand-blue dark:border-blue-500 dark:bg-blue-950/20' 
                            : 'border-border-primary hover:border-text-secondary bg-bg-secondary text-text-secondary'
                        }`}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Company slide-in input block */}
                <AnimatePresence>
                  {targetCompanies.includes('Custom') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 overflow-hidden"
                    >
                      <label className="block text-xxs font-bold uppercase tracking-wider text-text-secondary mb-1">
                        Custom Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Netflix, OpenAI, Vercel..."
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        className="w-full rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue text-text-primary"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border-primary mt-4">
                <button 
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                >
                  <IoArrowBackOutline /> Back
                </button>
                <button 
                  onClick={() => setStep(6)}
                  disabled={targetCompanies.includes('Custom') && !customCompany.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                >
                  Next Step <IoArrowForwardOutline />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: ROADMAP GENERATION SCREEN */}
          {step === 6 && (
            <motion.div
              key="step-6"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Step 5 of 5</span>
                  <h2 className="text-xl font-bold font-heading text-text-primary">Generate Your Learning Roadmap</h2>
                  <p className="text-xs text-text-secondary">We compile custom technical syllabus modules according to your profiles.</p>
                </div>

                <div className="p-6 border border-border-primary rounded-2xl bg-bg-primary/50 space-y-4">
                  {roadmapStatus === 'idle' && (
                    <div className="text-center py-6">
                      <p className="text-xs text-text-secondary mb-4">Your goals, experience, and target companies are locked. Compile roadmap now.</p>
                      <button 
                        onClick={triggerRoadmapGeneration}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-purple px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-colors shadow-glow-purple cursor-pointer"
                      >
                        <IoSparklesOutline /> Compile Placement Roadmap
                      </button>
                    </div>
                  )}

                  {roadmapStatus === 'compiling' && (
                    <div className="space-y-4 text-center">
                      <span className="h-6 w-6 rounded-full border-2 border-border-primary border-t-brand-purple animate-spin inline-block" />
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-brand-purple min-h-[18px]">
                          {getRoadmapStatusText(roadmapProgress)}
                        </p>
                        <span className="text-[10px] text-text-secondary block">Assembling checkpoints ({roadmapProgress}%)</span>
                      </div>
                      <div className="w-full bg-border-primary h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-purple transition-all duration-100" style={{ width: `${roadmapProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {roadmapStatus === 'success' && (
                    <div className="text-center py-6 space-y-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto">
                        <IoCheckmarkCircleSharp size={24} />
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-emerald-600">Roadmap Compiled Successfully!</p>
                        <span className="text-[10px] text-text-secondary block">5 syllabus checkpoints ready for mock simulator training.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border-primary mt-4">
                <button 
                  onClick={() => setStep(5)}
                  disabled={roadmapStatus === 'compiling'}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer disabled:opacity-40 transition-colors"
                >
                  <IoArrowBackOutline /> Back
                </button>
                <button 
                  onClick={() => setStep(7)}
                  disabled={roadmapStatus !== 'success'}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-text-primary px-5 py-2.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                >
                  Complete Calibration <IoArrowForwardOutline />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: GO TO DASHBOARD CONGRATS */}
          {step === 7 && (
            <motion.div
              key="step-7"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6 text-center py-8"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shadow-inner">
                <IoCheckmarkCircleSharp size={32} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary">Calibration Complete</h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Your custom learning path is compiled. Enter your dashboard workspace to upload resumes and begin AI-assisted coding reviews.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={handleFinalize}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-text-primary px-8 py-3.5 text-xs font-semibold text-bg-secondary hover:opacity-90 transition-all shadow-premium cursor-pointer"
                >
                  Enter Prep Workspace <IoArrowForwardOutline />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
