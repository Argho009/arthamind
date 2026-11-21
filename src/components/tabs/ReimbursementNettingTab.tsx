import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Transaction } from '../../lib/types';

interface ReimbursementNettingTabProps {
  transactions: Transaction[];
}

export const ReimbursementNettingTab: React.FC<ReimbursementNettingTabProps> = ({ transactions }) => {
  const parentDebits = transactions.filter(t => t.isReimbursed && t.type === 'debit');
  const repayments = transactions.filter(t => t.category === 'Reimbursement' || t.isReimbursed && t.type === 'credit');

  const totalOriginalSwiped = parentDebits.reduce((acc, t) => acc + t.amount, 0);
  const totalNettedSpend = parentDebits.reduce((acc, t) => acc + t.netAmount, 0);
  const totalRescuedInflation = totalOriginalSwiped - totalNettedSpend;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Split expense settlements
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            When you pay a group bill and friends send their shares via UPI, the incoming transfers are automatically linked to net out the original charge.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-850/80 border border-slate-800 text-right">
          <div className="text-[11px] text-slate-400">Total netted this month</div>
          <div className="text-lg font-semibold text-slate-100 font-mono mt-0.5">
            ₹{totalRescuedInflation.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Linked Settlement Ledger */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-300 mb-4">
          Settlement example • Toit Indiranagar
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center text-xs">
          {/* Original Bill */}
          <div className="lg:col-span-4 p-3.5 rounded-lg bg-slate-850/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Original card charge</span>
              <span>Nov 10</span>
            </div>
            <div className="font-medium text-slate-200 mt-1">Toit Brewpub Indiranagar</div>
            <div className="text-xl font-semibold text-slate-100 font-mono mt-1">
              ₹4,400.00
            </div>
            <div className="text-[11px] text-slate-500 mt-1">HDFC Credit Card **4102</div>
          </div>

          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="w-4 h-4 hidden lg:block" />
            <span className="lg:hidden text-[10px] text-slate-500 my-1">Matched with:</span>
          </div>

          {/* Settled Shares */}
          <div className="lg:col-span-3 p-3.5 rounded-lg bg-slate-850/60 border border-slate-800 space-y-1.5">
            <div className="text-[11px] text-slate-400 mb-1">Incoming UPI shares (3)</div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
              <span className="text-slate-300 font-sans">Karan Verma</span>
              <span className="text-slate-400">+₹1,100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
              <span className="text-slate-300 font-sans">Rhea Sen</span>
              <span className="text-slate-400">+₹1,100</span>
            </div>
            <div className="flex justify-between py-1 font-mono">
              <span className="text-slate-300 font-sans">Ankit J</span>
              <span className="text-slate-400">+₹1,100</span>
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-center text-slate-600">
            <ArrowRight className="w-4 h-4 hidden lg:block" />
            <span className="lg:hidden text-[10px] text-slate-500 my-1">Nets to:</span>
          </div>

          {/* Final Net Cost */}
          <div className="lg:col-span-2 p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/80 text-center">
            <div className="text-[11px] text-slate-400">Net booked cost</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              ₹1,100.00
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Your 1/4 share</div>
          </div>
        </div>
      </div>
    </div>
  );
};
