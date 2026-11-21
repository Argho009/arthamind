// Deterministic Simulation Engine (Zero LLM Hallucinations in Math)
import { LivingProfile, Goal, WhatIfScenarioInput, WhatIfSimulationResult } from '../types';

export function runWhatIfSimulation(
  profile: LivingProfile,
  goals: Goal[],
  currentCategorySpends: Record<string, number>,
  scenario: WhatIfScenarioInput
): WhatIfSimulationResult {
  // 1. Current Monthly Numbers
  const totalIncome = profile.monthlyBaselineIncome + profile.variableIncomeEstimate;
  const currentFixed = profile.fixedCosts;
  
  // Total discretionary spend from categories
  let totalDiscretionary = 0;
  for (const cat in currentCategorySpends) {
    if (cat !== 'Rent & Housing' && cat !== 'Salary' && cat !== 'Reimbursement') {
      totalDiscretionary += currentCategorySpends[cat];
    }
  }

  const originalSurplus = Math.max(0, totalIncome - currentFixed - totalDiscretionary);

  // 2. Compute Monthly Delta based on Scenario
  let monthlyDelta = 0; // Positive = more savings, Negative = less savings
  let explanation = '';

  switch (scenario.scenarioType) {
    case 'CUT_CATEGORY': {
      const cat = scenario.category || 'Food & Dining';
      const currentSpend = currentCategorySpends[cat] || 12000;
      const pct = (scenario.percentChange || 30) / 100;
      monthlyDelta = Math.round(currentSpend * pct);
      explanation = `Reducing ${cat} by ${Math.round(pct * 100)}% saves ₹${monthlyDelta.toLocaleString('en-IN')}/month.`;
      break;
    }
    case 'RENT_INCREASE': {
      const delta = scenario.amountDelta || (scenario.newAmount ? scenario.newAmount - profile.currentRent : 3500);
      monthlyDelta = -Math.abs(delta);
      explanation = `Rent increase of ₹${Math.abs(delta).toLocaleString('en-IN')}/month reduces free cash flow by the same amount.`;
      break;
    }
    case 'SALARY_CHANGE': {
      const delta = scenario.amountDelta || 15000;
      monthlyDelta = delta;
      explanation = `Income change adds ₹${delta.toLocaleString('en-IN')}/month to your monthly surplus.`;
      break;
    }
    case 'NEW_RECURRING': {
      const cost = scenario.amountDelta || 5000;
      monthlyDelta = -Math.abs(cost);
      explanation = `New recurring commitment of ₹${cost.toLocaleString('en-IN')}/month reduces available monthly savings.`;
      break;
    }
  }

  const newSurplus = Math.max(0, originalSurplus + monthlyDelta);

  // 3. Impact on Emergency Fund
  const efRemaining = Math.max(0, profile.emergencyFundTarget - profile.emergencyFundCurrent);
  const efMonthlyOrig = Math.max(2000, Math.round(originalSurplus * 0.5));
  const efMonthlyNew = Math.max(1000, Math.round(newSurplus * 0.5));

  const origMonths = efMonthlyOrig > 0 ? Math.ceil(efRemaining / efMonthlyOrig) : 99;
  const newMonths = efMonthlyNew > 0 ? Math.ceil(efRemaining / efMonthlyNew) : 99;
  const monthsSaved = origMonths - newMonths;

  const today = new Date();
  const targetDateOrig = addMonths(today, origMonths);
  const targetDateNew = addMonths(today, newMonths);

  // 4. Impact on Goals
  const goalImpacts = goals.map(goal => {
    const rem = Math.max(0, goal.targetAmount - goal.currentAmount);
    const origContrib = goal.monthlyContribution > 0 ? goal.monthlyContribution : 3000;
    // Distribute a share of the monthly delta
    const deltaShare = Math.round(monthlyDelta * 0.3);
    const newContrib = Math.max(500, origContrib + deltaShare);

    const origM = Math.ceil(rem / origContrib);
    const newM = Math.ceil(rem / newContrib);

    return {
      goalTitle: goal.title,
      originalTargetDate: addMonths(today, origM),
      newTargetDate: addMonths(today, newM),
      monthsSavedOrDelayed: origM - newM
    };
  });

  // 5. Impact on Daily Runway
  const runwayDays = Math.round(profile.liquidCashBalance / (Math.max(500, currentFixed / 30)));
  const runwayDelta = monthlyDelta > 0 ? Math.round((monthlyDelta / 30) * 10) : -Math.round((Math.abs(monthlyDelta) / 30) * 8);

  return {
    originalMonthlySurplus: originalSurplus,
    newMonthlySurplus: newSurplus,
    monthlySavingsDelta: monthlyDelta,
    impactOnEmergencyFund: {
      originalMonthsToTarget: origMonths,
      newMonthsToTarget: newMonths,
      monthsSaved,
      targetDateOriginal: targetDateOrig,
      targetDateNew: targetDateNew
    },
    impactOnGoals: goalImpacts,
    runwayImpactDays: runwayDelta,
    explanation
  };
}

function addMonths(date: Date, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
