import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  Building2,
  Users2,
  Kanban,
  Receipt,
  CheckCheck,
  ExternalLink,
  LogOut,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useCrm } from '../../context/CrmContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

export function AdminNavbar({ onMobileMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCrm();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Close all menus on outside click
  const closeAllMenus = () => {
    setShowNotifMenu(false);
    setShowQuickMenu(false);
    setShowUserMenu(false);
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 no-print">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings, leads, clients, deals (press Enter)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleGlobalSearch}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Action, Theme, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick “+ New” Menu */}
        <div className="relative">
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => { closeAllMenus(); setShowQuickMenu(v => !v); }}
          >
            <span className="hidden sm:inline">Create</span>
          </Button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-40"
              onClick={() => setShowQuickMenu(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Actions
              </div>
              <Link
                to="/properties?action=new"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                Add Property Listing
              </Link>
              <Link
                to="/leads?action=new"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Users2 className="w-4 h-4 text-blue-600" />
                New Lead Inquiry
              </Link>
              <Link
                to="/deals?action=new"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Kanban className="w-4 h-4 text-purple-600" />
                Initiate New Deal
              </Link>
              <Link
                to="/payments?action=new"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                Record Payment
              </Link>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { closeAllMenus(); setShowNotifMenu(v => !v); }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifMenu && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-40"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl ${
                        !notif.read ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Link
                          to={notif.link || '/notifications'}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            setShowNotifMenu(false);
                          }}
                          className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          View Details <ExternalLink className="w-3 h-3" />
                        </Link>
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Pill with Dropdown */}
        <div className="relative">
          <button
            onClick={() => { closeAllMenus(); setShowUserMenu(v => !v); }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline px-1">
              {user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Admin'}
            </span>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
              alt={user?.name || 'Admin'}
              className="w-7 h-7 rounded-full object-cover border border-amber-500/50"
            />
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-40"
              onClick={() => setShowUserMenu(false)}
            >
              {/* User info header */}
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {user?.role}
                </span>
              </div>

              {/* My Account */}
              <Link
                to="/my-account"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <UserCircle className="w-4 h-4 text-slate-500" />
                My Account
              </Link>

              {/* Divider */}
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
