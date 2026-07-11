import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  IoPersonOutline, IoCardOutline, IoShieldOutline,
  IoSunnyOutline, IoMoonOutline, IoCheckmarkCircle,
  IoCameraOutline, IoSaveOutline, IoLogOutOutline,
  IoMailOutline, IoCallOutline, IoSchoolOutline,
} from 'react-icons/io5';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const TABS = [
  { id: 'profile', label: 'Profile', icon: IoPersonOutline },
  { id: 'appearance', label: 'Appearance', icon: IoSunnyOutline },
  { id: 'account', label: 'Account', icon: IoShieldOutline },
];

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      college: user?.college || '',
      role: user?.role || '',
      company: user?.company || '',
      dob: user?.dob || '',
      gender: user?.gender || 'Male',
    },
  });

  const onSave = async (data) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    updateProfile(data);
    toast.success('Profile updated!', 'Your changes have been saved.');
    setSaving(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ avatarUrl: ev.target.result });
      toast.success('Avatar updated!', 'Your profile photo has been changed.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your profile, preferences, and account.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Sidebar tabs */}
        <div className="md:col-span-3">
          <nav className="space-y-1 rounded-2xl border border-border-primary bg-bg-secondary p-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-surface-hover text-brand-blue font-semibold'
                      : 'text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-9 space-y-5">

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Avatar card */}
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6">
                <h3 className="text-sm font-bold text-text-primary mb-5 pb-3 border-b border-border-primary">Profile Photo</h3>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name}
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-border-primary"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <IoCameraOutline size={22} className="text-white" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                    <p className="text-xs text-text-tertiary">{user?.email}</p>
                    <Button size="xs" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                      Change photo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Profile form */}
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6">
                <h3 className="text-sm font-bold text-text-primary mb-5 pb-3 border-b border-border-primary">Personal Information</h3>
                <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full name" error={errors.name?.message}
                      {...register('name', { required: 'Required' })} />
                    <Input label="Email address" type="email" leftIcon={<IoMailOutline size={15} />}
                      error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Phone number" leftIcon={<IoCallOutline size={15} />}
                      {...register('phone')} />
                    <Input label="College / University" leftIcon={<IoSchoolOutline size={15} />}
                      {...register('college')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Target role" {...register('role')} />
                    <Input label="Target company" {...register('company')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Date of birth" type="date" {...register('dob')} />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">Gender</label>
                      <select
                        {...register('gender')}
                        className="w-full rounded-xl border border-border-primary bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/12 transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-border-primary">
                    <Button
                      type="submit"
                      loading={saving}
                      leftIcon={<IoSaveOutline size={15} />}
                    >
                      Save changes
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Appearance tab */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-6">
              <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-primary">Appearance</h3>

              <div className="space-y-3">
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: IoSunnyOutline, desc: 'Clean and bright' },
                    { id: 'dark', label: 'Dark', icon: IoMoonOutline, desc: 'Easy on the eyes' },
                  ].map(t => {
                    const Icon = t.icon;
                    const isSelected = isDark ? t.id === 'dark' : t.id === 'light';
                    return (
                      <button
                        key={t.id}
                        onClick={() => { if ((t.id === 'dark') !== isDark) toggleTheme(); }}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-border-primary hover:bg-surface-hover'
                        }`}
                      >
                        <Icon size={20} className={isSelected ? 'text-brand-blue mt-0.5' : 'text-text-tertiary mt-0.5'} />
                        <div>
                          <p className={`text-sm font-semibold ${isSelected ? 'text-brand-blue' : 'text-text-primary'}`}>{t.label}</p>
                          <p className="text-xs text-text-tertiary mt-0.5">{t.desc}</p>
                        </div>
                        {isSelected && <IoCheckmarkCircle size={18} className="text-brand-blue ml-auto mt-0.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-border-primary bg-surface p-4">
                <p className="text-xs text-text-tertiary">
                  Your theme preference is saved automatically and persists across sessions.
                </p>
              </div>
            </motion.div>
          )}

          {/* Account tab */}
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Plan info */}
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-4">
                <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-primary">Subscription</h3>
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border-secondary">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Free Plan</p>
                    <p className="text-xs text-text-tertiary mt-0.5">Unlimited mock interviews & quizzes</p>
                  </div>
                  <Badge color="green">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-4 rounded-xl border border-border-secondary">
                    <p className="text-xl font-extrabold font-heading text-brand-blue">∞</p>
                    <p className="text-xs text-text-tertiary mt-1">Mock sessions</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border-secondary">
                    <p className="text-xl font-extrabold font-heading text-brand-purple">∞</p>
                    <p className="text-xs text-text-tertiary mt-1">Resume scans</p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 space-y-4">
                <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-primary">Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border-secondary">
                    <div>
                      <p className="text-sm font-medium text-text-primary">Email verification</p>
                      <p className="text-xs text-text-tertiary">{user?.email}</p>
                    </div>
                    <Badge color={user?.emailVerified ? 'green' : 'amber'} dot>
                      {user?.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <Button variant="secondary" size="sm" fullWidth>
                    Change password
                  </Button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-danger/20 bg-danger/3 p-6 space-y-4">
                <h3 className="text-sm font-bold text-danger pb-3 border-b border-danger/20">Danger Zone</h3>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Sign out of all devices</p>
                    <p className="text-xs text-text-tertiary mt-0.5">Removes all active sessions</p>
                  </div>
                  <Button variant="danger" size="sm" leftIcon={<IoLogOutOutline size={15} />} onClick={logout}>
                    Sign out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
