import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import {
  IoPersonOutline, IoMailOutline, IoCallOutline,
  IoSchoolOutline, IoArrowForwardOutline, IoCheckmarkCircle,
} from 'react-icons/io5';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const FEATURES = [
  'AI-powered mock interviews from your resume',
  'ATS resume scanner with smart suggestions',
  'Skill-based quiz generation',
  'Detailed performance analytics',
  'Personalized learning roadmap',
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { gender: 'Male' },
  });

  const dobValue = watch('dob');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created!', 'Please verify your email to continue.');
      navigate('/verify-email');
    } catch (err) {
      toast.error('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#0b0f1a] via-[#0d1526] to-[#0f0d1f] flex-col justify-between p-12">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-blue/8 blur-[90px] pointer-events-none" />

        <Link to="/" className="flex items-center gap-2.5 z-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold font-heading">I</div>
          <span className="font-heading font-bold text-white text-lg">InterviewAI Pro</span>
        </Link>

        <div className="z-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Everything you need to land your dream role.</h2>
            <p className="mt-2 text-white/50 text-sm leading-relaxed">Your AI career coach is ready. Join thousands of developers who landed senior roles.</p>
          </div>
          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-brand-blue/20 flex items-center justify-center shrink-0">
                  <IoCheckmarkCircle size={14} className="text-brand-blue" />
                </div>
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg space-y-7"
        >
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm">I</div>
            <span className="font-heading font-bold text-text-primary">InterviewAI Pro</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold font-heading text-text-primary">Create your account</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-blue hover:underline font-medium">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full name"
              placeholder="Alex Johnson"
              leftIcon={<IoPersonOutline size={16} />}
              error={errors.name?.message}
              required
              {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
            />

            {/* Email */}
            <Input
              label="Email address"
              type="email"
              placeholder="alex@example.com"
              leftIcon={<IoMailOutline size={16} />}
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              hint="Use a mix of letters, numbers, and symbols"
              error={errors.password?.message}
              required
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters required' },
              })}
            />

            {/* College */}
            <Input
              label="College / University"
              placeholder="MIT, Stanford, IIT, etc."
              leftIcon={<IoSchoolOutline size={16} />}
              error={errors.college?.message}
              {...register('college')}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <Input
                label="Phone number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                leftIcon={<IoCallOutline size={16} />}
                error={errors.phone?.message}
                {...register('phone')}
              />

              {/* DOB */}
              <Input
                label="Date of birth"
                type="date"
                error={errors.dob?.message}
                {...register('dob')}
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female'].map(g => (
                  <label key={g} className="relative cursor-pointer">
                    <input type="radio" value={g} className="sr-only peer" {...register('gender')} />
                    <div className="flex items-center justify-center py-3 rounded-xl border border-border-primary text-sm font-medium text-text-secondary transition-all peer-checked:border-brand-blue peer-checked:bg-brand-blue/5 peer-checked:text-brand-blue hover:bg-surface-hover">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              rightIcon={<IoArrowForwardOutline />}
            >
              Create free account
            </Button>
          </form>

          <p className="text-center text-xs text-text-tertiary">
            By creating an account, you agree to our{' '}
            <span className="text-text-secondary hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-text-secondary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
