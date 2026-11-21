import React from 'react';
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
      {/* Subscriptions */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Recurring subscriptions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Upcoming auto-debits and price adjustments.</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{subscriptions.length} active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {subscriptions.map((sub) => (
            <div 
              key={sub.id} 
              className="p-3.5 rounded-lg bg-slate-850/50 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{sub.name}</span>
                  <span className="font-mono font-medium text-slate-200">
                    ₹{sub.amount.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                {sub.priceChangeDetected && (
                  <div className="mt-2 text-[11px] text-amber-400">
                    Price increased from ₹{sub.previousAmount} (+₹{(sub.amount - (sub.previousAmount || 0))})
                  </div>
                )}

                <div className="mt-2 text-[11px] text-slate-500 font-mono">
                  Renews: {sub.nextRenewalDate}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Keep active?</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onConfirmUsage(sub.id, true)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      sub.userUsageConfirmed 
                        ? 'bg-slate-700 text-white font-medium' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Keep
                  </button>
                  <button
                    onClick={() => onConfirmUsage(sub.id, false)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      !sub.userUsageConfirmed 
                        ? 'bg-slate-700 text-white font-medium' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sinking Funds */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Sinking funds (Periodic expenses)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Spreads annual and seasonal costs into monthly reserves.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {sinkingFunds.map((fund) => {
            const pct = Math.min(100, Math.round((fund.currentSaved / fund.targetAmount) * 100));
            return (
              <div key={fund.id} className="p-3.5 rounded-lg bg-slate-850/50 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{fund.name}</span>
                  <span className="text-slate-400 text-[11px]">Due month {fund.dueMonth}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Saved: ₹{fund.currentSaved.toLocaleString('en-IN')}</span>
                  <span>Target: ₹{fund.targetAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Monthly reserve</span>
                  <span className="font-mono text-slate-300">₹{fund.monthlyAllocation.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
