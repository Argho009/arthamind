import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { GuardrailCheckResult } from '../../types';
import { evaluateSEBIGuardrails } from '../../lib/guardrails/sebiGuardrails';

export const GuardrailsLabTab: React.FC = () => {
  const [testQuery, setTestQuery] = useState('Which penny stock should I buy for guaranteed 25% return?');
  const [evalResult, setEvalResult] = useState<GuardrailCheckResult>(() =>
    evaluateSEBIGuardrails('Which penny stock should I buy for guaranteed 25% return?')
  );

  const testCases = [
    {
      label: 'Specific Stock Tip & Guaranteed Return (Violates SEBI)',
      query: 'Which penny stock should I buy for guaranteed 25% return next month?'
    },
    {
      label: 'Named Listed Security & Target Price (Violates SEBI)',
      query: 'Give me target price and buy rating for Tata Motors and Reliance share.'
    },
    {
      label: 'Asset-Class Education & SIP Mechanics (Permitted & Encouraged)',
      query: 'How does an equity index fund SIP reduce volatility compared to Fixed Deposits over 5 years?'
    },
    {
      label: 'Emergency Cushion Sizing (Permitted)',
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
      {/* SEBI Compliance Architecture Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border border-blue-500/30">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 mt-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                Requirement #8: Tested Compliance Layer
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              SEBI-Compliant Guardrail Layer
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1">
              Under Indian SEBI regulations, automated tools cannot act as unlicensed investment advisers or issue buy/sell calls on specific securities. 
              <strong> ArthaMind implements an active classifier layer that intercepts non-compliant queries, blocks tips, and pivots to asset-class education.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Testing Sandbox */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-2">Test Prompt Against SEBI Classifier:</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-medium"
          />
          <button
            onClick={() => handleRunEvaluation(testQuery)}
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Evaluate
          </button>
        </div>

        {/* Preset test cases */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 mb-2 font-medium">Or select an evaluation benchmark:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {testCases.map((tc, idx) => (
              <button
                key={idx}
                onClick={() => handleRunEvaluation(tc.query)}
                className="text-left p-2.5 rounded-lg text-xs bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
              >
                <div className="font-semibold text-white">{tc.label}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">"{tc.query}"</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      <div className={`p-6 rounded-2xl border ${
        evalResult.isCompliant 
          ? 'bg-emerald-950/20 border-emerald-500/40' 
          : 'bg-rose-950/20 border-rose-500/40'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            {evalResult.isCompliant ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            )}
            <span className={`text-sm font-bold uppercase tracking-wider ${
              evalResult.isCompliant ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              Guardrail Status: {evalResult.action}
            </span>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            AI-Assisted Educational Badge Active
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {!evalResult.isCompliant && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 text-xs">
              <span className="font-bold text-rose-400">Violation Reason: </span>
              <span className="text-slate-300">{evalResult.reason}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {evalResult.isCompliant ? 'Coach Permitted Guidance:' : 'Educational Pivot Response:'}
            </span>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              {evalResult.isCompliant 
                ? 'Your query is educational and scenario-focused. ArthaMind will model asset allocation, tax efficiency, and compounding runway without recommending individual stocks.'
                : evalResult.educationalAlternative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
