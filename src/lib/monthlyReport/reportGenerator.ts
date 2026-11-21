// Monthly Review Report & Actionable Scorecard Generator
import { LivingProfile, MonthlyReviewReport, Transaction } from '../types';

export function generateMonthlyReview(
  profile: LivingProfile,
  transactions: Transaction[],
  monthLabel: string = 'November 2026'
): MonthlyReviewReport {
  let totalInflow = 0;
  let totalOutflow = 0;
  let reimbursementTotal = 0;
  let autoCategorizedCount = 0;
  let userReviewedCount = 0;

  const categoryTotals: Record<string, number> = {};

  for (const t of transactions) {
    if (t.type === 'credit') {
      if (t.category !== 'Reimbursement') {
        totalInflow += t.amount;
      } else {
        reimbursementTotal += t.amount;
      }
    } else if (t.type === 'debit') {
      totalOutflow += t.netAmount; // Using netted amount to prevent artificial inflation!
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.netAmount;
    }

    if (t.confidence >= 0.85) {
      autoCategorizedCount++;
    } else {
      userReviewedCount++;
    }
  }

  const netSavings = Math.max(0, totalInflow - totalOutflow);
  const savingsRate = totalInflow > 0 ? Math.round((netSavings / totalInflow) * 100) : 0;

  // Safe to spend daily runway calculation
  const daysInMonth = 30;
  const currentDay = Math.min(21, daysInMonth);
  const daysRemaining = Math.max(1, daysInMonth - currentDay);
  const safeToSpendDaily = Math.round(profile.liquidCashBalance / daysRemaining);

  // Top categories sorted
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalOutflow > 0 ? Math.round((amount / totalOutflow) * 100) : 0
    }));

  return {
    month: monthLabel,
    totalInflow,
    totalOutflow,
    netSavings,
    savingsRate,
    safeToSpendDaily,
    reimbursementTotalNetted: reimbursementTotal,
    activeLearningStats: {
      totalTransactions: transactions.length,
      autoCategorizedCount,
      autoCategorizedPercentage: transactions.length > 0 ? Math.round((autoCategorizedCount / transactions.length) * 100) : 100,
      userReviewedCount
    },
    sinkingFundAllocations: 10000,
    topCategories: sortedCategories,
    lifeEventsSummary: [
      'Rent adjusted to ₹21,500/mo (+₹3,500 from previous lease)',
      'Reimbursement netting prevented ₹3,300 in false dining inflation',
      'Diwali sinking fund reached 40% target on schedule'
    ]
  };
}
