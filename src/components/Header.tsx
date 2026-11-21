import React from 'react';
import { Landmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
    { id: 'dashboard', label: 'Overview' },
    { id: 'ingestion', label: 'Review & Ingest', badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined },
    { id: 'reimbursement', label: 'Split Settlements' },
    { id: 'simulator', label: 'Scenario Planner' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'guardrails', label: 'Advisory Rules' },
    { id: 'monthly', label: 'Monthly Summary' },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#0b0f17]/95 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Product Name */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">ArthaMind</span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">/ finance</span>
            </div>
          </div>

          {/* Calm Financial Indicators */}
          <div className="flex items-center space-x-5 text-xs">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-slate-400">Daily allowance:</span>
              <span className="font-medium text-slate-200 font-mono">₹{safeToSpendDaily.toLocaleString('en-IN')}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-slate-400">Buffer:</span>
              <span className="font-medium text-slate-200 font-mono">{runwayDays} days</span>
            </div>
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-medium text-slate-300">
                AD
              </div>
              <span className="text-slate-300 font-medium hidden md:inline">Argho</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none border-t border-slate-800/50">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-700 text-slate-200 font-medium">
                    {tab.badge}
                  </span>
                )}
                {tab.id === 'dashboard' && hasLifeEvent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
