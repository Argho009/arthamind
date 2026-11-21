import React from 'react';
import { 
  FileText, TrendingUp, CheckCircle, Download, 
  Sparkles, Award, Shield, PieChart, ArrowUpRight 
} from 'lucide-react';
import { MonthlyReviewReport } from '../../lib/types';

interface MonthlyReportTabProps {
  report: MonthlyReviewReport;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Requirement #7
            </span>
            <span className="text-xs text-slate-400">Monthly Intelligence Report</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Financial Health Scorecard: {report.month}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic assessment of cash flow, runway velocity, and living model adaptation.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all self-start md:self-auto shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inflow</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            ₹{report.totalInflow.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1">Primary Salary + Side Income</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Outflow</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-2">
            ₹{report.totalOutflow.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-teal-400 mt-1">
            After ₹{report.reimbursementTotalNetted.toLocaleString('en-IN')} netting
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Savings</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            ₹{report.netSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Savings Rate: <strong className="text-emerald-400">{report.savingsRate}%</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automation Rate</span>
          <div className="text-2xl font-extrabold text-teal-400 mt-2">
            {report.activeLearningStats.autoCategorizedPercentage}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Zero manual homework required</div>
        </div>
      </div>

      {/* Category Breakdown & Life Event Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending by Category */}
        <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">
            Spending by Category (Netted for True Discretionary Cost)
          </h3>

          <div className="space-y-3.5">
            {report.topCategories.map((item: { category: string; amount: number; percentage: number }, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{item.category}</span>
                  <span className="text-slate-300 font-bold">
                    ₹{item.amount.toLocaleString('en-IN')} <span className="text-slate-500 font-normal">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Insights & Living Model Log */}
        <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Living Model Log & Key Insights</h3>
            <div className="space-y-2.5">
              {report.lifeEventsSummary.map((msg: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <span className="font-bold">Coach Verdict: </span>
            Your 40-day runway and 42% savings rate keep your 6-month emergency fund completion on track for March 2027.
          </div>
        </div>
      </div>
    </div>
  );
};
