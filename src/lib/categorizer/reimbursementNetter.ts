// Auto Reimbursement Netting Engine (Fixes the "Friends pay you back, spending looks inflated" trap)
import { Transaction } from '../types';

export function calculateReimbursementNetting(transactions: Transaction[]): Transaction[] {
  const result: Transaction[] = JSON.parse(JSON.stringify(transactions));

  // Find debits > 500 (typical group dinners, outing tickets, cabs)
  const debits = result.filter(t => t.type === 'debit' && t.amount >= 500);
  const credits = result.filter(t => t.type === 'credit' && t.amount > 0 && t.category !== 'Salary');

  for (const debit of debits) {
    const debitTime = new Date(debit.date).getTime();
    const linkedCreditIds: string[] = [];
    let totalReimbursed = 0;

    for (const credit of credits) {
      if (credit.isReimbursed) continue;

      const creditTime = new Date(credit.date).getTime();
      const diffDays = (creditTime - debitTime) / (1000 * 60 * 60 * 24);

      // Within 5 days of debit
      if (diffDays >= 0 && diffDays <= 5) {
        const text = `${credit.cleanPayee} ${credit.rawText}`.toLowerCase();
        const payeeText = debit.cleanPayee.toLowerCase();

        // 1. Explicit keyword match (e.g. payee name mentioned in UPI remarks or "split", "share", "dinner")
        const mentionsDebitPayee = text.includes(payeeText) || 
                                   /splitwise|share|dinner|food|party|cab|trip|reimburse/i.test(text);

        // 2. Exact mathematical divisor (e.g., 4400 / 4 = 1100, or 4400 / 2 = 2200)
        const isExactDivisor = (debit.amount % credit.amount === 0) && (credit.amount < debit.amount);

        if (mentionsDebitPayee || isExactDivisor) {
          linkedCreditIds.push(credit.id);
          totalReimbursed += credit.amount;
          credit.isReimbursed = true;
          credit.linkedReimbursementId = debit.id;
          credit.category = 'Reimbursement';
          credit.netAmount = 0; // Does not count as new income
        }
      }
    }

    if (linkedCreditIds.length > 0) {
      debit.isReimbursed = true;
      debit.linkedReimbursementId = linkedCreditIds.join(',');
      debit.netAmount = Math.max(0, debit.amount - totalReimbursed);
    } else {
      debit.netAmount = debit.amount;
    }
  }

  return result;
}
