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
        <h1 className="text-3xl font-bold font-heading text-text-primary">
          AI Resume & ATS Optimizer
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Scan your CV for Applicant Tracking System (ATS) matching keywords and merge optimizations directly.
        </p>
      </div>

      {/* Main Optimizer Dashboard Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Upload Dropzone & Gauge score */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* File Dropzone card */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm">
            <h3 className="text-sm font-bold font-heading text-text-primary mb-4">
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
                  ? 'border-brand-blue bg-blue-50/10 dark:border-blue-500/20' 
                  : 'border-border-primary hover:border-slate-350 bg-bg-secondary'
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
                <div className="h-10 w-10 rounded-full bg-bg-primary text-text-secondary flex items-center justify-center mb-3">
                  <IoCloudUploadOutline size={20} />
                </div>
                <span className="text-xs font-bold text-text-primary">
                  Drag and drop PDF here
                </span>
                <span className="text-xxs text-text-secondary mt-1">
                  or click to select standard documents
                </span>
              </label>
            </div>

            {/* Uploaded File status */}
            {fileName && (
              <div className="mt-4 p-3 bg-bg-primary rounded-lg border border-border-primary flex items-center gap-2 text-xs">
                <IoDocumentTextOutline className="text-brand-blue shrink-0" size={16} />
                <span className="text-text-primary truncate flex-1 font-medium">{fileName}</span>
                <button
                  onClick={resetResume}
                  className="text-text-secondary hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            )}
          </div>

          {/* ATS score gauge chart */}
          <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold font-heading text-text-primary mb-6">
              ATS Score Analytics
            </h3>

            {isAnalyzing ? (
              <div className="h-32 flex flex-col items-center justify-center">
                <span className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-brand-blue animate-spin" />
                <span className="text-xxs text-text-secondary mt-3 font-semibold uppercase tracking-wider animate-pulse">Running Scan...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Custom circular progress gauge */}
                <div 
                  className="relative h-32 w-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#3b82f6 ${atsScore * 3.6}deg, var(--border-primary) 0deg)`
                  }}
                >
                  <div className="h-[108px] w-[108px] rounded-full bg-bg-secondary flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-extrabold font-heading text-text-primary">{atsScore}%</span>
                    <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">FIT VALUE</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-text-secondary">
                  {!fileName ? (
                    <span className="text-text-secondary">No resume uploaded.</span>
                  ) : atsScore >= 85 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Excellent compatibility rating.</span>
                  ) : atsScore >= 75 ? (
                    <span className="text-brand-blue dark:text-blue-400">Ready to submit. Apply suggestions.</span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">Below standard filter. Merge recommendations.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Optimization Accordion (Before vs After Diff) */}
        <div className="lg:col-span-8 rounded-2xl border border-border-primary bg-bg-secondary shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border-primary flex items-center justify-between shrink-0 bg-bg-primary/30">
            <h3 className="text-base font-bold font-heading text-text-primary">
              Optimization Checklist
            </h3>
            <span className="text-xs text-text-secondary font-semibold">
              {fileName ? `${optimizations.filter(o => o.applied).length} of ${optimizations.length} merged` : '0 merged'}
            </span>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
            {isAnalyzing ? (
              <div className="space-y-4">
                {[1, 2, 3].map((val) => (
                  <div key={val} className="h-28 rounded-lg bg-bg-primary/50 border border-border-primary animate-pulse" />
                ))}
              </div>
            ) : !fileName ? (
              /* Premium Empty State */
              <div className="py-14 text-center flex flex-col items-center justify-center space-y-4">
                <IoDocumentTextOutline size={48} className="text-text-secondary opacity-30 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-primary">No Resume Uploaded Yet</h4>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    Please upload your CV document in the left panel to scan keywords, calculate ATS matching values, and reveal interactive optimizations.
                  </p>
                </div>
              </div>
            ) : (
              optimizations.map((opt) => (
                <div 
                  key={opt.id}
                  className={`rounded-xl border p-5 space-y-3 transition-colors ${
                    opt.applied 
                      ? 'border-border-secondary bg-bg-primary/30' 
                      : 'border-border-primary bg-bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xxs font-bold uppercase tracking-wider text-brand-purple bg-purple-50/15 dark:bg-purple-950/20 px-2.5 py-0.5 rounded">
                      {opt.section}
                    </span>
                    {opt.applied ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-450">
                        <IoCheckmarkCircleSharp size={16} /> Applied to Resume
                      </span>
                    ) : (
                      <button
                        onClick={() => applyOptimization(opt.id)}
                        className="rounded-lg bg-brand-blue px-3 py-1.5 text-xxs font-semibold text-white hover:bg-blue-600 shadow-sm transition-all cursor-pointer"
                      >
                        Apply Suggestion
                      </button>
                    )}
                  </div>

                  {/* Red/Green side-by-side diff mock */}
                  <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                    {/* Before (Red) */}
                    <div className="p-3 bg-red-50/15 rounded-lg border border-red-200/20 text-red-600 dark:bg-red-950/10 dark:text-red-400">
                      <span className="block text-[9px] font-bold text-red-500 uppercase tracking-widest mb-1.5">- Original Text</span>
                      {opt.original}
                    </div>

                    {/* After (Green) */}
                    <div className="p-3 bg-emerald-50/15 rounded-lg border border-emerald-200/20 text-emerald-600 dark:bg-emerald-950/10 dark:text-emerald-400">
                      <span className="block text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">+ AI Recommendation</span>
                      {opt.optimized}
                    </div>
                  </div>

                  {/* Explanation context */}
                  <p className="text-xxs text-text-secondary flex items-start gap-1 leading-normal">
                    <IoSparklesOutline className="shrink-0 text-brand-purple mt-0.5" />
                    <span><strong>Impact logic:</strong> {opt.impact}</span>
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
