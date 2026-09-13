import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Users2,
  UserCheck,
  UserSquare2,
  Clock,
  CalendarCheck,
  Calendar,
  Layers,
  FolderGit2,
  Building,
  Grid2X2,
  Kanban,
  BadgeDollarSign,
  ReceiptText,
  Percent,
  KeyRound,
  FileCheck2,
  MapPin,
  Sparkle,
  BarChart3,
  ShieldCheck,
  Bell,
  History,
  Trash2,
  Settings,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const { followUps, notifications, trash } = useCrm();

  const overdueCount = followUps.filter(f => f.category === 'Overdue' || (f.status === 'Pending' && f.dueDate < '13/09/2026')).length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const trashCount = trash.length;

  const navigationGroups = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'AI' }
      ]
    },
    {
      label: 'CRM',
      items: [
        { label: 'Properties', path: '/properties', icon: Building2 },
        { label: 'Leads', path: '/leads', icon: Users2 },
        { label: 'Clients', path: '/clients', icon: UserCheck },
        { label: 'Brokers / Agents', path: '/brokers', icon: UserSquare2 },
        { label: 'Follow-Ups', path: '/follow-ups', icon: Clock, count: overdueCount, countVariant: 'danger' },
        { label: 'Site Visits', path: '/site-visits', icon: CalendarCheck },
        { label: 'Appointments', path: '/appointments', icon: Calendar }
      ]
    },
    {
      label: 'Inventory',
      items: [
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
        { label: 'Buildings & Floors', path: '/buildings-floors', icon: Building },
        { label: 'Units Matrix', path: '/units', icon: Grid2X2 },
        { label: 'Inventory Overview', path: '/inventory', icon: Layers }
      ]
    },
    {
      label: 'Sales',
      items: [
        { label: 'Deals Pipeline', path: '/deals', icon: Kanban },
        { label: 'Bookings', path: '/bookings', icon: BadgeDollarSign },
        { label: 'Payments Ledger', path: '/payments', icon: ReceiptText },
        { label: 'Commissions', path: '/commissions', icon: Percent }
      ]
    },
    {
      label: 'Rentals',
      items: [
        { label: 'Tenancies', path: '/tenancies', icon: KeyRound },
        { label: 'Agreements', path: '/agreements', icon: FileCheck2 }
      ]
    },
    {
      label: 'Catalog',
      items: [
        { label: 'Owners / Vendors', path: '/vendors', icon: Users2 },
        { label: 'Locations', path: '/locations', icon: MapPin },
        { label: 'Amenities', path: '/amenities', icon: Sparkle }
      ]
    },
    {
      label: 'Analytics',
      items: [
        { label: 'Reports & BI', path: '/reports', icon: BarChart3 }
      ]
    },
    {
      label: 'System',
      items: [
        { label: 'Users Directory', path: '/users', icon: UserCircle },
        { label: 'Roles & Permissions', path: '/roles', icon: ShieldCheck },
        { label: 'Notifications', path: '/notifications', icon: Bell, count: unreadNotifCount },
        { label: 'Activity Logs', path: '/activity-logs', icon: History },
        { label: 'Trash', path: '/trash', icon: Trash2, count: trashCount },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'My Account', path: '/my-account', icon: UserCircle }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold shadow-md shrink-0">
            S
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-wider text-base text-slate-900 dark:text-white leading-tight">
                SAHARA
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 truncate">
                Real Estate ERP
              </span>
            </div>
          )}
        </NavLink>

        {/* Mobile close or desktop toggle button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'opacity-75'}`} />
                        {!isCollapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!isCollapsed && item.count !== undefined && item.count > 0 && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                              item.countVariant === 'danger'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                        {!isCollapsed && item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-600 dark:bg-amber-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <NavLink
          to="/my-account"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
            alt="Siddhartha Bannerjee"
            className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Siddhartha B.
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                Super Admin • Kolkata HQ
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`fixed top-0 bottom-0 left-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
