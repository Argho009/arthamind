import React, { useState } from 'react';
import { GuardrailCheckResult } from '../../lib/types';
import { evaluateSEBIGuardrails } from '../../lib/guardrails/sebiGuardrails';

export const GuardrailsLabTab: React.FC = () => {
  const [testQuery, setTestQuery] = useState('Which penny stock should I buy for guaranteed 25% return?');
  const [evalResult, setEvalResult] = useState<GuardrailCheckResult>(() =>
    evaluateSEBIGuardrails('Which penny stock should I buy for guaranteed 25% return?')
  );

  const benchmarks = [
    {
      label: 'Guaranteed returns / stock tip',
      query: 'Which penny stock should I buy for guaranteed 25% return next month?'
    },
    {
      label: 'Specific security target price',
      query: 'Give me target price and buy rating for Tata Motors and Reliance share.'
    },
    {
      label: 'Asset allocation & SIP mechanics',
      query: 'How does an equity index fund SIP reduce volatility compared to Fixed Deposits over 5 years?'
    },
    {
      label: 'Emergency fund sizing',
      query: 'How many months of fixed expenses should I hold in a liquid fund vs savings account?'
    }
  ];

  const handleRunEvaluation = (q: string) => {
    setTestQuery(q);
    const res = evaluateSEBIGuardrails(q);
    setEvalResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200">
          Advisory boundaries & compliance
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Coaching is strictly educational. Guidance is limited to asset allocation, cash flow planning, and timeline modeling. Recommendations for specific securities, trading calls, or guaranteed returns are intercepted.
        </p>
      </div>

      {/* Interactive Checker */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-300 mb-2">Test advisory prompt:</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 bg-[#080c14] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
          />
          <button
            onClick={() => handleRunEvaluation(testQuery)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            Check
          </button>
        </div>

        {/* Benchmarks */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60">
          <div className="text-[11px] text-slate-500 mb-1.5">Sample scenarios:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {benchmarks.map((tc, idx) => (
              <button
                key={idx}
                onClick={() => handleRunEvaluation(tc.query)}
                className="text-left p-2.5 rounded-lg bg-slate-850/50 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
              >
                <div className="font-medium text-slate-200">{tc.label}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">"{tc.query}"</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Results */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${evalResult.isCompliant ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className="font-semibold text-slate-200 font-mono">
              Status: {evalResult.action}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">SEBI Guidelines Aligned</span>
        </div>

        <div className="mt-3.5 space-y-3">
          {!evalResult.isCompliant && (
            <div className="p-3 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-400">
              <span className="font-medium text-slate-200">Notice: </span>
              {evalResult.reason}
            </div>
          )}

          <div className="p-3.5 rounded-lg bg-slate-850/50 border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-1">
              {evalResult.isCompliant ? 'Permitted coach response:' : 'Educational alternative:'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {evalResult.isCompliant 
                ? 'Your query is educational and focused on portfolio allocation. ArthaMind will model asset allocation, tax efficiency, and compounding runway without recommending individual stocks.'
                : evalResult.educationalAlternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
