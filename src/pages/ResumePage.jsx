import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCloudUploadOutline, IoDocumentTextOutline, IoSparklesOutline,
  IoCheckmarkCircle, IoCloseOutline, IoArrowForwardOutline,
  IoCodeSlashOutline, IoConstructOutline, IoLayersOutline, IoSchoolOutline,
  IoShieldCheckmarkOutline, IoAlertCircleOutline, IoTrendingUpOutline,
} from 'react-icons/io5';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

function SkillChip({ name }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-border-primary bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-brand-blue/40 hover:text-brand-blue transition-colors">
      {name}
    </span>
  );
}

function SkillSection({ icon: Icon, title, skills, color }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={15} className={color} />
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{title}</h4>
        <span className="text-xs text-text-tertiary">({skills.length})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => <SkillChip key={s} name={s} />)}
      </div>
    </div>
  );
}

export default function ResumePage() {
  const {
    status, isAnalyzing, fileName, fileSize, uploadProgress,
    analysisStep, extractedSkills, atsAnalysis, atsScore,
    optimizations, generatedQuizQuestions, uploadResume,
    applyOptimization, resetResume, hasResume,
  } = useResume();
  const toast = useToast();

  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('score'); // score | skills | optimize

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleFile = (file) => {
    const allowed = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      toast.error('Unsupported file', 'Please upload a PDF, DOC, DOCX, or TXT file.');
      return;
    }
    uploadResume(file);
    toast.info('Uploading...', `Analysing ${file.name}`);
  };

  const handleApply = (id) => {
    applyOptimization(id);
    toast.success('Suggestion applied!', 'ATS score updated.');
  };

  const handleReset = () => {
    resetResume();
    setActiveTab('score');
  };

  const scoreColor = atsScore >= 85 ? '#10b981' : atsScore >= 70 ? '#3b82f6' : '#f97316';

  const TABS = [
    { id: 'score', label: 'ATS Score' },
    { id: 'skills', label: `Skills${extractedSkills ? ` (${Object.values(extractedSkills).flat().length})` : ''}` },
    { id: 'optimize', label: `Optimize${optimizations.length > 0 ? ` (${optimizations.filter(o => !o.applied).length})` : ''}` },
  ];

  return (
    <div className="space-y-7 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">Resume Analyser</h1>
          <p className="text-sm text-text-secondary mt-1">
            Upload your CV to extract skills, calculate ATS score, and get personalised quiz questions.
          </p>
        </div>
        {hasResume && (
          <Button variant="secondary" size="sm" onClick={handleReset} leftIcon={<IoCloseOutline size={15} />}>
            Upload new resume
          </Button>
        )}
      </div>

      {/* Upload zone — only shown before upload */}
      {!hasResume && status !== 'analyzing' && status !== 'uploading' && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed transition-all duration-200 p-12 text-center cursor-pointer group ${
            dragActive
              ? 'border-brand-blue bg-brand-blue/5'
              : 'border-border-primary hover:border-brand-blue/50 hover:bg-surface'
          }`}
          onClick={() => document.getElementById('resume-file-input')?.click()}
        >
          <input
            id="resume-file-input"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
              dragActive ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-border-primary bg-surface text-text-tertiary group-hover:border-brand-blue/50 group-hover:text-brand-blue'
            }`}>
              <IoCloudUploadOutline size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">
                {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-text-tertiary mt-1">or <span className="text-brand-blue font-medium">click to browse</span></p>
              <p className="text-xs text-text-tertiary mt-2">Supports PDF, DOC, DOCX, TXT · Max 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload/analysis progress */}
      {(status === 'uploading' || status === 'analyzing') && (
        <div className="rounded-2xl border border-border-primary bg-bg-secondary p-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                <IoSparklesOutline size={28} className="text-brand-blue animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-bg-secondary border-t-brand-blue animate-spin bg-brand-blue/10" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-text-primary">
                {status === 'uploading' ? 'Uploading resume...' : 'Analysing your resume...'}
              </p>
              <p className="text-sm text-brand-blue font-medium">{analysisStep || 'Processing...'}</p>
            </div>
            {status === 'uploading' && (
              <div className="w-64 space-y-1.5">
                <div className="h-1.5 rounded-full bg-border-primary overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    className="h-full rounded-full bg-brand-blue"
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-text-tertiary">{Math.round(Math.min(uploadProgress, 100))}%</p>
              </div>
            )}
            {status === 'analyzing' && (
              <div className="flex gap-2">
                {['Extracting skills', 'Computing ATS', 'Generating quiz'].map((step, i) => (
                  <div key={step} className="flex items-center gap-1.5 text-xs text-text-tertiary">
                    <span className={`h-1.5 w-1.5 rounded-full animate-bounce bg-brand-blue`} style={{ animationDelay: `${i * 200}ms` }} />
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results — uploaded & analysed */}
      {hasResume && (
        <>
          {/* File info banner */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/10 dark:border-emerald-800/30 px-4 py-3">
            <IoShieldCheckmarkOutline size={18} className="text-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 truncate">{fileName}</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">{fileSize} · Analysis complete</p>
            </div>
            <IoCheckmarkCircle size={18} className="text-emerald-500 shrink-0" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border-primary">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-bg-secondary text-text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── ATS Score tab ── */}
            {activeTab === 'score' && (
              <motion.div key="score" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="grid lg:grid-cols-12 gap-5">
                  {/* Ring */}
                  <div className="lg:col-span-4 rounded-2xl border border-border-primary bg-bg-secondary p-6 flex flex-col items-center gap-4">
                    <ProgressRing
                      value={atsScore}
                      size={150}
                      strokeWidth={11}
                      color={scoreColor}
                      label={`${atsScore}%`}
                      sublabel="ATS SCORE"
                    />
                    <div className="text-center">
                      <Badge color={atsScore >= 85 ? 'green' : atsScore >= 70 ? 'blue' : 'amber'}>
                        {atsScore >= 85 ? 'Excellent match' : atsScore >= 70 ? 'Good — apply suggestions' : 'Needs improvement'}
                      </Badge>
                      <p className="text-xs text-text-tertiary mt-2 leading-relaxed">
                        Apply all suggestions to reach <strong className="text-text-primary">98%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Strengths + Missing */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Strengths */}
                    {atsAnalysis?.strengths?.length > 0 && (
                      <div className="rounded-2xl border border-emerald-200/40 bg-emerald-50/30 dark:bg-emerald-950/10 dark:border-emerald-800/20 p-5 space-y-3">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <IoCheckmarkCircle size={14} /> Strengths detected
                        </p>
                        <ul className="space-y-1.5">
                          {atsAnalysis.strengths.map(s => (
                            <li key={s} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                              <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing keywords */}
                    {atsAnalysis?.missingKeywords?.length > 0 && (
                      <div className="rounded-2xl border border-amber-200/40 bg-amber-50/30 dark:bg-amber-950/10 dark:border-amber-800/20 p-5 space-y-3">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                          <IoAlertCircleOutline size={14} /> Missing high-demand keywords
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.missingKeywords.map(kw => (
                            <span key={kw} className="inline-flex items-center gap-1 rounded-lg border border-amber-200/50 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvement tips */}
                    {atsAnalysis?.improvements?.length > 0 && (
                      <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 space-y-2">
                        <p className="text-xs font-bold text-text-secondary flex items-center gap-2">
                          <IoTrendingUpOutline size={14} /> Improvement tips
                        </p>
                        <ul className="space-y-1.5">
                          {atsAnalysis.improvements.map(tip => (
                            <li key={tip} className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed">
                              <span className="h-1 w-1 rounded-full bg-text-tertiary shrink-0 mt-1.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quiz prompt */}
                {generatedQuizQuestions.length > 0 && (
                  <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {generatedQuizQuestions.length} personalised quiz questions ready
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Questions generated from your extracted resume skills.
                      </p>
                    </div>
                    <Link to="/quiz">
                      <Button size="sm" variant="outline" rightIcon={<IoArrowForwardOutline size={14} />}>
                        Take quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Skills tab ── */}
            {activeTab === 'skills' && extractedSkills && (
              <motion.div key="skills" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-6"
              >
                <p className="text-sm text-text-secondary">
                  {Object.values(extractedSkills).flat().length} skills extracted from your resume.
                </p>
                <SkillSection icon={IoCodeSlashOutline} title="Programming Languages" skills={extractedSkills.languages} color="text-brand-blue" />
                <SkillSection icon={IoLayersOutline} title="Frameworks & Libraries" skills={extractedSkills.frameworks} color="text-brand-purple" />
                <SkillSection icon={IoConstructOutline} title="Tools & Technologies" skills={extractedSkills.tools} color="text-brand-orange" />
                <SkillSection icon={IoSchoolOutline} title="Soft Skills & Practices" skills={extractedSkills.soft} color="text-brand-emerald" />
              </motion.div>
            )}

            {/* ── Optimizations tab ── */}
            {activeTab === 'optimize' && (
              <motion.div key="optimize" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-secondary">
                    {optimizations.filter(o => o.applied).length} of {optimizations.length} suggestions applied.
                    {optimizations.filter(o => o.applied).length > 0 && (
                      <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium">+{optimizations.filter(o => o.applied).length * 6}% ATS boost</span>
                    )}
                  </p>
                </div>

                {optimizations.map(opt => (
                  <div
                    key={opt.id}
                    className={`rounded-2xl border p-5 space-y-4 transition-all ${
                      opt.applied ? 'border-emerald-200/40 bg-emerald-50/20 dark:bg-emerald-950/5 dark:border-emerald-800/20 opacity-75' : 'border-border-primary bg-bg-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge color="purple">{opt.section}</Badge>
                      {opt.applied ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <IoCheckmarkCircle size={15} /> Applied
                        </span>
                      ) : (
                        <Button size="xs" onClick={() => handleApply(opt.id)}>
                          Apply suggestion
                        </Button>
                      )}
                    </div>

                    {/* Red/green diff */}
                    <div className="grid md:grid-cols-2 gap-3 font-mono text-xs">
                      <div className="rounded-xl border border-red-200/30 bg-red-50/20 dark:bg-red-950/10 dark:border-red-800/20 p-3 space-y-1.5">
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">— Original</p>
                        <p className="text-red-700 dark:text-red-300 leading-relaxed">{opt.original}</p>
                      </div>
                      <div className="rounded-xl border border-emerald-200/30 bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-800/20 p-3 space-y-1.5">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">+ AI Optimised</p>
                        <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">{opt.optimized}</p>
                      </div>
                    </div>

                    <p className="flex items-start gap-2 text-xs text-text-secondary">
                      <IoSparklesOutline className="text-brand-purple shrink-0 mt-0.5" size={12} />
                      <span><strong>Why this helps:</strong> {opt.impact}</span>
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
