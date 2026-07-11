import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import {
  IoMailOutline, IoArrowForwardOutline, IoLogoGithub,
} from 'react-icons/io5';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success('Welcome back!', `Signed in as ${user.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Sign in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login
  const handleDemo = async () => {
    setLoading(true);
    try {
      const user = await login('demo@interviewai.pro', 'demo1234');
      toast.success('Demo account loaded', `Welcome, ${user.name}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Demo login failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0f1729] to-[#0d0d1a] flex-col justify-between p-12">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 z-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold font-heading">I</div>
          <span className="font-heading font-bold text-white text-lg">InterviewAI Pro</span>
        </Link>

        {/* Quote block */}
        <div className="z-10 space-y-8">
          <div className="space-y-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-base">★</span>
              ))}
            </div>
            <p className="text-white/80 text-lg leading-relaxed font-light max-w-sm">
              "InterviewAI Pro predicted the exact React questions I got at Google. Landed my L5 role!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Sarah"
                className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <p className="text-white text-sm font-semibold">Sarah Connor</p>
                <p className="text-white/50 text-xs">Senior Engineer, Google</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { val: '14k+', label: 'Offers Secured' },
              { val: '94%', label: 'ATS Match Rate' },
              { val: '8.6×', label: 'More Callbacks' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold font-heading text-white">{s.val}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm font-heading">I</div>
            <span className="font-heading font-bold text-text-primary">InterviewAI Pro</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold font-heading text-text-primary">Welcome back</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign in to your workspace. Don't have an account?{' '}
              <Link to="/register" className="text-brand-blue hover:underline font-medium">Sign up free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<IoMailOutline size={16} />}
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <div className="mt-1.5 text-right">
                <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              rightIcon={<IoArrowForwardOutline />}
            >
              Sign in
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-primary" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-primary px-3 text-xs text-text-tertiary">or continue with</span>
            </div>
          </div>

          {/* Demo access */}
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={handleDemo}
            loading={loading}
            leftIcon={<span className="text-base">🚀</span>}
          >
            Continue with Demo Account
          </Button>

          <p className="text-center text-xs text-text-tertiary">
            By signing in, you agree to our{' '}
            <span className="text-text-secondary hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-text-secondary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
