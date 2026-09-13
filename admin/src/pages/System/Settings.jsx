import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Globe, DollarSign, Shield, RotateCcw } from 'lucide-react';
import { useCrm } from '../../context/CrmContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import { Input, Select, Textarea } from '../../components/common/FormControls.jsx';

export function Settings() {
  const { resetAllData } = useCrm();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Platform Settings"
        subtitle="Configure company legal entities, RERA registration, Indian currency formatting, and default commission rules"
        breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Company Profile */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            Company & Entity Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Platform Trade Name" defaultValue="SAHARA Real Estate Platform" />
            <Input label="Registered Entity Name" defaultValue="Sahara Infra-Realty Private Limited" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="West Bengal RERA Registration" defaultValue="WBRERA/A/KOL/2023/000108" />
            <Input label="Corporate Identity No (CIN)" defaultValue="U70109WB2023PTC261900" />
          </div>
          <Textarea
            label="Corporate Headquarters Address"
            defaultValue="Level 14, Sahara Tech Vista Towers, Block EP & GP, Sector V, Bidhannagar, Kolkata 700091, West Bengal"
          />
        </div>

        {/* Currency & Localization */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-600" />
            Localization & Currency Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Base Currency" defaultValue="INR (₹)" disabled />
            <Input label="Numbering Standard" defaultValue="Indian (Lakhs & Crores)" disabled />
            <Input label="Standard Date Format" defaultValue="DD/MM/YYYY" disabled />
          </div>
        </div>

        {/* Commission Rules */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            Brokerage & Incentive Governance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Residential Commission (%)" defaultValue="2.0%" />
            <Input label="Commercial Sale Commission (%)" defaultValue="2.0%" />
            <Input label="Commercial Leasing" defaultValue="1 Month Rent" />
          </div>
        </div>

        {/* System Reset & Data Refresh */}
        <div className="rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-6 shadow-xs flex items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Reset Local Storage Mock Data
            </h4>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
              Reset all CRM state to the default authentic Kolkata dataset.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Reset local mock storage to fresh defaults?')) {
                resetAllData();
              }
            }}
          >
            Reset Mock Data
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
