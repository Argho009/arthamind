import React, { useState } from 'react';
import { Header } from './components/Header';
import { LivingModelBanner } from './components/LivingModelBanner';
import { DashboardTab } from './components/tabs/DashboardTab';
import { IngestionReviewTab } from './components/tabs/IngestionReviewTab';
import { ReimbursementNettingTab } from './components/tabs/ReimbursementNettingTab';
import { SimulatorTab } from './components/tabs/SimulatorTab';
import { SubscriptionsTab } from './components/tabs/SubscriptionsTab';
import { GuardrailsLabTab } from './components/tabs/GuardrailsLabTab';
import { MonthlyReportTab } from './components/tabs/MonthlyReportTab';
import { dataStore } from './lib/data/store';
import { parseBankSMS } from './lib/parsers/smsParser';
import { parseCSVStatement } from './lib/parsers/csvParser';
import { parseHinglishExpense } from './lib/parsers/hinglishParser';
import { categorizeTransaction } from './lib/categorizer/hybridCategorizer';
import { generateMonthlyReview } from './lib/monthlyReport/reportGenerator';
import { Transaction } from './lib/types';
import { Github } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(() => dataStore.getProfile());
  const [transactions, setTransactions] = useState(() => dataStore.getTransactions());
  const [rules, setRules] = useState(() => dataStore.getScopedRules());
  const [subscriptions, setSubscriptions] = useState(() => dataStore.getSubscriptions());
  const [sinkingFunds, setSinkingFunds] = useState(() => dataStore.getSinkingFunds());
  const [goals, setGoals] = useState(() => dataStore.getGoals());
  const [lifeEvents, setLifeEvents] = useState(() => dataStore.getLifeEvents());

  const pendingReviewsCount = transactions.filter(t => t.reviewNeeded || !t.isReviewed).length;
  const hasLifeEvent = lifeEvents.some(e => e.status === 'PENDING_CONFIRMATION');

  const categorySpends: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type === 'debit') {
      categorySpends[t.category] = (categorySpends[t.category] || 0) + t.netAmount;
    }
  }

  const monthlyReport = generateMonthlyReview(profile, transactions);

  // Ingestion Handler
  const handleIngest = (text: string, format: 'SMS' | 'CSV' | 'HINGLISH') => {
    const newTxns: Transaction[] = [];
    const currentRules = dataStore.getScopedRules();

    if (format === 'SMS') {
      const messages = text.split(/\n\s*\n/).filter(m => m.trim().length > 0);
      for (const msg of messages) {
        const parsed = parseBankSMS(msg);
        if (parsed) {
          const cat = categorizeTransaction(parsed.cleanPayee, parsed.amount, parsed.isP2P, currentRules);
          newTxns.push({
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            userId: 'user_demo_01',
            date: parsed.date,
            amount: parsed.amount,
            type: parsed.type,
            rawText: parsed.rawText,
            cleanPayee: parsed.cleanPayee,
            source: 'SMS',
            bank: parsed.bank,
            channel: parsed.channel,
            category: cat.category,
            confidence: cat.confidence,
            isReviewed: !cat.reviewNeeded,
            reviewNeeded: cat.reviewNeeded,
            isP2P: parsed.isP2P,
            isReimbursed: false,
            netAmount: parsed.amount
          });
        }
      }
    } else if (format === 'CSV') {
      const parsedRows = parseCSVStatement(text);
      for (const row of parsedRows) {
        const cat = categorizeTransaction(row.cleanPayee, row.amount, row.isP2P, currentRules);
        newTxns.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId: 'user_demo_01',
          date: row.date,
          amount: row.amount,
          type: row.type,
          rawText: row.rawText,
          cleanPayee: row.cleanPayee,
          source: 'CSV',
          bank: row.bank,
          channel: row.channel,
          category: cat.category,
          confidence: cat.confidence,
          isReviewed: !cat.reviewNeeded,
          reviewNeeded: cat.reviewNeeded,
          isP2P: row.isP2P,
          isReimbursed: false,
          netAmount: row.amount
        });
      }
    } else if (format === 'HINGLISH') {
      const parsed = parseHinglishExpense(text);
      if (parsed) {
        newTxns.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId: 'user_demo_01',
          date: parsed.date,
          amount: parsed.amount,
          type: parsed.type,
          rawText: parsed.rawText,
          cleanPayee: parsed.cleanPayee,
          source: 'HINGLISH_VOICE',
          bank: 'CASH',
          channel: 'CASH',
          category: parsed.category,
          confidence: parsed.confidence,
          isReviewed: false,
          reviewNeeded: true,
          isP2P: false,
          isReimbursed: false,
          netAmount: parsed.amount
        });
      }
    }

    const updated = dataStore.addTransactions(newTxns);
    setTransactions([...updated]);
    setLifeEvents([...dataStore.getLifeEvents()]);
  };

  const handleCategorize = (txId: string, category: string, createRule: boolean) => {
    dataStore.updateTransactionCategory(txId, category, createRule);
    setTransactions([...dataStore.getTransactions()]);
    setRules([...dataStore.getScopedRules()]);
  };

  const handleResolveLifeEvent = (eventId: string, accept: boolean) => {
    dataStore.resolveLifeEvent(eventId, accept);
    setProfile({ ...dataStore.getProfile() });
    setLifeEvents([...dataStore.getLifeEvents()]);
  };

  const handleConfirmUsage = (subId: string, stillUsing: boolean) => {
    dataStore.confirmSubscriptionUsage(subId, stillUsing);
    setSubscriptions([...dataStore.getSubscriptions()]);
  };

  return (
    <div className="min-h-screen bg-[#090d14] flex flex-col text-[#f0f6fc]">
      <Header
        safeToSpendDaily={profile.safeToSpendDaily || 1616}
        runwayDays={profile.runwayDays || 40}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviewsCount={pendingReviewsCount}
        hasLifeEvent={hasLifeEvent}
      />

      <LivingModelBanner
        events={lifeEvents}
        onResolve={handleResolveLifeEvent}
      />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            profile={profile}
            transactions={transactions}
            goals={goals}
            onOpenReview={() => setActiveTab('ingestion')}
            pendingReviewCount={pendingReviewsCount}
          />
        )}

        {activeTab === 'ingestion' && (
          <IngestionReviewTab
            transactions={transactions}
            rules={rules}
            onIngest={handleIngest}
            onCategorize={handleCategorize}
          />
        )}

        {activeTab === 'reimbursement' && (
          <ReimbursementNettingTab
            transactions={transactions}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorTab
            profile={profile}
            goals={goals}
            categorySpends={categorySpends}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsTab
            subscriptions={subscriptions}
            sinkingFunds={sinkingFunds}
            onConfirmUsage={handleConfirmUsage}
          />
        )}

        {activeTab === 'guardrails' && (
          <GuardrailsLabTab />
        )}

        {activeTab === 'monthly' && (
          <MonthlyReportTab
            report={monthlyReport}
          />
        )}
      </main>

      <footer className="border-t border-[#1a2333] bg-[#090d14] py-6 mt-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#626c79]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#8b949e]">ArthaMind</span>
            <span>•</span>
            <span>Architectural Financial Ledger</span>
          </div>
          <a 
            href="https://github.com/Argho009/arthamind" 
            target="_blank" 
            rel="noreferrer" 
            className="min-h-[44px] flex items-center space-x-2 text-[#8b949e] hover:text-[#f0f6fc] transition-colors font-mono"
          >
            <Github className="w-4 h-4 stroke-[1.5]" />
            <span>Argho009/arthamind</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
