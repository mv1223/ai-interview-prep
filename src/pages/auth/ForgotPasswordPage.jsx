import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMailOutline, IoArrowBackOutline, IoCheckmarkCircle } from 'react-icons/io5';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSentEmail(email);
      setSent(true);
      toast.success('Reset link sent!', `Check ${email} for instructions.`);
    } catch (err) {
      toast.error('Failed to send', err.message);
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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm font-heading">I</div>
          <span className="font-heading font-bold text-text-primary">InterviewAI Pro</span>
        </Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-7">
              <div>
                <h1 className="text-3xl font-bold font-heading text-text-primary">Reset your password</h1>
                <p className="mt-2 text-sm text-text-secondary">
                  Enter your email and we'll send you a link to reset your password.
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
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Send reset link
                </Button>
              </form>

              <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
                <IoArrowBackOutline size={14} /> Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-7">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center">
                <IoCheckmarkCircle size={32} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-heading text-text-primary">Check your email</h2>
                <p className="text-sm text-text-secondary">
                  We've sent a password reset link to <strong className="text-text-primary">{sentEmail}</strong>
                </p>
                <p className="text-xs text-text-tertiary">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
              </div>
              <div className="space-y-3">
                <Button fullWidth variant="secondary" onClick={() => setSent(false)}>
                  Try a different email
                </Button>
                <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary">
                  <IoArrowBackOutline size={14} /> Back to sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
