import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { IoLockClosedOutline, IoCheckmarkCircle, IoArrowForwardOutline } from 'react-icons/io5';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo-token';

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      toast.success('Password reset!', 'You can now sign in with your new password.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error('Reset failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm font-heading">I</div>
          <span className="font-heading font-bold text-text-primary">InterviewAI Pro</span>
        </Link>

        {!done ? (
          <div className="space-y-7">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-5">
                <IoLockClosedOutline size={22} className="text-brand-blue" />
              </div>
              <h1 className="text-3xl font-bold font-heading text-text-primary">Set new password</h1>
              <p className="mt-2 text-sm text-text-secondary">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="Minimum 8 characters"
                hint="Use letters, numbers, and symbols for a strong password"
                error={errors.password?.message}
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="Repeat your password"
                error={errors.confirm?.message}
                required
                {...register('confirm', {
                  required: 'Please confirm your password',
                  validate: v => v === password || 'Passwords do not match',
                })}
              />

              {/* Strength indicator */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= i * 2
                          ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-brand-blue' : 'bg-emerald-500'
                          : 'bg-border-primary'
                      }`} />
                    ))}
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {password.length < 8 ? 'Too short' : password.length < 12 ? 'Fair' : password.length < 16 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}

              <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<IoArrowForwardOutline />}>
                Reset password
              </Button>
            </form>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
              <IoCheckmarkCircle size={32} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-text-primary">Password updated!</h2>
              <p className="text-sm text-text-secondary mt-2">Redirecting you to sign in…</p>
            </div>
            <div className="h-1 w-full bg-border-primary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
