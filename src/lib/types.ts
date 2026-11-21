// Core domain types for ArthaMind

export type TransactionType = 'debit' | 'credit';
export type IngestionSource = 'SMS' | 'PDF' | 'CSV' | 'HINGLISH_VOICE' | 'MANUAL';
export type PaymentChannel = 'UPI' | 'CARD' | 'NETBANKING' | 'CASH' | 'ACH';
export type BankName = 'HDFC' | 'ICICI' | 'SBI' | 'AXIS' | 'KOTAK' | 'PAYTM' | 'CASH' | 'OTHER';

export interface Transaction {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  rawText: string;
  cleanPayee: string;
  source: IngestionSource;
  bank: BankName;
  channel: PaymentChannel;
  category: string;
  confidence: number; // 0.0 to 1.0
  isReviewed: boolean;
  reviewNeeded: boolean;
  isP2P: boolean;
  isReimbursed: boolean;
  linkedReimbursementId?: string;
  netAmount: number; // Spend after deducting reimbursements
  createdAt?: string;
}

export interface LivingProfile {
  id: string;
  userId: string;
  monthlyBaselineIncome: number;
  variableIncomeEstimate: number;
  fixedCosts: number;
  currentRent: number;
  emergencyFundTarget: number;
  emergencyFundCurrent: number;
  liquidCashBalance: number;
  paydayDayOfMonth: number;
  lastLifeEventSync?: string;
  runwayDays?: number;
  safeToSpendDaily?: number;
}

export interface ScopedRule {
  id: string;
  userId: string;
  payeePattern: string;
  amountMin: number;
  amountMax: number;
  timePattern: 'morning' | 'lunch' | 'night' | 'all';
  category: string;
  confidence: number;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  billingFrequency: 'monthly' | 'yearly' | 'quarterly';
  nextRenewalDate: string;
  lastChargedDate: string;
  priceChangeDetected: boolean;
  previousAmount?: number;
  status: 'active' | 'evaluating' | 'cancelled';
  userUsageConfirmed: boolean;
}

export interface SinkingFund {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  dueMonth: number; // 1 to 12
  monthlyAllocation: number;
  currentSaved: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  monthlyContribution: number;
  projectedCompletionDate?: string;
  onTrack?: boolean;
}

export type LifeEventType = 'RENT_INCREASE' | 'SALARY_INCREMENT' | 'NEW_EMI' | 'VARIABLE_INCOME_DIP';

export interface LifeEvent {
  id: string;
  userId: string;
  eventType: LifeEventType;
  description: string;
  detectedValue: number;
  previousValue: number;
  status: 'PENDING_CONFIRMATION' | 'ACCEPTED' | 'DISMISSED';
  detectedAt: string;
}

export interface GuardrailCheckResult {
  isCompliant: boolean;
  action: 'PASSED' | 'BLOCKED_SPECIFIC_STOCK' | 'BLOCKED_GUARANTEED_RETURN' | 'REDIRECTED_TO_EDUCATION';
  reason?: string;
  educationalAlternative?: string;
  aiAssistedLabel: boolean;
}

export interface WhatIfScenarioInput {
  scenarioType: 'CUT_CATEGORY' | 'RENT_INCREASE' | 'SALARY_CHANGE' | 'NEW_RECURRING';
  category?: string;
  percentChange?: number;
  amountDelta?: number;
  newAmount?: number;
}

export interface WhatIfSimulationResult {
  originalMonthlySurplus: number;
  newMonthlySurplus: number;
  monthlySavingsDelta: number;
  impactOnEmergencyFund: {
    originalMonthsToTarget: number;
    newMonthsToTarget: number;
    monthsSaved: number;
    targetDateOriginal: string;
    targetDateNew: string;
  };
  impactOnGoals: Array<{
    goalTitle: string;
    originalTargetDate: string;
    newTargetDate: string;
    monthsSavedOrDelayed: number;
  }>;
  runwayImpactDays: number;
  explanation: string;
}

export interface MonthlyReviewReport {
  month: string; // e.g. "November 2026"
  totalInflow: number;
  totalOutflow: number;
  netSavings: number;
  savingsRate: number; // percentage
  safeToSpendDaily: number;
  reimbursementTotalNetted: number;
  activeLearningStats: {
    totalTransactions: number;
    autoCategorizedCount: number;
    autoCategorizedPercentage: number;
    userReviewedCount: number;
  };
  sinkingFundAllocations: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  lifeEventsSummary: string[];
}
