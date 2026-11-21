import React from 'react';
import { Users, ArrowRight, ShieldCheck, CheckCircle2, Split, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface ReimbursementNettingTabProps {
  transactions: Transaction[];
}

export const ReimbursementNettingTab: React.FC<ReimbursementNettingTabProps> = ({ transactions }) => {
  // Find transactions flagged with reimbursement
  const parentDebits = transactions.filter(t => t.isReimbursed && t.type === 'debit');
  const repayments = transactions.filter(t => t.category === 'Reimbursement' || t.isReimbursed && t.type === 'credit');

  const totalOriginalSwiped = parentDebits.reduce((acc, t) => acc + t.amount, 0);
  const totalNettedSpend = parentDebits.reduce((acc, t) => acc + t.netAmount, 0);
  const totalRescuedInflation = totalOriginalSwiped - totalNettedSpend;

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining the Splitwise Problem */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-teal-950/60 p-6 rounded-2xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 mt-1">
              <Split className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                  Daily Pain: Friend Repayments Distorting Budgets
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Automatic Reimbursement Netting
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                When you pay a ₹4,400 dinner bill for friends and they send you ₹1,100 each on UPI, generic budgeting apps count ₹4,400 as food spend and ₹3,300 as new income. 
                <strong> ArthaMind automatically links the transactions and nets your real food expense to ₹1,100.</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-teal-500/40 p-4 rounded-xl text-right">
            <div className="text-xs text-teal-400 uppercase font-semibold">False Inflation Prevented</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              ₹{totalRescuedInflation.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Budget saved from false drift alert</div>
          </div>
        </div>
      </div>

      {/* Visual Live Linked Netting Case Study */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">
          Live Linked Netting Scenario (Toit Indiranagar Dinner)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Card 1: Original Fronted Debit */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-850 border border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">1. Fronted Debit (Card Swipe)</span>
              <span className="text-xs text-slate-400">10 Nov 2026</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-white">Toit Brewpub Indiranagar</div>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                ₹4,400.00
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Full group dinner paid by you on HDFC Credit Card **4102.
              </p>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="lg:col-span-1 flex justify-center text-teal-400">
            <ArrowRight className="w-6 h-6 hidden lg:block" />
            <div className="lg:hidden text-xs text-teal-400 font-bold my-1">Matched With Incoming UPI:</div>
          </div>

          {/* Card 2: Linked Peer Reimbursements */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">2. Incoming Peer Repayments</span>
              <span className="text-xs text-slate-400">3 Transfers</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-800/80">
                <span className="text-slate-200">Karan Verma (Splitwise)</span>
                <span className="font-bold text-emerald-400">+₹1,100</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-800/80">
                <span className="text-slate-200">Rhea Sen (Dinner share)</span>
                <span className="font-bold text-emerald-400">+₹1,100</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-800/80">
                <span className="text-slate-200">Ankit J (Food share)</span>
                <span className="font-bold text-emerald-400">+₹1,100</span>
              </div>
            </div>
          </div>

          {/* Connector Arrow */}
          <div className="lg:col-span-1 flex justify-center text-teal-400">
            <ArrowRight className="w-6 h-6 hidden lg:block" />
            <div className="lg:hidden text-xs text-teal-400 font-bold my-1">Resulting Net Spend:</div>
          </div>

          {/* Card 3: Final Netted Spend */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Net Booked Spend</span>
            <div className="text-2xl font-black text-white mt-2">
              ₹1,100.00
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium mt-1">
              ₹3,300 deducted
            </div>
            <div className="mt-2 text-[10px] text-slate-400 leading-tight">
              Only your actual share affects monthly food budget!
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Standard App vs ArthaMind */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Standard Apps (Walnut, Fold, Mint clones)</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Records Dining Out as ₹4,400 (Triggers false "Over Budget!" guilt notification).</li>
            <li>Records ₹3,300 repayments as taxable income or misc deposit.</li>
            <li>Requires tedious manual Splitwise double-entry tracking.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>ArthaMind Autonomous Netting Engine</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
            <li>Detects the group debit and matches UPI incoming credits within 5 days.</li>
            <li>Nets the debit amount to ₹1,100 automatically.</li>
            <li>Zeros out incoming credits so monthly cash-flow reports remain accurate.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
