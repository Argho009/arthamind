// Cloudflare Pages Functions / Workers API Endpoint using Hono
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { dataStore } from '../../src/lib/data/store';
import { parseBankSMS } from '../../src/lib/parsers/smsParser';
import { parseCSVStatement } from '../../src/lib/parsers/csvParser';
import { parseHinglishExpense } from '../../src/lib/parsers/hinglishParser';
import { categorizeTransaction } from '../../src/lib/categorizer/hybridCategorizer';
import { runWhatIfSimulation } from '../../src/lib/simulator/deterministicEngine';
import { evaluateSEBIGuardrails } from '../../src/lib/guardrails/sebiGuardrails';
import { generateMonthlyReview } from '../../src/lib/monthlyReport/reportGenerator';
import { Transaction } from '../../src/lib/types';

export interface Env {
  DB?: any; // Cloudflare D1 Database binding
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>().basePath('/api');

// Enable CORS for development
app.use('*', cors());

// Health / Status Check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    runtime: 'Cloudflare Pages Functions / Workers',
    d1Connected: !!c.env?.DB,
    timestamp: new Date().toISOString()
  });
});

// Profile & Living Money Model
app.get('/profile', (c) => {
  return c.json({
    profile: dataStore.getProfile(),
    lifeEvents: dataStore.getLifeEvents(),
    subscriptions: dataStore.getSubscriptions(),
    sinkingFunds: dataStore.getSinkingFunds(),
    goals: dataStore.getGoals()
  });
});

app.post('/profile', async (c) => {
  const body = await c.req.json();
  const updated = dataStore.updateProfile(body);
  return c.json({ success: true, profile: updated });
});

// Transactions: List & Ingest
app.get('/transactions', (c) => {
  return c.json({ transactions: dataStore.getTransactions() });
});

app.post('/transactions/ingest', async (c) => {
  const body = await c.req.json<{ text: string; format: 'SMS' | 'CSV' | 'HINGLISH' }>();
  const { text, format } = body;
  const newTxns: Transaction[] = [];
  const rules = dataStore.getScopedRules();

  if (format === 'SMS') {
    // Split multi-SMS if pasted in bulk
    const messages = text.split(/\n\s*\n/).filter(m => m.trim().length > 0);
    for (const msg of messages) {
      const parsed = parseBankSMS(msg);
      if (parsed) {
        const cat = categorizeTransaction(parsed.cleanPayee, parsed.amount, parsed.isP2P, rules);
        newTxns.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      const cat = categorizeTransaction(row.cleanPayee, row.amount, row.isP2P, rules);
      newTxns.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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

  const allTxns = dataStore.addTransactions(newTxns);
  return c.json({
    success: true,
    ingestedCount: newTxns.length,
    totalTransactions: allTxns.length,
    transactions: allTxns
  });
});

// Active-Learning Category Correction & Scoped Rule Learning
app.post('/transactions/review', async (c) => {
  const body = await c.req.json<{ transactionId: string; newCategory: string; createRule?: boolean }>();
  dataStore.updateTransactionCategory(body.transactionId, body.newCategory, body.createRule ?? true);
  return c.json({
    success: true,
    transactions: dataStore.getTransactions(),
    scopedRules: dataStore.getScopedRules()
  });
});

// Life-Event Resolution
app.post('/living-model/resolve', async (c) => {
  const body = await c.req.json<{ eventId: string; accept: boolean }>();
  dataStore.resolveLifeEvent(body.eventId, body.accept);
  return c.json({
    success: true,
    profile: dataStore.getProfile(),
    lifeEvents: dataStore.getLifeEvents()
  });
});

// Deterministic What-If Simulation
app.post('/simulate', async (c) => {
  const body = await c.req.json();
  const profile = dataStore.getProfile();
  const goals = dataStore.getGoals();
  const txns = dataStore.getTransactions();

  // Aggregate category spends
  const categorySpends: Record<string, number> = {};
  for (const t of txns) {
    if (t.type === 'debit') {
      categorySpends[t.category] = (categorySpends[t.category] || 0) + t.netAmount;
    }
  }

  const result = runWhatIfSimulation(profile, goals, categorySpends, body);
  return c.json({ success: true, simulation: result });
});

// SEBI Guardrail Evaluation
app.post('/guardrails/check', async (c) => {
  const body = await c.req.json<{ query: string }>();
  const evalResult = evaluateSEBIGuardrails(body.query);
  return c.json({ success: true, guardrail: evalResult });
});

// Monthly Review Report
app.get('/monthly-report', (c) => {
  const profile = dataStore.getProfile();
  const txns = dataStore.getTransactions();
  const report = generateMonthlyReview(profile, txns);
  return c.json({ success: true, report });
});

export default app;
