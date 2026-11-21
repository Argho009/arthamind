import React, { useState } from 'react';
import { Transaction, ScopedRule } from '../../lib/types';

interface IngestionReviewTabProps {
  transactions: Transaction[];
  rules: ScopedRule[];
  onIngest: (text: string, format: 'SMS' | 'CSV' | 'HINGLISH') => void;
  onCategorize: (txId: string, category: string, createRule: boolean) => void;
}

export const IngestionReviewTab: React.FC<IngestionReviewTabProps> = ({
  transactions,
  rules,
  onIngest,
  onCategorize
}) => {
  const [ingestFormat, setIngestFormat] = useState<'SMS' | 'CSV' | 'HINGLISH'>('SMS');
  const [inputText, setInputText] = useState('');
  const [createRuleToggle, setCreateRuleToggle] = useState(true);

  const pendingReviews = transactions.filter(t => t.reviewNeeded || !t.isReviewed);

  const SAMPLE_SMS = `Sent Rs.350.00 from HDFC Bank A/C **9012 to Ramesh Kumar UPI Ref 410881 on 21-11-26.
Paid Rs.1850.00 at Blinkit Quick Commerce on Card **4102.
Paid Rs.4400.00 at Toit Indiranagar Bangalore on Card **4102.
UPI/P2M/CR/Karan Verma/Toit share/HDFC/5541. Rs 1100.00 received.
Sent Rs.21500.00 via UPI to Suresh Sharma Landlord UPI Ref 410291.`;

  const SAMPLE_CSV = `Date,Narration,Withdrawal,Deposit,Balance
21/11/2026,UPI-SWIGGY BANGALORE-VPA-HDFC,420.00,,48080.00
20/11/2026,POS 410291 POOJA MEDICALS,1200.00,,48500.00
19/11/2026,UPI-RAMESH KUMAR-P2P,350.00,,49700.00
18/11/2026,SALARY CREDIT RAZORPAY TECH,,95000.00,50050.00`;

  const SAMPLE_HINGLISH = `kal sham ko auto wale bhaiya ko 80 rupaye cash me diye the`;

  const handleQuickLoad = () => {
    if (ingestFormat === 'SMS') setInputText(SAMPLE_SMS);
    else if (ingestFormat === 'CSV') setInputText(SAMPLE_CSV);
    else if (ingestFormat === 'HINGLISH') setInputText(SAMPLE_HINGLISH);
  };

  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onIngest(inputText, ingestFormat);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Review Queue */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              Pending review ({pendingReviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-certainty transactions are auto-categorized. Confirm these ambiguous entries to train future matching.
            </p>
          </div>

          <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
            <input 
              type="checkbox" 
              checked={createRuleToggle} 
              onChange={(e) => setCreateRuleToggle(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-slate-200 focus:ring-0"
            />
            <span>Remember as matching rule</span>
          </label>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No pending items. All transactions are classified.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {pendingReviews.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-lg bg-slate-850/60 border border-slate-800 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{tx.cleanPayee}</span>
                    <span className="font-mono font-medium text-slate-200">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    "{tx.rawText}"
                  </p>
                  <div className="text-[10px] text-slate-600 mt-1.5 font-mono">
                    {tx.date} • {tx.channel}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                  <div className="text-[10px] text-slate-400 mb-1.5">Select category:</div>
                  <div className="flex flex-wrap gap-1">
                    {['Food & Dining', 'Transport', 'Healthcare', 'Housing', 'Groceries'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => onCategorize(tx.id, cat, createRuleToggle)}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ingestion Box */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Import statements or messages</h3>
            <p className="text-xs text-slate-500 mt-0.5">Paste raw bank SMS alerts, CSV exports, or informal notes.</p>
          </div>

          <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
            {(['SMS', 'CSV', 'HINGLISH'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setIngestFormat(fmt)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  ingestFormat === fmt
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt === 'SMS' && 'Bank SMS'}
                {fmt === 'CSV' && 'CSV'}
                {fmt === 'HINGLISH' && 'Notes / Cash'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleIngestSubmit} className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder={
              ingestFormat === 'SMS' 
                ? 'Paste bank transaction SMS messages...' 
                : ingestFormat === 'CSV' 
                ? 'Paste CSV rows (Date, Narration, Debit, Credit)...' 
                : 'Type note (e.g. "auto 80 rs cash")...'
            }
            className="w-full bg-[#080c14] border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleQuickLoad}
              className="text-xs text-slate-400 hover:text-slate-300 underline"
            >
              Insert sample {ingestFormat} text
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Process entries
            </button>
          </div>
        </form>
      </div>

      {/* Rules Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-300">Active matching rules</h3>
          <span className="text-xs text-slate-500 font-mono">{rules.length} configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {rules.map((rule) => (
            <div key={rule.id} className="p-2.5 rounded-lg bg-slate-850/40 border border-slate-800">
              <div className="font-medium text-slate-200 truncate">{rule.payeePattern}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {rule.category}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                ₹{rule.amountMin} - ₹{rule.amountMax}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
