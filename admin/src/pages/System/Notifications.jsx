import React from 'react';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCrm();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        subtitle="Real-time alerts regarding new inquiries, scheduled showings, overdue payments, and lease expiries"
        breadcrumbs={[{ label: 'System' }, { label: 'Notifications' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={markAllNotificationsRead}
          >
            Mark All as Read
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !item.read
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                !item.read ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  {item.link && (
                    <Link
                      to={item.link}
                      onClick={() => markNotificationRead(item.id)}
                      className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      Open Module <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {!item.read && (
              <button
                onClick={() => markNotificationRead(item.id)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
