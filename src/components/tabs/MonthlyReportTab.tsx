import React from 'react';
import { Download } from 'lucide-react';
import { MonthlyReviewReport } from '../../lib/types';

interface MonthlyReportTabProps {
  report: MonthlyReviewReport;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Statement Header */}
      <section 
        aria-labelledby="statement-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
            Monthly Financial Statement
          </span>
          <h2 id="statement-heading" className="text-base font-semibold text-[#f0f6fc] mt-1">
            Accounting Summary • {report.month}
          </h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Net cashflow performance, settlement adjustments, and living profile adaptation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[44px] flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#141d2e] hover:bg-[#1a263c] text-[#f0f6fc] text-xs font-medium border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#8b949e]" />
          <span>Export Statement</span>
        </button>
      </section>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Total Inflow</span>
          <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-2">
            ₹{report.totalInflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#626c79] mt-1">Salary + variable receivables</div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Net Outflow</span>
          <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-2">
            ₹{report.totalOutflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#2ea043] font-mono mt-1">
            After ₹{report.reimbursementTotalNetted.toLocaleString('en-IN')} split deductions
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Net Savings</span>
          <div className="text-2xl font-bold text-[#2ea043] font-mono tabular-nums mt-2">
            ₹{report.netSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#8b949e] font-mono mt-1">
            {report.savingsRate}% monthly savings rate
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Auto-Categorized</span>
          <div className="text-2xl font-bold text-[#f0f6fc] font-mono tabular-nums mt-2">
            {report.activeLearningStats.autoCategorizedPercentage}%
          </div>
          <div className="text-[11px] text-[#626c79] mt-1">
            {report.activeLearningStats.userReviewedCount} confirmed in weekly reviews
          </div>
        </div>
      </div>

      {/* Spending Breakdown & Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section 
          aria-labelledby="breakdown-heading"
          className="lg:col-span-7 p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
        >
          <h3 id="breakdown-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-4">
            Expenditure by Category (Netted Values)
          </h3>

          <div className="space-y-3.5">
            {report.topCategories.map((item: { category: string; amount: number; percentage: number }, idx: number) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#f0f6fc] font-medium">{item.category}</span>
                  <span className="text-[#8b949e] font-mono tabular-nums">
                    ₹{item.amount.toLocaleString('en-IN')} <span className="text-[#626c79] font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-[#141d2e] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#2ea043] h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section 
          aria-labelledby="obs-heading"
          className="lg:col-span-5 p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] flex flex-col justify-between text-xs"
        >
          <div>
            <h3 id="obs-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-3">
              Living Model Audit Log
            </h3>
            <div className="space-y-2.5">
              {report.lifeEventsSummary.map((msg: string, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-[#141d2e] border border-[#232f44] text-[#f0f6fc] leading-relaxed">
                  {msg}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-lg bg-[#141d2e] border border-[#232f44] text-[11px] text-[#8b949e] leading-relaxed">
            40 days of liquidity buffer currently available. Emergency reserve trajectory remains on schedule for March 2027 completion.
          </div>
        </section>
      </div>
    </div>
  );
};
