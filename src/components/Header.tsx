import React from 'react';
import { Landmark } from 'lucide-react';

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
    <header className="border-b border-[#1a2333] bg-[#090d14]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <button 
            type="button"
            className="flex items-center space-x-3 text-left focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d14] rounded-lg p-1 -ml-1 transition-transform active:scale-[0.98]" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#0e1420] border border-[#1a2333] flex items-center justify-center text-[#f0f6fc]">
              <Landmark className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-[#f0f6fc]">ArthaMind</span>
                <span className="text-[10px] tracking-[0.08em] uppercase text-[#626c79] font-mono">Ledger</span>
              </div>
            </div>
          </button>

          {/* Key Datum Indicators */}
          <div className="flex items-center space-x-6 text-xs">
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[#8b949e]">Safe Daily:</span>
              <span className="font-semibold text-[#f0f6fc] font-mono tabular-nums">
                ₹{safeToSpendDaily.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-[#8b949e]">Runway:</span>
              <span className="font-semibold text-[#f0f6fc] font-mono tabular-nums">
                {runwayDays} days
              </span>
            </div>
            <div className="flex items-center space-x-2.5 pl-4 border-l border-[#1a2333]">
              <div className="w-7 h-7 rounded-full bg-[#141d2e] border border-[#232f44] flex items-center justify-center text-[11px] font-semibold text-[#f0f6fc]">
                AD
              </div>
              <span className="text-[#8b949e] font-medium hidden md:inline">Argho Deep</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation with 44px min touch target */}
        <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none border-t border-[#1a2333]/60 -mx-1 px-1" aria-label="Tabs">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d14] flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#141d2e] text-[#f0f6fc] border border-[#232f44] shadow-sm'
                    : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#0e1420]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#232f44] text-[#f0f6fc] font-mono tabular-nums">
                    {tab.badge}
                  </span>
                )}
                {tab.id === 'dashboard' && hasLifeEvent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
