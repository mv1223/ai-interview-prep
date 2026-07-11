import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { IoMailUnreadOutline, IoRefreshOutline, IoCheckmarkCircle, IoArrowBackOutline } from 'react-icons/io5';
import Button from '../../components/ui/Button';

export default function EmailVerificationPage() {
  const { user, verifyEmail, resendVerification, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const iv = setInterval(() => setResendCooldown(c => c - 1), 1000);
    return () => clearInterval(iv);
  }, [resendCooldown]);

  // Simulate auto-verify after 5 seconds (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      // In production, you'd poll or use a callback here
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await verifyEmail();
      toast.success('Email verified!', 'Your account is now active.');
      navigate('/onboarding');
    } catch (err) {
      toast.error('Verification failed', err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    try {
      await resendVerification();
      toast.success('Email sent!', `Verification email sent to ${user?.email}`);
      setResendCooldown(60);
    } catch {
      toast.error('Failed to resend', 'Please try again in a moment.');
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center space-y-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-blue/15 to-brand-purple/15 border border-brand-blue/20 flex items-center justify-center"
        >
          <IoMailUnreadOutline size={36} className="text-brand-blue" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-heading text-text-primary">Check your inbox</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            We've sent a verification link to
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-border-primary bg-surface px-4 py-2.5">
            <IoMailUnreadOutline size={15} className="text-brand-blue shrink-0" />
            <span className="text-sm font-semibold text-text-primary">{user?.email || 'your email address'}</span>
          </div>
          <p className="text-xs text-text-tertiary leading-relaxed">
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5 text-left space-y-3">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">What to do</p>
          {[
            'Open the email from InterviewAI Pro',
            'Click "Verify my email" in the message',
            'You\'ll be redirected back automatically',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm text-text-secondary">{step}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Simulate verify for demo */}
          <Button fullWidth size="lg" onClick={handleVerify} loading={verifying} leftIcon={<IoCheckmarkCircle size={18} />}>
            I've verified my email
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleResend}
            loading={resending}
            disabled={resendCooldown > 0}
            leftIcon={<IoRefreshOutline size={16} />}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'}
          </Button>
        </div>

        <button
          onClick={handleBackToLogin}
          className="flex items-center justify-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition-colors mx-auto cursor-pointer"
        >
          <IoArrowBackOutline size={14} /> Back to login
        </button>
      </motion.div>
    </div>
  );
}
