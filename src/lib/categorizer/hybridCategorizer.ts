// 4-Tier Hybrid Categorization Engine (Cheapest & Fastest Step First)
import { ScopedRule, Transaction } from '../types';

export interface CategorizationResult {
  category: string;
  confidence: number;
  reviewNeeded: boolean;
  matchedRuleId?: string;
  strategyUsed: 'REGEX_MERCHANT' | 'SCOPED_RULE' | 'P2P_RESOLVER' | 'DEFAULT_FALLBACK';
}

// Built-in Merchant Dictionary for Indian Spends
const MERCHANT_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /swiggy|zomato|eatsure|mcdonald|starbucks|domino|kfc|burger king|chaayos|chai point/i, category: 'Food & Dining' },
  { pattern: /blinkit|zepto|instamart|bbnow|bigbasket|dmart|nature basket|reliance retail|kirana/i, category: 'Groceries' },
  { pattern: /uber|ola|rapido|blusmart|irctc|metro|redbus|makemytrip|indigo|air india/i, category: 'Transport' },
  { pattern: /netflix|spotify|prime|hotstar|youtube|apple\.com|kindle|audible|zee5|sony liv/i, category: 'Entertainment' },
  { pattern: /amazon|flipkart|myntra|ajio|zara|h&m|nykaa|tata cliq/i, category: 'Shopping' },
  { pattern: /bescom|tata power|adanipower|mahavitaran|airtel|jio|act fibernet|bsnl/i, category: 'Utilities' },
  { pattern: /apollo|pharmeasy|1mg|netmeds|medplus|dr lal|metropolis|hospital|clinic/i, category: 'Healthcare' },
  { pattern: /cult\.fit|gold gym|anytime fitness|decathlon/i.test, category: 'Fitness & Health' } as any,
  { pattern: /zerodha|groww|kuvera|indmoney|angel one|upstox|uti mf|hdfc mf|sbi mutual/i, category: 'Investments' },
  { pattern: /suresh sharma|landlord|nobroker|rent|nestaway/i, category: 'Rent & Housing' },
  { pattern: /salary|razorpay technologies|payroll|wipro|infosys|tcs|google india/i, category: 'Salary' }
];

export function categorizeTransaction(
  cleanPayee: string,
  amount: number,
  isP2P: boolean,
  rules: ScopedRule[] = [],
  timeOfDay: 'morning' | 'lunch' | 'night' | 'all' = 'all'
): CategorizationResult {
  const payeeLower = cleanPayee.toLowerCase();

  // Tier 1: Check User's Scoped Heuristic Rules (Highest Precision)
  for (const rule of rules) {
    const regex = new RegExp(rule.payeePattern, 'i');
    if (regex.test(cleanPayee)) {
      // Check amount band
      if (amount >= rule.amountMin && amount <= rule.amountMax) {
        // Check time pattern if specified
        if (rule.timePattern === 'all' || rule.timePattern === timeOfDay) {
          return {
            category: rule.category,
            confidence: rule.confidence || 0.99,
            reviewNeeded: false,
            matchedRuleId: rule.id,
            strategyUsed: 'SCOPED_RULE'
          };
        }
      }
    }
  }

  // Tier 2: Check Built-in Indian Merchant Directory
  for (const entry of MERCHANT_PATTERNS) {
    if (entry.pattern.test(cleanPayee)) {
      return {
        category: entry.category,
        confidence: 0.95,
        reviewNeeded: false,
        strategyUsed: 'REGEX_MERCHANT'
      };
    }
  }

  // Tier 3: Handle P2P UPI Payments
  if (isP2P) {
    // High amount to person often = Rent or Emergency Loan
    if (amount >= 15000) {
      return {
        category: 'Rent & Housing',
        confidence: 0.70,
        reviewNeeded: true, // Needs verification in 2-min review
        strategyUsed: 'P2P_RESOLVER'
      };
    }
    // Small micro-amounts in morning/lunch often = Chai/Meals
    if (amount <= 300) {
      return {
        category: 'Food & Dining',
        confidence: 0.65,
        reviewNeeded: true,
        strategyUsed: 'P2P_RESOLVER'
      };
    }
    // Ambiguous P2P middle band
    return {
      category: 'Uncategorized P2P',
      confidence: 0.40,
      reviewNeeded: true,
      strategyUsed: 'P2P_RESOLVER'
    };
  }

  // Tier 4: Fallback
  return {
    category: 'General Expense',
    confidence: 0.50,
    reviewNeeded: true,
    strategyUsed: 'DEFAULT_FALLBACK'
  };
}
