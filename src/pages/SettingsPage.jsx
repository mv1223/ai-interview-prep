import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  IoPersonOutline, 
  IoCardOutline, 
  IoCodeSlashOutline, 
  IoCheckmarkCircleSharp,
  IoSaveOutline,
  IoSchoolOutline,
  IoCallOutline,
  IoMailOutline
} from 'react-icons/io5';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  
  // Profile state form
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [company, setCompany] = useState(user?.company || '');
  const [college, setCollege] = useState(user?.college || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Billing credit details
  const [selectedPlan] = useState('Free Placement Prep Tier');
  const [copied, setCopied] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, role, company, college, dob, phone, gender, avatarUrl });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText("https://api.interviewai.pro/v1/webhooks/user-integration");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
          Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
          Manage your candidate metadata, view university credentials, and integrate external hooks.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation Quick Tabs */}
        <div className="md:col-span-4 space-y-2">
          {[
            { label: 'Profile Information', icon: IoPersonOutline, active: true },
            { label: 'Billing & Subscriptions', icon: IoCardOutline, active: false },
            { label: 'Developer Integrations', icon: IoCodeSlashOutline, active: false }
          ].map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-colors text-left ${
                  tab.active 
                    ? 'bg-slate-100 text-brand-blue dark:bg-neutral-850 dark:text-brand-blue font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-850/40'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab panels container */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Panel 1: Profile Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-6">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-800 pb-3">
              Candidate Profile
            </h3>

            {/* Profile Overview Card (Static Section) */}
            <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-150 dark:bg-neutral-950 dark:border-neutral-850">
              <img 
                src={user?.avatarUrl} 
                alt={user?.name} 
                className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-neutral-700 shadow-sm shrink-0" 
              />
              <div className="space-y-1.5 flex-1 text-xs">
                <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white leading-none">
                  {user?.name || 'Unregistered Candidate'}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1"><IoMailOutline /> {user?.email}</span>
                  {user?.phone && <span className="flex items-center gap-1"><IoCallOutline /> {user?.phone}</span>}
                  {user?.college && <span className="flex items-center gap-1"><IoSchoolOutline /> {user?.college}</span>}
                </div>
                <div className="flex gap-4 text-xxs text-slate-400 dark:text-neutral-500">
                  <span>Gender: <strong>{user?.gender || 'Not set'}</strong></span>
                  {user?.dob && <span>DOB: <strong>{user?.dob}</strong> (Age: {user?.age || '--'})</span>}
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Male" className="bg-white dark:bg-neutral-850">Male</option>
                    <option value="Female" className="bg-white dark:bg-neutral-850">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Target Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-450">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-850 dark:focus:border-brand-blue dark:focus:bg-neutral-900 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {saveSuccess ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-450">
                    <IoCheckmarkCircleSharp size={16} /> Profile updated successfully!
                  </span>
                ) : <span />}
                
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  <IoSaveOutline size={14} /> Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Panel 2: Billing Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-800 pb-3 mb-5">
              Billing & Subscriptions
            </h3>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-neutral-950 dark:border-neutral-850">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wide">Current Tier</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedPlan}</h4>
                <p className="text-[10px] text-slate-455 dark:text-neutral-500 mt-0.5">Free Placement Prep access enabled.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-center">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-neutral-850">
                <span className="text-xxs font-bold text-slate-400 dark:text-neutral-550 uppercase">MOCK CREDITS LEFT</span>
                <span className="block text-2xl font-extrabold text-brand-blue font-heading mt-1">Unlimited</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 dark:border-neutral-850">
                <span className="text-xxs font-bold text-slate-400 dark:text-neutral-550 uppercase">RESUME SCANS RUN</span>
                <span className="block text-2xl font-extrabold text-brand-purple font-heading mt-1">0 / Unlimited</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Developer Integration Tokens */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-800 pb-3 mb-5">
              Developer Credentials (API Access)
            </h3>
            
            <div className="space-y-4 text-xs">
              <p className="text-slate-500 dark:text-neutral-450">
                Generate keys to integrate mock resume evaluations or interview schedules directly inside your external portfolio scripts.
              </p>
              
              <div className="space-y-1.5">
                <label className="block text-xxs font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Live Webhook endpoint</label>
                <div className="flex gap-2 font-mono">
                  <input
                    type="text"
                    readOnly
                    value="https://api.interviewai.pro/v1/webhooks/user-integration"
                    className="flex-1 rounded-lg border border-slate-250 bg-neutral-950 text-emerald-400 px-3 py-2.5 text-xxs outline-none border-neutral-850"
                  />
                  <button 
                    onClick={handleCopyWebhook}
                    className="rounded-lg bg-neutral-800 px-4 text-xxs font-semibold text-neutral-300 hover:bg-neutral-700 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
