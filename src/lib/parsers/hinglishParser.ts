// Hinglish Natural Language Cash & Micro-Expense Parser
import { Transaction, PaymentChannel, TransactionType } from '../types';

export interface ParsedHinglishResult {
  amount: number;
  type: TransactionType;
  cleanPayee: string;
  category: string;
  date: string;
  confidence: number;
  rawText: string;
}

export function parseHinglishExpense(text: string): ParsedHinglishResult | null {
  const clean = text.trim();
  if (!clean) return null;

  // 1. Extract Amount
  // Matches "20 rs", "rs 20", "rupaye 50", "80 diye", "150 lag gaye"
  const amountMatch = clean.match(/(?:rs\.?|inr|₹|rupaye|rupees)?\s*(\d+(?:\.\d{1,2})?)\s*(?:rs\.?|rupaye|rupees|ka|ke|me|diye|lage|kharch)?/i);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1]);
  if (isNaN(amount) || amount <= 0) return null;

  // 2. Detect Date (e.g. "kal" = yesterday, "aaj" = today, "parso" = day before)
  const today = new Date();
  let date = today.toISOString().split('T')[0];
  if (/kal|yesterday/i.test(clean) && !/kal raat/i.test(clean)) {
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    date = yest.toISOString().split('T')[0];
  } else if (/parso/i.test(clean)) {
    const parso = new Date(today);
    parso.setDate(parso.getDate() - 2);
    date = parso.toISOString().split('T')[0];
  }

  // 3. Infer Category and Payee
  let category = 'Misc Cash';
  let cleanPayee = 'Cash Expense';
  let confidence = 0.85;

  if (/chai|tea|coffee|samosa|snack|maggie|tapri/i.test(clean)) {
    category = 'Food & Dining';
    cleanPayee = 'Chai & Snacks';
  } else if (/auto|rickshaw|metro|cab|taxi|bus|petrol|diesel/i.test(clean)) {
    category = 'Transport';
    cleanPayee = 'Auto / Local Commute';
  } else if (/sabzi|fruit|doodh|milk|bread|kirana|ration/i.test(clean)) {
    category = 'Groceries';
    cleanPayee = 'Kirana & Local Market';
  } else if (/dawa|medicine|tablet|doctor/i.test(clean)) {
    category = 'Healthcare';
    cleanPayee = 'Pharmacy';
  } else if (/recharge|dth|wifi/i.test(clean)) {
    category = 'Utilities';
    cleanPayee = 'Mobile / DTH Recharge';
  }

  return {
    amount,
    type: 'debit',
    cleanPayee,
    category,
    date,
    confidence,
    rawText: clean
  };
}
