import React from 'react';
import { 
  CreditCard, AlertTriangle, Check, X, Bell, 
  Calendar, Layers, ShieldCheck, Sparkles 
} from 'lucide-react';
import { Subscription, SinkingFund } from '../../lib/types';

interface SubscriptionsTabProps {
  subscriptions: Subscription[];
  sinkingFunds: SinkingFund[];
  onConfirmUsage: (subId: string, stillUsing: boolean) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  subscriptions,
  sinkingFunds,
  onConfirmUsage
}) => {
  return (
    <div className="space-y-6">
      {/* Editorial Reality Note */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
        <span className="font-bold text-amber-400">Research & Innovation Note: </span>
        Bank statement data alone cannot determine if a user opened or used an app. ArthaMind solves this with 
        <strong> renewal proximity alerts</strong> (a 1-tap *"Still using this?"* nudge before auto-debit) combined with 
        <strong> price-hike anomaly detection</strong>.
      </div>

      {/* Subscriptions Grid */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Active Recurring Subscriptions</h3>
            <p className="text-xs text-slate-400">Track price jumps and upcoming auto-debits</p>
          </div>
          <span className="text-xs text-slate-400">{subscriptions.length} Tracked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptions.map((sub) => (
            <div 
              key={sub.id} 
              className={`p-4 rounded-xl bg-slate-850 border ${
                sub.priceChangeDetected 
                  ? 'border-amber-500/50 shadow-md shadow-amber-500/5' 
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{sub.name}</span>
                <span className="text-xs font-extrabold text-white">
                  ₹{sub.amount.toLocaleString('en-IN')}/{sub.billingFrequency === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              {sub.priceChangeDetected && (
                <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] text-amber-300 font-medium">
                    Price jumped from ₹{sub.previousAmount} to ₹{sub.amount} (+₹{(sub.amount - (sub.previousAmount || 0))})!
                  </span>
                </div>
              )}

              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Next Renewal:</span>
                  <span className="text-slate-200 font-medium">{sub.nextRenewalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Charged:</span>
                  <span className="text-slate-400">{sub.lastChargedDate}</span>
                </div>
              </div>

              {/* One-Tap "Still Using This?" Nudge */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Still actively using?</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onConfirmUsage(sub.id, true)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        sub.userUsageConfirmed 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => onConfirmUsage(sub.id, false)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        !sub.userUsageConfirmed 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      No / Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Sinking Funds (Lumpy Expense Protection) */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Auto Sinking Funds (Lumpy & Seasonal Costs)</h3>
            <p className="text-xs text-slate-400">Spreads annual spikes (Diwali, car insurance, school fees) into monthly reserves.</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Proactive Protection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sinkingFunds.map((fund) => {
            const pct = Math.min(100, Math.round((fund.currentSaved / fund.targetAmount) * 100));
            return (
              <div key={fund.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{fund.name}</span>
                  <span className="text-xs font-semibold text-teal-400">
                    Due in Month {fund.dueMonth}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Saved: <strong className="text-white">₹{fund.currentSaved.toLocaleString('en-IN')}</strong></span>
                  <span>Target: <strong className="text-slate-300">₹{fund.targetAmount.toLocaleString('en-IN')}</strong></span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Monthly Reserve:</span>
                  <span className="font-bold text-emerald-400">₹{fund.monthlyAllocation.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
