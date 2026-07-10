import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IoCloseOutline, IoMailOpenOutline, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, signup } = useAuth();
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup extra fields
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [customAvatar, setCustomAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Mail service simulation states
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  // Age helper calculation
  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);
    if (!value) {
      setAge('');
      return;
    }
    const today = new Date();
    const birthDate = new Date(value);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge >= 0 ? calculatedAge : 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (authModalTab === 'signup') {
      if (!name || !college || !dob || !phone) {
        setError('Please provide all details (name, college, date of birth, and phone number).');
        return;
      }

      // Simulate sending confirmation email
      setIsSendingEmail(true);
      setTimeout(() => {
        setIsSendingEmail(false);
        setEmailSent(true);
        setTimeout(() => {
          setEmailSent(false);
          signup(name, email, college, dob, age, phone, gender, customAvatar ? avatarUrl : '');
        }, 2200);
      }, 2000);
    } else {
      login(email);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSendingEmail && !emailSent) setAuthModalOpen(false);
          }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-premium dark:border-neutral-800 dark:bg-neutral-900 z-10"
        >
          {/* Close button */}
          {!isSendingEmail && !emailSent && (
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            >
              <IoCloseOutline size={22} />
            </button>
          )}

          {/* 1. SENDING EMAIL LOADER STATE */}
          {isSendingEmail && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <span className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-brand-blue animate-spin" />
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">Connecting Mail Server...</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-450 max-w-xs leading-relaxed">
                Sending a secure signup confirmation email to <span className="font-bold text-slate-700 dark:text-white">{email}</span>.
              </p>
            </div>
          )}

          {/* 2. EMAIL SENT SUCCESS STATE */}
          {emailSent && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center dark:bg-emerald-950/30">
                <IoMailOpenOutline size={24} className="animate-bounce" />
              </div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">Confirmation Mail Sent!</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-450 max-w-xs leading-relaxed">
                Check your inbox at <span className="font-bold text-slate-700 dark:text-white">{email}</span> to verify your account credentials.
              </p>
              <div className="text-[10px] text-brand-blue font-semibold flex items-center gap-1">
                <IoCheckmarkCircleSharp /> Loading your workspace...
              </div>
            </div>
          )}

          {/* 3. CORE LOGIN/SIGNUP STATE */}
          {!isSendingEmail && !emailSent && (
            <>
              {/* Heading */}
              <div className="text-center">
                <h2 className="text-2xl font-bold font-heading tracking-tight text-slate-900 dark:text-white">
                  InterviewAI <span className="text-gradient">Pro</span>
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
                  {authModalTab === 'login' ? 'Welcome back. Sign in to your account.' : 'Create your account to start preparing.'}
                </p>
              </div>

              {/* Tab buttons */}
              <div className="mt-6 flex border-b border-slate-100 dark:border-neutral-800">
                <button
                  onClick={() => { setAuthModalTab('login'); setError(''); }}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors ${authModalTab === 'login' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModalTab('signup'); setError(''); }}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors ${authModalTab === 'signup' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-lg bg-red-55/10 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {authModalTab === 'signup' && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Sarah Connor"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20 animate-none"
                      />
                    </div>

                    {/* College */}
                    <div>
                      <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="Stanford University"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                      />
                    </div>

                    {/* DOB & Age Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          onChange={handleDobChange}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                          Age (Calculated)
                        </label>
                        <input
                          type="text"
                          readOnly
                          placeholder="--"
                          value={age}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-105 px-3.5 py-2 text-xs outline-none dark:border-neutral-850 dark:bg-neutral-950 text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2831"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                      />
                    </div>

                    {/* Gender select */}
                    <div>
                      <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-brand-blue focus:bg-white dark:border-neutral-800 dark:bg-neutral-805 dark:text-slate-200 dark:focus:bg-neutral-900 text-slate-700"
                      >
                        <option value="Male" className="bg-white dark:bg-neutral-850 text-slate-800 dark:text-slate-200">Male</option>
                        <option value="Female" className="bg-white dark:bg-neutral-850 text-slate-800 dark:text-slate-200">Female</option>
                      </select>
                    </div>

                    {/* Checkbox custom profile photo */}
                    <div className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id="customAvatar"
                        checked={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.checked)}
                        className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue/40"
                      />
                      <label htmlFor="customAvatar" className="text-xxs font-semibold text-slate-500 dark:text-neutral-450 cursor-pointer">
                        Add a custom profile photo
                      </label>
                    </div>

                    {/* Optional Custom profile link */}
                    {customAvatar && (
                      <div>
                        <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                          Profile Photo URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sarah.c@cyberdyne.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none transition-all focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:focus:border-brand-blue dark:focus:bg-neutral-900 dark:focus:ring-brand-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/70 dark:bg-white dark:text-slate-950 dark:hover:bg-neutral-100 cursor-pointer"
                >
                  {authModalTab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
                </button>
              </form>

              {/* Terms info */}
              <p className="mt-6 text-center text-xxs text-slate-400 dark:text-neutral-500">
                By continuing, you agree to InterviewAI Pro's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
