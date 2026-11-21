// Unified Data Store (Edge-Compatible with Cloudflare D1 & In-Memory Fallback)
import { 
  LivingProfile, Transaction, ScopedRule, Subscription, 
  SinkingFund, Goal, LifeEvent, MonthlyReviewReport 
} from '../types';
import { calculateReimbursementNetting } from '../categorizer/reimbursementNetter';
import { detectLifeEvents } from '../livingModel/lifeEventDetector';

export class ArthaDataStore {
  private profile: LivingProfile = {
    id: 'prof_demo_01',
    userId: 'user_demo_01',
    monthlyBaselineIncome: 95000,
    variableIncomeEstimate: 15000,
    fixedCosts: 36500,
    currentRent: 18000,
    emergencyFundTarget: 250000,
    emergencyFundCurrent: 160000,
    liquidCashBalance: 48500,
    paydayDayOfMonth: 1,
    runwayDays: 40,
    safeToSpendDaily: 1616
  };

  private transactions: Transaction[] = [
    {
      id: 'tx_01',
      userId: 'user_demo_01',
      date: '2026-11-01',
      amount: 95000,
      type: 'credit',
      rawText: 'Salary credited from Razorpay Technologies Ltd NEFT REF 9021',
      cleanPayee: 'Razorpay Technologies',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'NETBANKING',
      category: 'Salary',
      confidence: 1.0,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: false,
      isReimbursed: false,
      netAmount: 95000
    },
    {
      id: 'tx_02',
      userId: 'user_demo_01',
      date: '2026-11-02',
      amount: 21500,
      type: 'debit',
      rawText: 'Sent Rs 21,500.00 via UPI to Suresh Sharma Landlord UPI Ref 410291910',
      cleanPayee: 'Suresh Sharma',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Rent & Housing',
      confidence: 0.92,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: true,
      isReimbursed: false,
      netAmount: 21500
    },
    {
      id: 'tx_03',
      userId: 'user_demo_01',
      date: '2026-11-04',
      amount: 1850,
      type: 'debit',
      rawText: 'Paid Rs 1850.00 to Blinkit Quick Commerce Gurgaon',
      cleanPayee: 'Blinkit',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Groceries',
      confidence: 0.98,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: false,
      isReimbursed: false,
      netAmount: 1850
    },
    {
      id: 'tx_04',
      userId: 'user_demo_01',
      date: '2026-11-06',
      amount: 420,
      type: 'debit',
      rawText: 'Paid Rs 420.00 to Uber India Bangalore on Card **4102',
      cleanPayee: 'Uber India',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'CARD',
      category: 'Transport',
      confidence: 0.97,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: false,
      isReimbursed: false,
      netAmount: 420
    },
    // Splitwise dinner with Reimbursement Netting scenario
    {
      id: 'tx_05',
      userId: 'user_demo_01',
      date: '2026-11-10',
      amount: 4400,
      type: 'debit',
      rawText: 'Paid Rs 4400.00 at Toit Indiranagar Bangalore on Card **4102',
      cleanPayee: 'Toit Brewpub',
      source: 'CSV',
      bank: 'HDFC',
      channel: 'CARD',
      category: 'Food & Dining',
      confidence: 0.99,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: false,
      isReimbursed: true,
      linkedReimbursementId: 'tx_06,tx_07,tx_08',
      netAmount: 1100 // Auto-netted!
    },
    {
      id: 'tx_06',
      userId: 'user_demo_01',
      date: '2026-11-10',
      amount: 1100,
      type: 'credit',
      rawText: 'UPI/P2M/CR/Karan Verma/Toit share/HDFC/5541',
      cleanPayee: 'Karan Verma (Splitwise)',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Reimbursement',
      confidence: 0.95,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: true,
      isReimbursed: true,
      linkedReimbursementId: 'tx_05',
      netAmount: 0
    },
    {
      id: 'tx_07',
      userId: 'user_demo_01',
      date: '2026-11-10',
      amount: 1100,
      type: 'credit',
      rawText: 'UPI/P2M/CR/Rhea Sen/Dinner/HDFC/5542',
      cleanPayee: 'Rhea Sen (Splitwise)',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Reimbursement',
      confidence: 0.95,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: true,
      isReimbursed: true,
      linkedReimbursementId: 'tx_05',
      netAmount: 0
    },
    {
      id: 'tx_08',
      userId: 'user_demo_01',
      date: '2026-11-11',
      amount: 1100,
      type: 'credit',
      rawText: 'UPI/P2M/CR/Ankit J/food/HDFC/5543',
      cleanPayee: 'Ankit J (Splitwise)',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Reimbursement',
      confidence: 0.95,
      isReviewed: true,
      reviewNeeded: false,
      isP2P: true,
      isReimbursed: true,
      linkedReimbursementId: 'tx_05',
      netAmount: 0
    },
    // Ambiguous items waiting in the 2-Minute Review Queue
    {
      id: 'tx_09',
      userId: 'user_demo_01',
      date: '2026-11-18',
      amount: 350,
      type: 'debit',
      rawText: 'Sent Rs 350.00 to Ramesh Kumar UPI Ref 410881',
      cleanPayee: 'Ramesh Kumar',
      source: 'SMS',
      bank: 'HDFC',
      channel: 'UPI',
      category: 'Uncategorized P2P',
      confidence: 0.45,
      isReviewed: false,
      reviewNeeded: true,
      isP2P: true,
      isReimbursed: false,
      netAmount: 350
    },
    {
      id: 'tx_10',
      userId: 'user_demo_01',
      date: '2026-11-19',
      amount: 1200,
      type: 'debit',
      rawText: 'Sent Rs 1200.00 to Pooja Medicals UPI Ref 410912',
      cleanPayee: 'Pooja Medicals',
      source: 'SMS',
      bank: 'ICICI',
      channel: 'UPI',
      category: 'Healthcare',
      confidence: 0.65,
      isReviewed: false,
      reviewNeeded: true,
      isP2P: false,
      isReimbursed: false,
      netAmount: 1200
    },
    {
      id: 'tx_11',
      userId: 'user_demo_01',
      date: '2026-11-20',
      amount: 80,
      type: 'debit',
      rawText: 'kal auto wale bhaiya ko 80 diye the cash me',
      cleanPayee: 'Auto Cash',
      source: 'HINGLISH_VOICE',
      bank: 'CASH',
      channel: 'CASH',
      category: 'Transport',
      confidence: 0.70,
      isReviewed: false,
      reviewNeeded: true,
      isP2P: false,
      isReimbursed: false,
      netAmount: 80
    }
  ];

