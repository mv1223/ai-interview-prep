/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'

  const login = (email) => {
    const mockUser = {
      name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      email: email,
      role: 'Software Engineer',
      company: 'Stripe',
      isPremium: true,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      onboardingCompleted: true, // Bypass onboarding for demo fast path
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthModalOpen(false);
  };

  const signup = (name, email, college, dob, age, phone, gender, avatarUrl) => {
    const defaultAvatar = gender === 'Female'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

    const mockUser = {
      name,
      email,
      college,
      dob,
      age,
      phone,
      gender,
      role: 'Frontend Developer Candidate',
      company: 'Placement Prep',
      isPremium: true,
      avatarUrl: avatarUrl || defaultAvatar,
      onboardingCompleted: false, // Force onboarding for new registrations
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const completeOnboarding = (onboardingData) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...onboardingData, onboardingCompleted: true };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      completeOnboarding,
      authModalOpen,
      setAuthModalOpen,
      authModalTab,
      setAuthModalTab,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
