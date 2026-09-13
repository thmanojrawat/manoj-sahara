import React from 'react';
import { UserCircle, Shield, Key, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import { Input } from '../../components/common/FormControls.jsx';

export function MyAccount() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="My Account & Profile"
        subtitle="Manage your system credentials, role settings, and interface preferences"
        breadcrumbs={[{ label: 'System' }, { label: 'My Account' }]}
      />

      {/* Profile Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
            alt="Siddhartha Bannerjee"
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Siddhartha Bannerjee
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              Super Admin • Sahara Headquarters
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue="Siddhartha Bannerjee" />
          <Input label="Email Address" defaultValue="admin@sahararealty.com" />
          <Input label="Contact Phone" defaultValue="+91 98300 00001" />
          <Input label="Assigned Organization Role" defaultValue="Super Administrator" disabled />
        </div>

        {/* Theme Preferences */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Interface Color Theme
            </span>
            <span className="text-xs text-slate-400">
              Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={theme === 'dark' ? Sun : Moon}
            onClick={toggleTheme}
          >
            Toggle Theme
          </Button>
        </div>

        {/* Password Security Placeholder */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Change Password
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="primary">Update Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
