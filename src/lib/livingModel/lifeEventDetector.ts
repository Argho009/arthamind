// Autonomous Life-Event Shift Detector (The Core of the "Living Money Model")
import { LifeEvent, LivingProfile, Transaction } from '../types';

export function detectLifeEvents(
  profile: LivingProfile,
  recentTransactions: Transaction[],
  existingEvents: LifeEvent[] = []
): LifeEvent[] {
  const newEvents: LifeEvent[] = [...existingEvents];

  // 1. Detect Rent Increase or Move
  // Find transactions categorised as Rent / Landlord in last 45 days
  const rentTxns = recentTransactions.filter(
    t => (t.category === 'Rent & Housing' || /landlord|suresh|rent/i.test(t.cleanPayee)) && t.type === 'debit'
  );

  if (rentTxns.length > 0) {
    const latestRentTx = rentTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const diff = latestRentTx.amount - profile.currentRent;

    // If rent shifted by >= ₹1,000 and event not already present
    if (diff > 500 && !newEvents.some(e => e.eventType === 'RENT_INCREASE' && e.status === 'PENDING_CONFIRMATION')) {
      newEvents.push({
        id: `event_rent_${Date.now()}`,
        userId: profile.userId,
        eventType: 'RENT_INCREASE',
        description: `Rent payment to ${latestRentTx.cleanPayee} shifted from ₹${profile.currentRent.toLocaleString('en-IN')} to ₹${latestRentTx.amount.toLocaleString('en-IN')} (+₹${diff.toLocaleString('en-IN')}/mo)`,
        detectedValue: latestRentTx.amount,
        previousValue: profile.currentRent,
        status: 'PENDING_CONFIRMATION',
        detectedAt: new Date().toISOString()
      });
    }
  }

  // 2. Detect Salary Increment / Job Switch
  const salaryTxns = recentTransactions.filter(
    t => (t.category === 'Salary' || /salary|payroll|technologies/i.test(t.cleanPayee)) && t.type === 'credit'
  );

  if (salaryTxns.length > 0) {
    const latestSalary = salaryTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const diff = latestSalary.amount - profile.monthlyBaselineIncome;

    if (diff >= 5000 && !newEvents.some(e => e.eventType === 'SALARY_INCREMENT' && e.status === 'PENDING_CONFIRMATION')) {
      newEvents.push({
        id: `event_sal_${Date.now()}`,
        userId: profile.userId,
        eventType: 'SALARY_INCREMENT',
        description: `New monthly salary credit of ₹${latestSalary.amount.toLocaleString('en-IN')} detected from ${latestSalary.cleanPayee} (+₹${diff.toLocaleString('en-IN')}/mo increment)`,
        detectedValue: latestSalary.amount,
        previousValue: profile.monthlyBaselineIncome,
        status: 'PENDING_CONFIRMATION',
        detectedAt: new Date().toISOString()
      });
    }
  }

  return newEvents;
}
