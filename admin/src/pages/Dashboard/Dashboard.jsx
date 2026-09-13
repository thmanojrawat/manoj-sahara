import React from 'react';
import {
  Building2,
  Users2,
  CalendarCheck,
  Kanban,
  BadgeDollarSign,
  TrendingUp,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrm } from '../../context/CrmContext.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export function Dashboard() {
  const {
    properties,
    units,
    leads,
    deals,
    bookings,
    payments,
    followUps,
    siteVisits,
    brokers,
    tenancies,
    activities
  } = useCrm();

  // Metrics computation
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingPaymentsAmount = payments
    .filter(p => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const activeListings = properties.filter(p => p.status === 'Active').length;
  const availableUnits = units.filter(u => u.status === 'Available').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const qualifiedLeadsCount = leads.filter(l => ['Qualified', 'Site Visit', 'Negotiation'].includes(l.status)).length;
  const upcomingFollowUps = followUps.filter(f => f.status === 'Pending').slice(0, 5);
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').slice(0, 5);
  const recentActivities = activities.slice(0, 6);

  // Top Brokers sorted by revenue
  const topBrokers = [...brokers].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 4);

  // Lead Funnel Stages
  const leadStages = [
    { label: 'New', count: leads.filter(l => l.status === 'New').length, color: 'bg-blue-500' },
    { label: 'Contacted', count: leads.filter(l => l.status === 'Contacted').length, color: 'bg-sky-500' },
    { label: 'Qualified', count: leads.filter(l => l.status === 'Qualified').length, color: 'bg-amber-500' },
    { label: 'Site Visit', count: leads.filter(l => l.status === 'Site Visit').length, color: 'bg-purple-500' },
    { label: 'Negotiation', count: leads.filter(l => l.status === 'Negotiation').length, color: 'bg-indigo-500' },
    { label: 'Converted', count: leads.filter(l => l.status === 'Converted').length, color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sahara Kolkata Enterprise Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Siddhartha
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time portfolio pulse across New Town, Salt Lake Sector V, Rajarhat, and South Kolkata micro-markets.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/ai-assistant">
              <Button variant="outline" size="sm" icon={Sparkles} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Ask AI Assistant
              </Button>
            </Link>
            <Link to="/properties?action=new">
              <Button variant="primary" size="sm" icon={Plus}>
                New Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Closed Revenue"
          value={formatCurrency(totalRevenue)}
          change="+18.4% vs last month"
          icon={TrendingUp}
          accent="emerald"
          description="Verified bank receipts"
        />
        <StatCard
          title="Active Property Listings"
          value={activeListings}
          change={`${availableUnits} Units Available`}
          icon={Building2}
          accent="amber"
          description="High-demand residential & office"
        />
        <StatCard
          title="Active Lead Pipeline"
          value={leads.length}
          change={`${newLeadsCount} New inquiries`}
          icon={Users2}
          accent="blue"
          description={`${qualifiedLeadsCount} Qualified prospects`}
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(pendingPaymentsAmount)}
          change={`${payments.filter(p => p.status === 'Overdue').length} Overdue`}
          isIncreasePositive={false}
          icon={AlertCircle}
          accent="rose"
          description="Milestones awaiting disbursement"
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Deals in Pipeline</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{deals.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Bookings</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{bookings.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Site Visits</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{siteVisits.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Leases</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{tenancies.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Agents & Brokers</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">{brokers.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Available Units</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">{availableUnits}</span>
        </div>
      </div>

      {/* Main Grid: Pipeline Funnel + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Funnel Breakdown */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sahara Lead Funnel & Conversion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stage progression from first discovery to registered booking
              </p>
            </div>
            <Link to="/leads" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              View CRM Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {leadStages.map((stage, idx) => {
              const percentage = Math.round((stage.count / Math.max(1, leads.length)) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {stage.label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      {stage.count} leads ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                      style={{ width: `${Math.max(8, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Inquiry to Visit</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">62%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Visit to Deal</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">48%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Deal to Booking</span>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">85%</p>
            </div>
          </div>
        </div>

        {/* Top Agent Leaderboard */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Top Broker Rankings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kolkata region revenue leaders
              </p>
            </div>
            <Link to="/brokers" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              All Agents
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topBrokers.map((broker, idx) => (
              <div key={broker.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={broker.avatar}
                      alt={broker.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-amber-400 text-[9px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {broker.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                      {broker.specializedAreas[0]} • {broker.dealsClosed} deals
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(broker.revenueGenerated)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatCurrency(broker.commissionEarned)} com
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Follow-ups & Site Visits + Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actionable Follow-ups & Visits */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Follow-Ups & Visits
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immediate CRM contact actions required
              </p>
            </div>
            <Link to="/follow-ups" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingFollowUps.map(fup => (
              <div
                key={fup.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {fup.type} with {fup.leadName || fup.clientName}
                      </span>
                      <StatusBadge status={fup.category} />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {fup.notes}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {fup.dueDate}
                  </span>
                  <span className="text-[10px] text-slate-400">{fup.dueTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Ledger Collections */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Ledger Milestones
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Outstanding client installment disbursements
              </p>
            </div>
            <Link to="/payments" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              View Payments
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingPayments.map(pay => (
              <div
                key={pay.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {pay.clientName}
                    </span>
                    <StatusBadge status={pay.status} />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {pay.notes} • Due: {pay.dueDate}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                    {formatCurrency(pay.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {pay.receiptNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Audit Activity Strip */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent System Audit Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated audit trail of all operational ERP transactions
            </p>
          </div>
          <Link to="/activity-logs" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
            Full Audit Logs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentActivities.map(act => (
            <div
              key={act.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-300">{act.user}</span>
                <span>{act.timestamp}</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {act.action}: {act.entity}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {act.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
