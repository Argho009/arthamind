import React, { useState, useEffect } from 'react';
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
import { Github, Database, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(() => dataStore.getProfile());
  const [transactions, setTransactions] = useState(() => dataStore.getTransactions());
  const [rules, setRules] = useState(() => dataStore.getScopedRules());
  const [subscriptions, setSubscriptions] = useState(() => dataStore.getSubscriptions());
  const [sinkingFunds, setSinkingFunds] = useState(() => dataStore.getSinkingFunds());
  const [goals, setGoals] = useState(() => dataStore.getGoals());
  const [lifeEvents, setLifeEvents] = useState(() => dataStore.getLifeEvents());

  // Count pending reviews for the 2-minute review badge
  const pendingReviewsCount = transactions.filter(t => t.reviewNeeded || !t.isReviewed).length;
  const hasLifeEvent = lifeEvents.some(e => e.status === 'PENDING_CONFIRMATION');

  // Aggregate category spends for simulation & reports
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

  // Categorize & Create Rule
  const handleCategorize = (txId: string, category: string, createRule: boolean) => {
    dataStore.updateTransactionCategory(txId, category, createRule);
    setTransactions([...dataStore.getTransactions()]);
    setRules([...dataStore.getScopedRules()]);
  };

  // Life Event Resolution
  const handleResolveLifeEvent = (eventId: string, accept: boolean) => {
    dataStore.resolveLifeEvent(eventId, accept);
    setProfile({ ...dataStore.getProfile() });
    setLifeEvents([...dataStore.getLifeEvents()]);
  };

  // Subscription Usage Confirmation
  const handleConfirmUsage = (subId: string, stillUsing: boolean) => {
    dataStore.confirmSubscriptionUsage(subId, stillUsing);
    setSubscriptions([...dataStore.getSubscriptions()]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header with Navigation */}
      <Header
        safeToSpendDaily={profile.safeToSpendDaily || 1616}
        runwayDays={profile.runwayDays || 40}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviewsCount={pendingReviewsCount}
        hasLifeEvent={hasLifeEvent}
      />

      {/* Autonomous Life-Event Shift Banner */}
      <LivingModelBanner
        events={lifeEvents}
        onResolve={handleResolveLifeEvent}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">ArthaMind 🧠</span>
            <span>•</span>
            <span>Living Money Model & Deterministic Coach</span>
            <span>•</span>
            <span className="text-emerald-400">Agentic AI Hackathon 2026</span>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Argho009/arthamind" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Argho009/arthamind</span>
            </a>
            <span>•</span>
            <span className="text-orange-400 flex items-center space-x-1">
              <Database className="w-3.5 h-3.5" />
              <span>Cloudflare D1 Ready</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
