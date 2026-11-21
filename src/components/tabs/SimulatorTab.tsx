import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LivingProfile, Goal, WhatIfScenarioInput, WhatIfSimulationResult } from '../../lib/types';
import { runWhatIfSimulation } from '../../lib/simulator/deterministicEngine';

interface SimulatorTabProps {
  profile: LivingProfile;
  goals: Goal[];
  categorySpends: Record<string, number>;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  profile,
  goals,
  categorySpends
}) => {
  const [query, setQuery] = useState('What if I cut dining out by 30%?');
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult>(() =>
    runWhatIfSimulation(profile, goals, categorySpends, {
      scenarioType: 'CUT_CATEGORY',
      category: 'Food & Dining',
      percentChange: 30
    })
  );

  const presets = [
    { label: 'Cut dining 30%', q: 'What if I cut dining out by 30%?', scenario: { scenarioType: 'CUT_CATEGORY' as const, category: 'Food & Dining', percentChange: 30 } },
    { label: 'Rent increase (+₹3,500)', q: 'What if rent increases by ₹3,500?', scenario: { scenarioType: 'RENT_INCREASE' as const, amountDelta: 3500 } },
    { label: 'Salary hike (+₹15,000)', q: 'What if my salary increases by ₹15,000?', scenario: { scenarioType: 'SALARY_CHANGE' as const, amountDelta: 15000 } },
    { label: 'Car EMI (₹12,000)', q: 'What if I take a new car EMI of ₹12,000?', scenario: { scenarioType: 'NEW_RECURRING' as const, amountDelta: 12000 } }
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setQuery(p.q);
    const res = runWhatIfSimulation(profile, goals, categorySpends, p.scenario);
    setSimulationResult(res);
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedScenario: WhatIfScenarioInput = {
      scenarioType: 'CUT_CATEGORY',
      category: 'Food & Dining',
      percentChange: 30
    };

    if (/rent|landlord/i.test(query)) {
      const match = query.match(/(\d+[\d,]*)/);
      const amt = match ? parseFloat(match[1].replace(/,/g, '')) : 3500;
      parsedScenario = { scenarioType: 'RENT_INCREASE', amountDelta: amt };
    } else if (/salary|hike|increment/i.test(query)) {
      const match = query.match(/(\d+[\d,]*)/);
      const amt = match ? parseFloat(match[1].replace(/,/g, '')) : 15000;
      parsedScenario = { scenarioType: 'SALARY_CHANGE', amountDelta: amt };
    } else if (/emi|loan|car/i.test(query)) {
      const match = query.match(/(\d+[\d,]*)/);
      const amt = match ? parseFloat(match[1].replace(/,/g, '')) : 10000;
      parsedScenario = { scenarioType: 'NEW_RECURRING', amountDelta: amt };
    } else {
      const match = query.match(/(\d+)%/);
      const pct = match ? parseInt(match[1], 10) : 30;
      parsedScenario = { scenarioType: 'CUT_CATEGORY', category: 'Food & Dining', percentChange: pct };
    }

    const res = runWhatIfSimulation(profile, goals, categorySpends, parsedScenario);
    setSimulationResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">
          Scenario planner
        </h2>
        <p className="text-xs text-slate-400 mb-3.5">
          Model cash flow shifts and evaluate the effect on your savings and timeline.
        </p>

        <form onSubmit={handleRunSimulation} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-[#080c14] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
              placeholder="e.g. What if I cut dining out by 30%?"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              Calculate
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-2.5 py-1 rounded text-[11px] bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400">Monthly surplus effect</div>
          <div className={`text-2xl font-semibold mt-1.5 font-mono ${
            simulationResult.monthlySavingsDelta >= 0 ? 'text-slate-100' : 'text-slate-400'
          }`}>
            {simulationResult.monthlySavingsDelta >= 0 ? '+' : ''}
            ₹{simulationResult.monthlySavingsDelta.toLocaleString('en-IN')}
            <span className="text-xs text-slate-500 font-normal"> / mo</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            New surplus: ₹{simulationResult.newMonthlySurplus.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400">Emergency fund date</div>
          <div className="text-2xl font-semibold text-slate-100 mt-1.5 font-mono">
            {simulationResult.impactOnEmergencyFund.targetDateNew}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {simulationResult.impactOnEmergencyFund.monthsSaved > 0
              ? `${simulationResult.impactOnEmergencyFund.monthsSaved} months faster`
              : 'Timeline steady'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400">Runway change</div>
          <div className="text-2xl font-semibold text-slate-100 mt-1.5 font-mono">
            {simulationResult.runwayImpactDays >= 0 ? '+' : ''}
            {simulationResult.runwayImpactDays} days
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cash buffer adjustment</div>
        </div>
      </div>

      {/* Goal Milestones */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-300 mb-3">
          Goal milestones under this scenario
        </h3>

        <div className="space-y-2 text-xs">
          {simulationResult.impactOnGoals.map((g: { goalTitle: string; originalTargetDate: string; newTargetDate: string; monthsSavedOrDelayed: number }, idx: number) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-850/40 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-200">{g.goalTitle}</span>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                  <span>Current: {g.originalTargetDate}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-300">Projected: {g.newTargetDate}</span>
                </div>
              </div>

              {g.monthsSavedOrDelayed !== 0 && (
                <span className="text-[11px] font-mono text-slate-300">
                  {g.monthsSavedOrDelayed > 0 ? `-${g.monthsSavedOrDelayed} mo` : `+${Math.abs(g.monthsSavedOrDelayed)} mo`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
