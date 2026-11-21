import React from 'react';
import { Download } from 'lucide-react';
import { MonthlyReviewReport } from '../../lib/types';

interface MonthlyReportTabProps {
  report: MonthlyReviewReport;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Monthly statement • {report.month}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of cash flow, settled group splits, and savings performance.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export statement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400">Total inflow</div>
          <div className="text-xl font-semibold text-slate-100 font-mono mt-1">
            ₹{report.totalInflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Salary + other income</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400">Net outflow</div>
          <div className="text-xl font-semibold text-slate-100 font-mono mt-1">
            ₹{report.totalOutflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Netted ₹{report.reimbursementTotalNetted.toLocaleString('en-IN')} splits
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400">Net savings</div>
          <div className="text-xl font-semibold text-slate-100 font-mono mt-1">
            ₹{report.netSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {report.savingsRate}% savings rate
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400">Auto-classified</div>
          <div className="text-xl font-semibold text-slate-100 font-mono mt-1">
            {report.activeLearningStats.autoCategorizedPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {report.activeLearningStats.userReviewedCount} confirmed manually
          </div>
        </div>
      </div>

      {/* Spending Breakdown & Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-xs font-semibold text-slate-300 mb-3.5">
            Spending by category
          </h3>

          <div className="space-y-3">
            {report.topCategories.map((item: { category: string; amount: number; percentage: number }, idx: number) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-slate-400 font-mono">
                    ₹{item.amount.toLocaleString('en-IN')} <span className="text-slate-600 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div 
                    className="bg-slate-400 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between text-xs">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-3">System observations</h3>
            <div className="space-y-2">
              {report.lifeEventsSummary.map((msg: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-850/50 border border-slate-800 text-slate-300">
                  {msg}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-850/30 border border-slate-800/80 text-[11px] text-slate-400">
            Current runway of 40 days keeps your 6-month emergency reserve on schedule for March 2027.
          </div>
        </div>
      </div>
    </div>
  );
};
