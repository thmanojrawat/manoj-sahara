import React from 'react';
import { ShieldCheck, Check, X, Users } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export function Roles() {
  const { roles } = useCrm();

  const permissionModules = [
    { key: 'properties', label: 'Properties & Inventory', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'leads', label: 'Leads Pipeline', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
    { key: 'deals', label: 'Deals & Sales', actions: ['view', 'create', 'edit', 'approve'] },
    { key: 'payments', label: 'Payments & Financials', actions: ['view', 'create', 'edit', 'approve'] },
    { key: 'reports', label: 'Reports & BI', actions: ['view', 'export'] }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Enterprise Permission Matrix"
        subtitle="Role-Based Access Control (RBAC) governing visibility, record creation, financial approvals, and export rights"
        breadcrumbs={[{ label: 'System' }, { label: 'Roles & Permissions' }]}
      />

      <div className="space-y-6">
        {roles.map(role => (
          <div
            key={role.id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  {role.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {role.description}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold self-start">
                {role.userCount} Assigned Users
              </span>
            </div>

            {/* Permission Grid for this role */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissionModules.map(mod => {
                const perms = role.permissions?.[mod.key] || {};
                return (
                  <div
                    key={mod.key}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                      {mod.label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {mod.actions.map(act => {
                        const hasPerm = Boolean(perms[act]);
                        return (
                          <span
                            key={act}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${
                              hasPerm
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400 line-through'
                            }`}
                          >
                            {hasPerm ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {act}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roles;
