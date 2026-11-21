import React from 'react';
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

  return (
    <div className="space-y-6">
      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Safe to spend</div>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            ₹{(profile.safeToSpendDaily || 1616).toLocaleString('en-IN')}
            <span className="text-xs text-slate-500 font-normal"> / day</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Calculated until Dec 1 salary</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Cash runway</div>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            {profile.runwayDays || 40}
            <span className="text-xs text-slate-500 font-normal"> days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">₹{profile.liquidCashBalance.toLocaleString('en-IN')} liquid balance</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Expected monthly inflow</div>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            ₹{(profile.monthlyBaselineIncome + profile.variableIncomeEstimate).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">₹{profile.monthlyBaselineIncome.toLocaleString('en-IN')} base + ₹{profile.variableIncomeEstimate.toLocaleString('en-IN')} variable</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Committed monthly outflow</div>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">
            ₹{profile.fixedCosts.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Includes ₹{profile.currentRent.toLocaleString('en-IN')} rent</div>
        </div>
      </div>

      {/* Emergency Fund & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Emergency Fund */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Emergency reserve</span>
            <span className="text-xs font-mono text-slate-400">{emergencyPct}%</span>
          </div>
          
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-slate-300 h-1.5 rounded-full"
              style={{ width: `${emergencyPct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono">
            <span>₹{profile.emergencyFundCurrent.toLocaleString('en-IN')}</span>
            <span>Target: ₹{profile.emergencyFundTarget.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/60">
            Saving ₹15,000/mo reaches full target by March 2027.
          </p>
        </div>

        {/* Goals */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Active goals</span>
            <span className="text-xs text-slate-500">{goals.length} tracking</span>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3 rounded-lg bg-slate-850/50 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{goal.title}</span>
                    <span className="font-mono text-slate-400">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-slate-400 h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Callout (Quiet, not loud amber) */}
      {pendingReviewCount > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-slate-300">
              {pendingReviewCount} transactions require category confirmation.
            </span>
          </div>
          <button
            onClick={onOpenReview}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            Review items
          </button>
        </div>
      )}

      {/* Transactions Ledger */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Recent transactions</span>
          <span className="text-xs text-slate-500 font-mono">{transactions.length} entries</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {transactions.slice(0, 7).map((tx) => (
            <div key={tx.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-850/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-200">{tx.cleanPayee}</span>
                    {tx.isP2P && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        P2P
                      </span>
                    )}
                    {tx.isReimbursed && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        netted
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tx.date} • {tx.channel} • {tx.category}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-mono font-medium ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.netAmount.toLocaleString('en-IN')}
                </div>
                {tx.isReimbursed && tx.netAmount !== tx.amount && (
                  <div className="text-[10px] text-slate-500 line-through font-mono">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
