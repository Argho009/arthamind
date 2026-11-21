import React, { useState } from 'react';
import { 
  Upload, FileText, MessageSquare, Mic, Check, 
  ArrowRight, ShieldCheck, Sparkles, Filter, Plus 
} from 'lucide-react';
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

  // Filter ambiguous items for the 2-minute review
  const pendingReviews = transactions.filter(t => t.reviewNeeded || !t.isReviewed);

  // Sample pre-fills for judges to test with 1-click
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
      {/* Active-Learning 2-Minute Review (Attacks the Productivity Tax) */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Active Learning Queue
              </span>
              <span className="text-xs text-slate-400">Weekly 2-Minute Review</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              Low-Homework Review ({pendingReviews.length} Ambiguous Spends)
            </h2>
            <p className="text-xs text-slate-400">
              ArthaMind auto-accepts high-confidence spends. Only review ambiguous P2P items. Categorizing one creates a persistent scoped rule!
            </p>
          </div>

          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer self-start md:self-auto">
            <input 
              type="checkbox" 
              checked={createRuleToggle} 
              onChange={(e) => setCreateRuleToggle(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Create Scoped Heuristic Rule on Fix</span>
          </label>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="py-8 text-center">
            <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">All caught up! Zero homework pending.</h4>
            <p className="text-xs text-slate-400">Your living money model is learning seamlessly from transaction patterns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {pendingReviews.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Confidence: {Math.round(tx.confidence * 100)}%
                    </span>
                    <span className="text-xs font-bold text-white">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{tx.cleanPayee}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
                    "{tx.rawText}"
                  </p>
                  <div className="text-[10px] text-slate-500 mt-2">
                    {tx.date} • {tx.channel} ({tx.bank})
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-medium text-slate-300 mb-2">Assign Category:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Food & Dining', 'Transport', 'Healthcare', 'Rent & Housing', 'Groceries'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => onCategorize(tx.id, cat, createRuleToggle)}
                        className="px-2 py-1 rounded-md text-[10px] font-medium bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700 hover:border-emerald-500/40 transition-colors"
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

      {/* Multi-Format Statement Ingestion Box */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Ingest Raw Statements & Messages</h3>
            <p className="text-xs text-slate-400">Handles messy SMS formats, bank statement CSV exports, and Hinglish voice notes.</p>
          </div>

          {/* Format Tabs */}
          <div className="flex bg-slate-800 p-1 rounded-lg">
            {(['SMS', 'CSV', 'HINGLISH'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setIngestFormat(fmt)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  ingestFormat === fmt
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt === 'SMS' && 'Bank SMS'}
                {fmt === 'CSV' && 'CSV Statement'}
                {fmt === 'HINGLISH' && 'Hinglish Text/Voice'}
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
                ? 'Paste raw bank transaction SMS messages here...' 
                : ingestFormat === 'CSV' 
                ? 'Paste CSV statement rows (Date, Narration, Debit, Credit)...' 
                : 'Type informal cash expense (e.g. "kal auto me 80 diye the")...'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleQuickLoad}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click here to pre-fill test {ingestFormat} sample</span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingest & Auto-Categorize</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Learned Scoped Rules Inspector */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Learned Scoped Rules (Persistent Rule Cache)</h3>
            <p className="text-xs text-slate-400">Rules generated automatically from your corrections to prevent recurring errors.</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{rules.length} active rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white truncate">{rule.payeePattern}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                  {Math.round(rule.confidence * 100)}%
                </span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">
                Band: ₹{rule.amountMin} - ₹{rule.amountMax}
              </div>
              <div className="text-emerald-400 font-medium mt-1">
                Category: {rule.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
