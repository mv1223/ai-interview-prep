import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { ResumeProvider } from './context/ResumeContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// High-fidelity fallback loading screen
const PageLoader = () => (
  <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
    <div className="relative flex items-center justify-center">
      <span className="absolute h-12 w-12 rounded-full border-2 border-slate-200 border-t-brand-blue animate-spin dark:border-neutral-800 dark:border-t-brand-blue" />
    </div>
  </div>
);

export default function App() {
  const routerBasename = import.meta.env.DEV ? '/' : '/ai-interview-prep';

  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <ResumeProvider>
            <BrowserRouter basename={routerBasename}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Route */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Secure App Shell Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/interview" element={<InterviewPage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ResumeProvider>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
