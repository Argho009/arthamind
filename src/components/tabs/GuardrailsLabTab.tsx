import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
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
      {/* Intro Header */}
      <section 
        aria-labelledby="guard-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-1">
          <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
          <span id="guard-heading">Advisory Boundaries & Compliance</span>
        </div>
        <h2 className="text-base font-semibold text-[#f0f6fc] mt-1">
          SEBI-Compliant Financial Coaching Rules
        </h2>
        <p className="text-xs text-[#8b949e] mt-1 max-w-2xl leading-relaxed">
          Guidance is strictly educational. The coach models scenarios, emergency buffers, and compounding without issuing buy/sell ratings on individual stocks or promising guaranteed yields.
        </p>
      </section>

      {/* Interactive Compliance Evaluator */}
      <section 
        aria-labelledby="tester-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <h3 id="tester-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-3">
          Interactive Prompt Evaluator
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 min-h-[44px] bg-[#090d14] border border-[#1a2333] rounded-lg px-4 py-2 text-xs text-[#f0f6fc] placeholder:text-[#626c79] focus:outline-none focus:border-[#2ea043] focus:ring-1 focus:ring-[#2ea043] font-mono"
          />
          <button
            type="button"
            onClick={() => handleRunEvaluation(testQuery)}
            className="min-h-[44px] px-5 py-2 rounded-lg bg-[#141d2e] hover:bg-[#1a263c] text-[#f0f6fc] font-medium text-xs border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70"
          >
            Verify
          </button>
        </div>

        {/* Benchmarks Grid */}
        <div className="mt-4 pt-3.5 border-t border-[#1a2333]">
          <div className="text-[11px] text-[#626c79] mb-2">Test benchmarks:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {benchmarks.map((tc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunEvaluation(tc.query)}
                className="text-left p-3 rounded-lg bg-[#141d2e] hover:bg-[#1a263c] border border-[#232f44] text-[#8b949e] hover:text-[#f0f6fc] transition-transform duration-150 ease-taste active:scale-[0.98]"
              >
                <div className="font-semibold text-[#f0f6fc]">{tc.label}</div>
                <div className="text-[11px] text-[#626c79] truncate mt-1 font-mono">"{tc.query}"</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Results Card */}
      <section 
        aria-labelledby="result-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333] text-xs"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1a2333]">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${evalResult.isCompliant ? 'bg-[#2ea043]' : 'bg-rose-400'}`} />
            <span id="result-heading" className="font-semibold text-[#f0f6fc] font-mono">
              Action: {evalResult.action}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8b949e]">SEBI RA Guidelines</span>
        </div>

        <div className="mt-4 space-y-3">
          {!evalResult.isCompliant && (
            <div className="p-3.5 rounded-lg bg-[#141d2e] border border-rose-500/20 text-[#8b949e] leading-relaxed">
              <span className="font-semibold text-rose-400">Compliance Restriction: </span>
              {evalResult.reason}
            </div>
          )}

          <div className="p-4 rounded-lg bg-[#141d2e] border border-[#232f44]">
            <div className="text-[11px] text-[#8b949e] font-semibold mb-1">
              {evalResult.isCompliant ? 'Permitted Educational Response:' : 'Educational Alternative:'}
            </div>
            <p className="text-[#f0f6fc] leading-relaxed">
              {evalResult.isCompliant 
                ? 'Your query is educational and focused on portfolio allocation. ArthaMind will model asset allocation, tax efficiency, and compounding runway without recommending individual stocks.'
                : evalResult.educationalAlternative}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
