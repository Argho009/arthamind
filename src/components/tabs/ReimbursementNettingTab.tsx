import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Transaction } from '../../lib/types';

interface ReimbursementNettingTabProps {
  transactions: Transaction[];
}

export const ReimbursementNettingTab: React.FC<ReimbursementNettingTabProps> = ({ transactions }) => {
  const parentDebits = transactions.filter(t => t.isReimbursed && t.type === 'debit');
  const repayments = transactions.filter(t => t.category === 'Reimbursement' || (t.isReimbursed && t.type === 'credit'));

  const totalOriginalSwiped = parentDebits.reduce((acc, t) => acc + t.amount, 0);
  const totalNettedSpend = parentDebits.reduce((acc, t) => acc + t.netAmount, 0);
  const totalRescuedInflation = totalOriginalSwiped - totalNettedSpend;

  return (
    <div className="space-y-6">
      {/* Header Metric Card */}
      <section 
        aria-labelledby="netting-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
            Reimbursement Reconciliation
          </span>
          <h2 id="netting-heading" className="text-base font-semibold text-[#f0f6fc] mt-1">
            Group Expenditure Netting
          </h2>
          <p className="text-xs text-[#8b949e] mt-1 max-w-xl leading-relaxed">
            When you front a group bill on card and friends reimburse via UPI, the incoming credits are automatically matched to prevent artificial expense inflation.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#141d2e] border border-[#232f44] text-right">
          <div className="text-[11px] text-[#8b949e]">Budget Inflation Prevented</div>
          <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-0.5">
            ₹{totalRescuedInflation.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#626c79] mt-0.5 font-mono">Deducted from dining totals</div>
        </div>
      </section>

      {/* Case Study: Linked Ledger */}
      <section 
        aria-labelledby="case-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <h3 id="case-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-4">
          Matched Settlement Record • Toit Indiranagar
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center text-xs">
          {/* Fronted Debit */}
          <div className="lg:col-span-4 p-4 rounded-lg bg-[#141d2e] border border-[#232f44]">
            <div className="flex items-center justify-between text-[#8b949e] text-[11px]">
              <span>1. Fronted Group Debit</span>
              <span className="font-mono">2026-11-10</span>
            </div>
            <div className="font-semibold text-[#f0f6fc] text-sm mt-1.5">Toit Brewpub Indiranagar</div>
            <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-1">
              ₹4,400.00
            </div>
            <div className="text-[11px] text-[#626c79] mt-1 font-mono">HDFC Card **4102</div>
          </div>

          <div className="lg:col-span-1 flex justify-center text-[#626c79]">
            <ArrowRight className="w-4 h-4 hidden lg:block" />
            <span className="lg:hidden text-[10px] text-[#626c79] my-1">Matched With:</span>
          </div>

          {/* Incoming Shares */}
          <div className="lg:col-span-3 p-4 rounded-lg bg-[#141d2e] border border-[#232f44] space-y-2">
            <div className="text-[11px] text-[#8b949e] font-medium">2. Matched UPI Credits (3)</div>
            <div className="flex justify-between py-1 border-b border-[#1a2333] font-mono text-[11px]">
              <span className="text-[#f0f6fc] font-sans">Karan Verma</span>
              <span className="text-[#2ea043] font-semibold tabular-nums">+₹1,100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1a2333] font-mono text-[11px]">
              <span className="text-[#f0f6fc] font-sans">Rhea Sen</span>
              <span className="text-[#2ea043] font-semibold tabular-nums">+₹1,100</span>
            </div>
            <div className="flex justify-between py-1 font-mono text-[11px]">
              <span className="text-[#f0f6fc] font-sans">Ankit J</span>
              <span className="text-[#2ea043] font-semibold tabular-nums">+₹1,100</span>
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-center text-[#626c79]">
            <ArrowRight className="w-4 h-4 hidden lg:block" />
            <span className="lg:hidden text-[10px] text-[#626c79] my-1">Reconciled To:</span>
          </div>

          {/* Resulting Net Booked Expense */}
          <div className="lg:col-span-2 p-4 rounded-lg bg-[#141d2e] border border-[#2ea043]/30 text-center">
            <div className="text-[10px] uppercase tracking-wider text-[#8b949e]">3. Net Booked Spend</div>
            <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-1">
              ₹1,100.00
            </div>
            <div className="text-[10px] text-[#2ea043] font-medium mt-1">
              Your exact 1/4 share
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
