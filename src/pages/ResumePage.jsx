import { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { 
  IoCloudUploadOutline, 
  IoDocumentTextOutline, 
  IoSparklesOutline, 
  IoCheckmarkCircleSharp,
  IoCloseOutline
} from 'react-icons/io5';

export default function ResumePage() {
  const { 
    isAnalyzing, 
    atsScore, 
    fileName, 
    optimizations, 
    uploadResume, 
    applyOptimization, 
    resetResume 
  } = useResume();

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadResume(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
          AI Resume & ATS Optimizer
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
          Scan your CV for Applicant Tracking System (ATS) matching keywords and merge optimizations directly.
        </p>
      </div>

      {/* Main Optimizer Dashboard Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Upload Dropzone & Gauge score */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* File Dropzone card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <h3 className="text-sm font-bold font-heading text-slate-950 dark:text-white mb-4">
              Resume Document
            </h3>
            
            {/* Interactive drop area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragActive 
                  ? 'border-brand-blue bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20' 
                  : 'border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-750'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 flex items-center justify-center mb-3">
                  <IoCloudUploadOutline size={20} />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                  Drag and drop PDF here
                </span>
                <span className="text-xxs text-slate-400 dark:text-neutral-500 mt-1">
                  or click to select standard documents
                </span>
              </label>
            </div>

            {/* Uploaded File status */}
            {fileName && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 flex items-center gap-2 text-xs">
                <IoDocumentTextOutline className="text-brand-blue shrink-0" size={16} />
                <span className="text-slate-700 dark:text-neutral-350 truncate flex-1 font-medium">{fileName}</span>
                <button
                  onClick={resetResume}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                  title="Remove file"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            )}
          </div>

          {/* ATS score gauge chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold font-heading text-slate-950 dark:text-white mb-6">
              ATS Score Analytics
            </h3>

            {isAnalyzing ? (
              <div className="h-32 flex flex-col items-center justify-center">
                <span className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-brand-blue animate-spin" />
                <span className="text-xxs text-slate-400 mt-3 font-semibold uppercase tracking-wider animate-pulse">Running Scan...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Custom circular progress gauge */}
                <div 
                  className="relative h-32 w-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#3b82f6 ${atsScore * 3.6}deg, #e2e8f0 0deg)`
                  }}
                >
                  <div className="h-[108px] w-[108px] rounded-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-extrabold font-heading text-slate-950 dark:text-white">{atsScore}%</span>
                    <span className="text-[10px] text-slate-450 dark:text-neutral-500 font-semibold uppercase tracking-wider">FIT VALUE</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 dark:text-neutral-450">
                  {atsScore >= 85 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Excellent compatibility rating.</span>
                  ) : atsScore >= 75 ? (
                    <span className="text-brand-blue dark:text-blue-400">Ready to submit. Apply details below for 90%+ score.</span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">Below standard filter. Merge recommendations.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Optimization Accordion (Before vs After Diff) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Optimization Checklist
            </h3>
            <span className="text-xs text-slate-400 dark:text-neutral-500">
              {optimizations.filter(o => o.applied).length} of {optimizations.length} merged
            </span>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
            {isAnalyzing ? (
              <div className="space-y-4">
                {[1, 2, 3].map((val) => (
                  <div key={val} className="h-28 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 animate-pulse" />
                ))}
              </div>
            ) : (
              optimizations.map((opt) => (
                <div 
                  key={opt.id}
                  className={`rounded-xl border p-5 space-y-3 transition-colors ${
                    opt.applied 
                      ? 'border-slate-100 bg-slate-50/50 dark:border-neutral-850 dark:bg-neutral-950/40' 
                      : 'border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xxs font-bold uppercase tracking-wider text-brand-purple bg-purple-50 dark:bg-purple-950/30 px-2.5 py-0.5 rounded">
                      {opt.section}
                    </span>
                    {opt.applied ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <IoCheckmarkCircleSharp size={16} /> Applied to Resume
                      </span>
                    ) : (
                      <button
                        onClick={() => applyOptimization(opt.id)}
                        className="rounded-lg bg-brand-blue px-3 py-1.5 text-xxs font-semibold text-white hover:bg-blue-600 shadow-sm transition-all"
                      >
                        Apply Suggestion
                      </button>
                    )}
                  </div>

                  {/* Red/Green side-by-side diff mock */}
                  <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                    {/* Before (Red) */}
                    <div className="p-3 bg-red-50/40 rounded-lg border border-red-150/40 text-red-700 dark:bg-red-950/10 dark:border-red-900/30 dark:text-red-400">
                      <span className="block text-[9px] font-bold text-red-500 uppercase tracking-widest mb-1.5">- Original Text</span>
                      {opt.original}
                    </div>

                    {/* After (Green) */}
                    <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-150/40 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-400">
                      <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">+ AI Recommendation</span>
                      {opt.optimized}
                    </div>
                  </div>

                  {/* Explanation context */}
                  <p className="text-xxs text-slate-450 dark:text-neutral-500 flex items-start gap-1 leading-normal">
                    <IoSparklesOutline className="shrink-0 text-brand-purple mt-0.5" />
                    <strong>Impact logic:</strong> {opt.impact}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
