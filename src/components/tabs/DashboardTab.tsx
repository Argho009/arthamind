import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { LivingProfile, Transaction, Goal } from '../../lib/types';

interface DashboardTabProps {
  profile: LivingProfile;
  transactions: Transaction[];
  goals: Goal[];
  onOpenReview: () => void;
  pendingReviewCount: number;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  transactions,
  goals,
  onOpenReview,
  pendingReviewCount
}) => {
  const emergencyPct = Math.min(100, Math.round((profile.emergencyFundCurrent / profile.emergencyFundTarget) * 100));
  const totalInflow = profile.monthlyBaselineIncome + profile.variableIncomeEstimate;
  const discretionarySurplus = Math.max(0, totalInflow - profile.fixedCosts);

  return (
    <div className="space-y-6">
      {/* Asymmetric Signature Anchor: Oversized Odometer + Cashflow Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Oversized Focal Anchor (7 Cols) */}
        <section 
          aria-labelledby="safe-spend-heading"
          className="lg:col-span-7 p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span id="safe-spend-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
                Daily Expenditure Ceiling
              </span>
              <span className="text-[11px] font-mono text-[#2ea043] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Active Cycle: Nov 1–30
              </span>
            </div>

            <div className="mt-4">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#f0f6fc] font-mono tabular-nums">
                ₹{(profile.safeToSpendDaily || 1616).toLocaleString('en-IN')}
                <span className="text-sm font-sans font-normal text-[#8b949e]"> / day</span>
              </div>
              <p className="text-xs text-[#8b949e] mt-2 max-w-lg leading-relaxed">
                Calculated from ₹{profile.liquidCashBalance.toLocaleString('en-IN')} available cash after deducting remaining fixed commitments through next salary credit on Dec 1.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1a2333]/80 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#626c79] block">Liquid Cash Buffer</span>
              <span className="text-sm font-semibold font-mono text-[#f0f6fc] tabular-nums mt-0.5 block">
                ₹{profile.liquidCashBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#626c79] block">Runway Reserve</span>
              <span className="text-sm font-semibold font-mono text-[#f0f6fc] tabular-nums mt-0.5 block">
                {profile.runwayDays || 40} Days Available
              </span>
            </div>
          </div>
        </section>

        {/* Committed Cashflow Waterfall (5 Cols) */}
        <section 
          aria-labelledby="waterfall-heading"
          className="lg:col-span-5 p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col justify-between"
        >
          <div>
            <span id="waterfall-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
              Monthly Cashflow Waterfall
            </span>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141d2e] border border-[#232f44]">
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-[#2ea043]" />
                  <span className="text-[#f0f6fc] font-medium">Expected Inflow</span>
                </div>
                <span className="font-mono font-semibold text-[#f0f6fc] tabular-nums">
                  +₹{totalInflow.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141d2e] border border-[#232f44]">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8b949e]" />
                  <span className="text-[#8b949e]">Committed (Rent & EMIs)</span>
                </div>
                <span className="font-mono font-medium text-[#8b949e] tabular-nums">
                  -₹{profile.fixedCosts.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141d2e] border border-[#232f44]">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8b949e]" />
                  <span className="text-[#8b949e]">Sinking Reserve Allocations</span>
                </div>
                <span className="font-mono font-medium text-[#8b949e] tabular-nums">
                  -₹10,000
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a2333]/80 flex items-center justify-between text-xs">
            <span className="text-[#8b949e] font-medium">Discretionary Net:</span>
            <span className="font-mono font-semibold text-[#f0f6fc] tabular-nums">
              ₹{(discretionarySurplus - 10000).toLocaleString('en-IN')}
            </span>
          </div>
        </section>
      </div>

      {/* Emergency Cushion & Goal Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Emergency Fund Card (4 Cols) */}
        <section 
          aria-labelledby="emergency-heading"
          className="lg:col-span-4 p-5 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span id="emergency-heading" className="text-xs font-semibold text-[#f0f6fc]">
                Emergency Cushion
              </span>
              <span className="text-xs font-mono text-[#8b949e] tabular-nums">{emergencyPct}%</span>
            </div>
            
            <div className="w-full bg-[#141d2e] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#2ea043] h-1.5 rounded-full transition-all duration-300 ease-taste"
                style={{ width: `${emergencyPct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-[#8b949e] mt-3 font-mono tabular-nums">
              <span>Saved: ₹{profile.emergencyFundCurrent.toLocaleString('en-IN')}</span>
              <span>Target: ₹{profile.emergencyFundTarget.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#626c79] mt-4 pt-3 border-t border-[#1a2333]/80 leading-relaxed">
            Allocating ₹15,000 monthly achieves full 6-month runway buffer by March 2027.
          </p>
        </section>

        {/* Active Financial Milestones (8 Cols) */}
        <section 
          aria-labelledby="goals-heading"
          className="lg:col-span-8 p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]"
        >
          <div className="flex items-center justify-between mb-3">
            <span id="goals-heading" className="text-xs font-semibold text-[#f0f6fc]">
              Milestone Allocation Tracking
            </span>
            <span className="text-xs text-[#626c79] font-mono">{goals.length} Goals Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-lg bg-[#141d2e] border border-[#232f44]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#f0f6fc]">{goal.title}</span>
                    <span className="font-mono text-[#8b949e] tabular-nums">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#0e1420] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-[#8b949e] h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#626c79] mt-2 font-mono tabular-nums">
                    <span>₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Review Queue Banner (Quiet & Professional) */}
      {pendingReviewCount > 0 && (
        <aside 
          aria-label="Pending review banner"
          className="p-4 rounded-xl bg-[#0e1420] border border-[#232f44] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#2ea043]" aria-hidden="true" />
            <span className="text-[#f0f6fc]">
              {pendingReviewCount} ambiguous transactions await classification in your 2-minute weekly review.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenReview}
            className="min-h-[36px] px-3.5 py-1.5 rounded-md bg-[#141d2e] hover:bg-[#1a263c] text-[#f0f6fc] font-medium transition-transform duration-150 ease-taste active:scale-[0.98] border border-[#232f44] focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1420] self-start sm:self-auto"
          >
            Review {pendingReviewCount} Items
          </button>
        </aside>
      )}

      {/* Transactions Ledger */}
      <section 
        aria-labelledby="ledger-heading"
        className="rounded-xl border border-[#1a2333] bg-[#0e1420] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#1a2333] flex items-center justify-between">
          <span id="ledger-heading" className="text-xs font-semibold text-[#f0f6fc]">
            Transaction Ledger
          </span>
          <span className="text-xs text-[#626c79] font-mono tabular-nums">
            Showing latest {Math.min(7, transactions.length)} of {transactions.length} entries
          </span>
        </div>

        <div className="divide-y divide-[#1a2333]/80 text-xs">
          {transactions.slice(0, 7).map((tx) => (
            <div key={tx.id} className="min-h-[52px] px-5 py-3 flex items-center justify-between hover:bg-[#141d2e]/40 transition-colors">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-[#f0f6fc]">{tx.cleanPayee}</span>
                    {tx.isP2P && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#141d2e] text-[#8b949e] border border-[#232f44] font-mono">
                        UPI P2P
                      </span>
                    )}
                    {tx.isReimbursed && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#2ea043] border border-emerald-500/20 font-mono">
                        Netted
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#626c79] mt-0.5 font-mono">
                    {tx.date} • {tx.channel} • <span className="font-sans text-[#8b949e]">{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-mono font-medium tabular-nums ${
                  tx.type === 'credit' ? 'text-[#2ea043]' : 'text-[#f0f6fc]'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.netAmount.toLocaleString('en-IN')}
                </div>
                {tx.isReimbursed && tx.netAmount !== tx.amount && (
                  <div className="text-[10px] text-[#626c79] line-through font-mono tabular-nums">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
