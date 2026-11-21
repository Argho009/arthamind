import React, { useState } from 'react';
import { Upload } from 'lucide-react';
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
      {/* 2-Minute Review Queue */}
      <section 
        aria-labelledby="review-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1a2333] gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#8b949e]">
                Active Learning Queue
              </span>
            </div>
            <h2 id="review-heading" className="text-base font-semibold text-[#f0f6fc] mt-0.5">
              Weekly Confirmation Queue ({pendingReviews.length} Pending)
            </h2>
            <p className="text-xs text-[#8b949e] mt-1 max-w-xl">
              High-confidence items are auto-accepted. Confirm these ambiguous P2P items once; your decision creates a scoped rule for future entries.
            </p>
          </div>

          <label className="flex items-center space-x-2 text-xs text-[#8b949e] cursor-pointer self-start sm:self-auto min-h-[44px]">
            <input 
              type="checkbox" 
              checked={createRuleToggle} 
              onChange={(e) => setCreateRuleToggle(e.target.checked)}
              className="rounded bg-[#141d2e] border-[#232f44] text-[#2ea043] focus:ring-0 focus:ring-offset-0"
            />
            <span>Create scoped rule on confirm</span>
          </label>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8b949e]">
            All transactions are categorized. No manual confirmation required.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {pendingReviews.map((tx) => (
              <div key={tx.id} className="p-4 rounded-lg bg-[#141d2e] border border-[#232f44] flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f0f6fc]">{tx.cleanPayee}</span>
                    <span className="font-mono font-semibold text-[#f0f6fc] tabular-nums">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8b949e] line-clamp-2 mt-1.5 leading-relaxed">
                    "{tx.rawText}"
                  </p>
                  <div className="text-[10px] text-[#626c79] mt-2 font-mono tabular-nums">
                    {tx.date} • {tx.channel} • Conf: {Math.round(tx.confidence * 100)}%
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a2333]">
                  <div className="text-[10px] uppercase tracking-wider text-[#626c79] font-medium mb-2">Assign Category:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Food & Dining', 'Transport', 'Healthcare', 'Rent & Housing', 'Groceries'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onCategorize(tx.id, cat, createRuleToggle)}
                        className="px-2.5 py-1.5 rounded text-[11px] bg-[#0e1420] hover:bg-[#1a263c] text-[#f0f6fc] border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70"
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
      </section>

      {/* Ingestion Console */}
      <section 
        aria-labelledby="ingest-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 id="ingest-heading" className="text-base font-semibold text-[#f0f6fc]">
              Import Bank Statements & Message Feeds
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Supports raw bank SMS notifications, CSV statement exports, and informal cash notes.
            </p>
          </div>

          <div className="flex bg-[#141d2e] p-1 rounded-lg border border-[#232f44] text-xs">
            {(['SMS', 'CSV', 'HINGLISH'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setIngestFormat(fmt)}
                className={`min-h-[36px] px-3 py-1 rounded-md transition-colors ${
                  ingestFormat === fmt
                    ? 'bg-[#1a263c] text-[#f0f6fc] font-medium'
                    : 'text-[#8b949e] hover:text-[#f0f6fc]'
                }`}
              >
                {fmt === 'SMS' && 'Bank SMS'}
                {fmt === 'CSV' && 'CSV Statement'}
                {fmt === 'HINGLISH' && 'Cash / Notes'}
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
                ? 'Paste bank SMS messages here...' 
                : ingestFormat === 'CSV' 
                ? 'Paste CSV statement lines (Date, Narration, Withdrawal, Deposit)...' 
                : 'Type informal note (e.g. "kal auto me 80 diye the")...'
            }
            className="w-full bg-[#090d14] border border-[#1a2333] rounded-lg p-3 text-xs text-[#f0f6fc] placeholder:text-[#626c79] focus:outline-none focus:border-[#2ea043] focus:ring-1 focus:ring-[#2ea043] font-mono leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleQuickLoad}
              className="text-xs text-[#8b949e] hover:text-[#f0f6fc] underline underline-offset-2 min-h-[44px] flex items-center"
            >
              Insert sample {ingestFormat} data
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#141d2e] hover:bg-[#1a263c] disabled:opacity-40 text-[#f0f6fc] text-xs font-semibold border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70 flex items-center space-x-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Process Entries</span>
            </button>
          </div>
        </form>
      </section>

      {/* Scoped Rules Directory */}
      <section 
        aria-labelledby="rules-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 id="rules-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">
              Active Scoped Rules Cache
            </h3>
            <p className="text-xs text-[#626c79] mt-0.5">
              Heuristics learned from your past confirmations (Payee + Amount Band + Time).
            </p>
          </div>
          <span className="text-xs text-[#626c79] font-mono tabular-nums">{rules.length} active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 rounded-lg bg-[#141d2e] border border-[#232f44]">
              <div className="font-semibold text-[#f0f6fc] truncate">{rule.payeePattern}</div>
              <div className="text-[11px] text-[#2ea043] mt-1 font-medium">
                {rule.category}
              </div>
              <div className="text-[10px] text-[#626c79] mt-1 font-mono tabular-nums">
                Band: ₹{rule.amountMin} – ₹{rule.amountMax}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