  private scopedRules: ScopedRule[] = [
    { id: 'rule_01', userId: 'user_demo_01', payeePattern: 'Swiggy', amountMin: 0, amountMax: 5000, timePattern: 'all', category: 'Food & Dining', confidence: 0.99 },
    { id: 'rule_02', userId: 'user_demo_01', payeePattern: 'Zomato', amountMin: 0, amountMax: 5000, timePattern: 'all', category: 'Food & Dining', confidence: 0.99 },
    { id: 'rule_03', userId: 'user_demo_01', payeePattern: 'Uber India', amountMin: 0, amountMax: 2000, timePattern: 'all', category: 'Transport', confidence: 0.95 },
    { id: 'rule_04', userId: 'user_demo_01', payeePattern: 'Blinkit', amountMin: 0, amountMax: 3000, timePattern: 'all', category: 'Groceries', confidence: 0.96 }
  ];

  private subscriptions: Subscription[] = [
    {
      id: 'sub_01',
      userId: 'user_demo_01',
      name: 'Netflix Premium',
      amount: 649,
      billingFrequency: 'monthly',
      nextRenewalDate: '2026-11-28',
      lastChargedDate: '2026-10-28',
      priceChangeDetected: true,
      previousAmount: 499,
      status: 'evaluating',
      userUsageConfirmed: true
    },
    {
      id: 'sub_02',
      userId: 'user_demo_01',
      name: 'Spotify Individual',
      amount: 119,
      billingFrequency: 'monthly',
      nextRenewalDate: '2026-11-24',
      lastChargedDate: '2026-10-24',
      priceChangeDetected: false,
      previousAmount: 119,
      status: 'active',
      userUsageConfirmed: true
    },
    {
      id: 'sub_03',
      userId: 'user_demo_01',
      name: 'Cult.fit Gym',
      amount: 1750,
      billingFrequency: 'monthly',
      nextRenewalDate: '2026-12-05',
      lastChargedDate: '2026-11-05',
      priceChangeDetected: false,
      previousAmount: 1750,
      status: 'active',
      userUsageConfirmed: true
    }
  ];

