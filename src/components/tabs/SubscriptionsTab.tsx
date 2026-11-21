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
      {/* Active Recurring Commitments */}
      <section 
        aria-labelledby="subs-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
              Recurring Ledger
            </span>
            <h2 id="subs-heading" className="text-base font-semibold text-[#f0f6fc] mt-0.5">
              Active Subscriptions & Auto-Debits
            </h2>
          </div>
          <span className="text-xs text-[#626c79] font-mono tabular-nums">{subscriptions.length} Tracked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          {subscriptions.map((sub) => (
            <div 
              key={sub.id} 
              className="p-4 rounded-lg bg-[#141d2e] border border-[#232f44] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#f0f6fc]">{sub.name}</span>
                  <span className="font-mono font-semibold text-[#f0f6fc] tabular-nums">
                    ₹{sub.amount.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                {sub.priceChangeDetected && (
                  <div className="mt-2 text-[11px] text-amber-400 font-medium">
                    Price increased from ₹{sub.previousAmount} (+₹{(sub.amount - (sub.previousAmount || 0))})
                  </div>
                )}

                <div className="mt-2.5 text-[11px] text-[#626c79] font-mono tabular-nums">
                  Renewal: {sub.nextRenewalDate}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a2333] flex items-center justify-between">
                <span className="text-[11px] text-[#8b949e]">Status:</span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onConfirmUsage(sub.id, true)}
                    className={`min-h-[32px] px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      sub.userUsageConfirmed 
                        ? 'bg-[#1a263c] text-[#f0f6fc] border border-[#232f44]' 
                        : 'text-[#626c79] hover:text-[#f0f6fc]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => onConfirmUsage(sub.id, false)}
                    className={`min-h-[32px] px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      !sub.userUsageConfirmed 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'text-[#626c79] hover:text-[#f0f6fc]'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sinking Funds (Seasonal Spikes) */}
      <section 
        aria-labelledby="sinking-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
              Proactive Reserves
            </span>
            <h2 id="sinking-heading" className="text-base font-semibold text-[#f0f6fc] mt-0.5">
              Sinking Funds (Periodic & Annual Expenses)
            </h2>
            <p className="text-xs text-[#8b949e] mt-1">
              Spreads lumpy costs (Diwali, car insurance, annual fees) into predictable monthly reserves.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {sinkingFunds.map((fund) => {
            const pct = Math.min(100, Math.round((fund.currentSaved / fund.targetAmount) * 100));
            return (
              <div key={fund.id} className="p-4 rounded-lg bg-[#141d2e] border border-[#232f44]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#f0f6fc]">{fund.name}</span>
                  <span className="text-[#8b949e] font-mono">Due Month {fund.dueMonth}</span>
                </div>

                <div className="flex justify-between text-[11px] text-[#8b949e] mt-3 font-mono tabular-nums">
                  <span>Saved: ₹{fund.currentSaved.toLocaleString('en-IN')}</span>
                  <span>Target: ₹{fund.targetAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="w-full bg-[#0e1420] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[#2ea043] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1a2333] flex items-center justify-between text-[11px]">
                  <span className="text-[#626c79]">Monthly Reserve Allocation</span>
                  <span className="font-mono font-medium text-[#f0f6fc] tabular-nums">
                    ₹{fund.monthlyAllocation.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
