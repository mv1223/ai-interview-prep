/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'interviewai_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // ─── Auth actions ────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    // Simulate login - returns a promise for loading state handling
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email) { reject(new Error('Email is required')); return; }
        if (!password || password.length < 6) { reject(new Error('Invalid credentials')); return; }

        const firstName = email.split('@')[0].split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        const newUser = {
          id: 'user-' + Date.now(),
          name: firstName,
          email,
          role: 'Software Engineer',
          company: '',
          college: '',
          phone: '',
          dob: '',
          age: '',
          gender: 'Male',
          avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}&backgroundColor=b6e3f4`,
          isPremium: false,
          onboardingCompleted: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          careerGoal: 'Frontend',
          experienceLevel: 'Junior',
          targetCompanies: [],
        };
        // Clear any stale activity data from previous sessions
        localStorage.removeItem('interviews');
        localStorage.removeItem('quizzes');
        setUser(newUser);
        saveUser(newUser);
        resolve(newUser);
      }, 1200);
    });
  }, []);

  const register = useCallback((data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { name, email, password, college, dob, phone, gender } = data;
        if (!name || !email || !password) { reject(new Error('All fields are required')); return; }
        if (password.length < 8) { reject(new Error('Password must be at least 8 characters')); return; }

        // Calculate age from DOB
        let age = '';
        if (dob) {
          const today = new Date();
          const birth = new Date(dob);
          let a = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
          age = a >= 0 ? String(a) : '';
        }

        const newUser = {
          id: 'user-' + Date.now(),
          name,
          email,
          role: 'Frontend Developer Candidate',
          company: '',
          college: college || '',
          phone: phone || '',
          dob: dob || '',
          age,
          gender: gender || 'Male',
          avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
          isPremium: false,
          onboardingCompleted: false, // triggers onboarding flow
          emailVerified: false, // triggers email verification
          pendingVerificationEmail: email,
          createdAt: new Date().toISOString(),
          careerGoal: 'Frontend',
          experienceLevel: 'Junior',
          targetCompanies: [],
        };
        // Clear any stale activity data from previous sessions
        localStorage.removeItem('interviews');
        localStorage.removeItem('quizzes');
        setUser(newUser);
        saveUser(newUser);
        resolve(newUser);
      }, 1400);
    });
  }, []);

  const verifyEmail = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, emailVerified: true };
          saveUser(updated);
          return updated;
        });
        resolve();
      }, 800);
    });
  }, []);

  const resendVerification = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('interviews');
    localStorage.removeItem('quizzes');
  }, []);

  const updateProfile = useCallback((data) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveUser(updated);
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback((data) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data, onboardingCompleted: true };
      saveUser(updated);
      return updated;
    });
  }, []);

  const updateAvatar = useCallback((url) => {
    updateProfile({ avatarUrl: url });
  }, [updateProfile]);

  // ─── Password reset simulation ───────────────────────────────────────────
  const sendPasswordReset = useCallback((email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email) { reject(new Error('Email is required')); return; }
        resolve();
      }, 1200);
    });
  }, []);

  const resetPassword = useCallback((token, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!token || !newPassword) { reject(new Error('Invalid request')); return; }
        if (newPassword.length < 8) { reject(new Error('Password must be at least 8 characters')); return; }
        resolve();
      }, 1000);
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isEmailVerified: user?.emailVerified ?? false,
      hasCompletedOnboarding: user?.onboardingCompleted ?? false,
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
      updateProfile,
      completeOnboarding,
      updateAvatar,
      sendPasswordReset,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