  private sinkingFunds: SinkingFund[] = [
    { id: 'sink_01', userId: 'user_demo_01', name: 'Diwali Gifts & Travel', targetAmount: 35000, dueMonth: 10, monthlyAllocation: 3500, currentSaved: 14000 },
    { id: 'sink_02', userId: 'user_demo_01', name: 'Car Insurance (Annual)', targetAmount: 18000, dueMonth: 4, monthlyAllocation: 1500, currentSaved: 9000 }
  ];

  private goals: Goal[] = [
    { id: 'goal_01', userId: 'user_demo_01', title: '6-Month Emergency Cushion', targetAmount: 250000, currentAmount: 160000, targetDate: '2027-03-31', priority: 'high', monthlyContribution: 15000, onTrack: true },
    { id: 'goal_02', userId: 'user_demo_01', title: 'Ladakh Expedition 2027', targetAmount: 75000, currentAmount: 32000, targetDate: '2027-06-30', priority: 'medium', monthlyContribution: 6000, onTrack: true }
  ];

  private lifeEvents: LifeEvent[] = [
    {
      id: 'event_01',
      userId: 'user_demo_01',
      eventType: 'RENT_INCREASE',
      description: 'Rent payment to landlord Suresh Sharma shifted from ₹18,000 to ₹21,500 (+₹3,500/mo)',
      detectedValue: 21500,
      previousValue: 18000,
      status: 'PENDING_CONFIRMATION',
      detectedAt: '2026-11-20 10:14:00'
    }
  ];

  // Getters
  public getProfile(): LivingProfile {
    return { ...this.profile };
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public getScopedRules(): ScopedRule[] {
    return [...this.scopedRules];
  }

  public getSubscriptions(): Subscription[] {
    return [...this.subscriptions];
  }

  public getSinkingFunds(): SinkingFund[] {
    return [...this.sinkingFunds];
  }

  public getGoals(): Goal[] {
    return [...this.goals];
  }

  public getLifeEvents(): LifeEvent[] {
    return [...this.lifeEvents];
  }

  // Mutators
  public updateProfile(updates: Partial<LivingProfile>): LivingProfile {
    this.profile = { ...this.profile, ...updates };
    return this.profile;
  }

  public addTransactions(newTxns: Transaction[]): Transaction[] {
    const combined = [...newTxns, ...this.transactions];
    // Re-run reimbursement netting and life event detection
    this.transactions = calculateReimbursementNetting(combined);
    this.lifeEvents = detectLifeEvents(this.profile, this.transactions, this.lifeEvents);
    return this.transactions;
  }

  public updateTransactionCategory(txId: string, newCategory: string, createRule: boolean = true): void {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;

    tx.category = newCategory;
    tx.isReviewed = true;
    tx.reviewNeeded = false;
    tx.confidence = 1.0;

    if (createRule) {
      // Create a scoped heuristic rule (Payee + Band + Time)
      const newRule: ScopedRule = {
        id: `rule_${Date.now()}`,
        userId: tx.userId,
        payeePattern: tx.cleanPayee,
        amountMin: Math.max(0, Math.floor(tx.amount * 0.5)),
        amountMax: Math.ceil(tx.amount * 2.0),
        timePattern: 'all',
        category: newCategory,
        confidence: 0.99
      };
      this.scopedRules.push(newRule);
    }
  }

  public resolveLifeEvent(eventId: string, accept: boolean): void {
    const event = this.lifeEvents.find(e => e.id === eventId);
    if (!event) return;

    if (accept) {
      event.status = 'ACCEPTED';
      if (event.eventType === 'RENT_INCREASE') {
        const delta = event.detectedValue - this.profile.currentRent;
        this.profile.currentRent = event.detectedValue;
        this.profile.fixedCosts += delta;
      } else if (event.eventType === 'SALARY_INCREMENT') {
        this.profile.monthlyBaselineIncome = event.detectedValue;
      }
    } else {
      event.status = 'DISMISSED';
    }
  }

  public confirmSubscriptionUsage(subId: string, stillUsing: boolean): void {
    const sub = this.subscriptions.find(s => s.id === subId);
    if (!sub) return;
    sub.userUsageConfirmed = stillUsing;
    if (!stillUsing) {
      sub.status = 'evaluating';
    }
  }
}

export const dataStore = new ArthaDataStore();
