import React from 'react';
import { 
  TrendingUp, Shield, Wallet, ArrowUpRight, ArrowDownLeft, 
  Calendar, CheckCircle2, Clock, Sparkles, AlertTriangle 
} from 'lucide-react';
import { LivingProfile, Transaction, Goal } from '../../types';

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
      {/* Top Banner: Living Model Runway & Safe Daily Spend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Safe to Spend Daily */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Safe to Spend</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Until Payday</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              ₹{(profile.safeToSpendDaily || 1616).toLocaleString('en-IN')}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Replaces the 40-category budget with one dynamic number.
            </p>
          </div>
        </div>

        {/* Financial Runway */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-teal-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Cash Runway</span>
            <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full font-medium">Liquid Buffer</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {profile.runwayDays || 40}
              <span className="text-xs text-slate-400 font-normal"> Days</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ₹{profile.liquidCashBalance.toLocaleString('en-IN')} liquid cash balance.
            </p>
          </div>
        </div>

        {/* Baseline vs Variable Income */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">Baseline + Variable</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              ₹{(profile.monthlyBaselineIncome + profile.variableIncomeEstimate).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              <span className="text-emerald-400 font-medium">₹{profile.monthlyBaselineIncome.toLocaleString('en-IN')}</span> base +
              <span className="text-amber-400 font-medium">₹{profile.variableIncomeEstimate.toLocaleString('en-IN')}</span> variable
            </div>
          </div>
        </div>

        {/* Fixed Costs & Rent */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Committed Outflow</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">Fixed & Rent</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              ₹{profile.fixedCosts.toLocaleString('en-IN')}
              <span className="text-xs text-slate-400 font-normal"> / mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Includes current rent of <span className="text-slate-200 font-medium">₹{profile.currentRent.toLocaleString('en-IN')}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Cushion & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Fund Card */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Emergency Cushion</h3>
                <p className="text-xs text-slate-400">6-Month Runway Target</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-400">{emergencyPct}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${emergencyPct}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400 mt-3">
            <span>Saved: <strong className="text-white">₹{profile.emergencyFundCurrent.toLocaleString('en-IN')}</strong></span>
            <span>Target: <strong className="text-slate-300">₹{profile.emergencyFundTarget.toLocaleString('en-IN')}</strong></span>
          </div>

          <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800">
            Automated allocation of ₹15,000/mo puts you on track to finish by March 2027.
          </p>
        </div>

        {/* Active Goals */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Targeted Goals</h3>
                <p className="text-xs text-slate-400">Living Model Milestones</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">{goals.length} Active Goals</span>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-white">{goal.title}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Target: {goal.targetDate}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-teal-400">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active-Learning Homework Banner (If items pending) */}
      {pendingReviewCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Active-Learning: {pendingReviewCount} Ambiguous Items Waiting (Weekly 2-Min Review)
              </h4>
              <p className="text-xs text-slate-400">
                Instead of categorizing 50 transactions, review only the 3 least certain. Your choices generate persistent rules.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReview}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
          >
            Start 2-Min Review
          </button>
        </div>
      )}

      {/* Recent Transactions List with Intelligent Tags */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Ingested from SMS, PDF statements & UPI logs</p>
          </div>
          <span className="text-xs text-slate-500">{transactions.length} total entries</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.slice(0, 8).map((tx) => (
            <div key={tx.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-850/50 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className={`p-2 rounded-xl ${
                  tx.type === 'credit' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">{tx.cleanPayee}</span>
                    {tx.isP2P && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                        UPI P2P
                      </span>
                    )}
                    {tx.isReimbursed && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                        Auto-Netted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.channel} ({tx.bank})</span>
                    <span>•</span>
                    <span className="text-slate-300">{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-bold ${
                  tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.netAmount.toLocaleString('en-IN')}
                </div>
                {tx.isReimbursed && tx.netAmount !== tx.amount && (
                  <span className="text-[10px] text-teal-400 line-through">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                )}
                {tx.reviewNeeded && (
                  <span className="block text-[10px] text-amber-400 font-semibold mt-0.5">
                    Needs Review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
