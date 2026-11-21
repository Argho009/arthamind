import React from 'react';
import { Brain, Cloud, ShieldCheck, Sparkles, Database } from 'lucide-react';

interface HeaderProps {
  safeToSpendDaily: number;
  runwayDays: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingReviewsCount: number;
  hasLifeEvent: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  safeToSpendDaily,
  runwayDays,
  activeTab,
  setActiveTab,
  pendingReviewsCount,
  hasLifeEvent
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Living Model' },
    { id: 'ingestion', label: 'Ingest & 2-Min Review', badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined },
    { id: 'reimbursement', label: 'Netting Visualizer' },
    { id: 'simulator', label: 'What-If Planner' },
    { id: 'subscriptions', label: 'Subscriptions & Sinking' },
    { id: 'guardrails', label: 'SEBI Guardrail Lab' },
    { id: 'monthly', label: 'Monthly Scorecard' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Brain className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Artha<span className="text-emerald-400">Mind</span></span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">UPI Native</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Living Money Model & Deterministic Coach</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400">Safe Daily:</span>
              <span className="text-sm font-semibold text-emerald-400">₹{safeToSpendDaily.toLocaleString('en-IN')}/day</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400">Runway:</span>
              <span className="text-sm font-semibold text-teal-400">{runwayDays} Days</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Cloudflare D1</span>
            </div>
            <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SEBI Compliant</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center space-x-2 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {tab.id === 'dashboard' && hasLifeEvent && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
