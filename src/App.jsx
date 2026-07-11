import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { ResumeProvider } from './context/ResumeContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// ─── Lazy pages ───────────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('./pages/LandingPage'));
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'));
const EmailVerifyPage   = lazy(() => import('./pages/auth/EmailVerificationPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const OnboardingPage    = lazy(() => import('./pages/OnboardingPage'));

// App pages
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const InterviewPage  = lazy(() => import('./pages/InterviewPage'));
const ResumePage     = lazy(() => import('./pages/ResumePage'));
const QuizPage       = lazy(() => import('./pages/QuizPage'));
const RoadmapPage    = lazy(() => import('./pages/RoadmapPage'));
const ProgressPage   = lazy(() => import('./pages/ProgressPage'));
const SettingsPage   = lazy(() => import('./pages/SettingsPage'));

// ─── Full-screen loader ───────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border-2 border-border-primary border-t-brand-blue animate-spin" />
          <span className="absolute inset-2 rounded-full border border-border-secondary border-t-brand-purple animate-spin" style={{ animationDuration: '0.7s' }} />
        </div>
        <p className="text-xs font-medium text-text-tertiary animate-pulse">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  const base = import.meta.env.DEV ? '/' : '/ai-interview-prep';

  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <ResumeProvider>
            <ToastProvider>
              <BrowserRouter basename={base}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public */}
                    <Route path="/"               element={<LandingPage />} />
                    <Route path="/login"          element={<LoginPage />} />
                    <Route path="/register"       element={<RegisterPage />} />
                    <Route path="/verify-email"   element={<EmailVerifyPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/onboarding"     element={<OnboardingPage />} />

                    {/* Protected app shell */}
                    <Route element={<DashboardLayout />}>
                      <Route path="/dashboard"  element={<Dashboard />} />
                      <Route path="/interview"  element={<InterviewPage />} />
                      <Route path="/resume"     element={<ResumePage />} />
                      <Route path="/quiz"       element={<QuizPage />} />
                      <Route path="/roadmap"    element={<RoadmapPage />} />
                      <Route path="/progress"   element={<ProgressPage />} />
                      <Route path="/settings"   element={<SettingsPage />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ToastProvider>
          </ResumeProvider>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
