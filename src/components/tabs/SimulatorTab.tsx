import React, { useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
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
      {/* Simulation Input Console */}
      <section 
        aria-labelledby="sim-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <div className="flex items-center space-x-2 text-xs text-[#8b949e] uppercase tracking-[0.08em] font-semibold mb-1">
          <Calculator className="w-3.5 h-3.5 stroke-[1.5]" />
          <span id="sim-heading">Deterministic What-If Simulator</span>
        </div>
        <p className="text-xs text-[#8b949e] mb-4">
          Natural language queries are parsed into parameters; timeline calculations are computed deterministically.
        </p>

        <form onSubmit={handleRunSimulation} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[44px] bg-[#090d14] border border-[#1a2333] rounded-lg px-4 py-2 text-xs text-[#f0f6fc] placeholder:text-[#626c79] focus:outline-none focus:border-[#2ea043] focus:ring-1 focus:ring-[#2ea043] font-mono"
              placeholder="e.g. What if I cut dining out by 30%?"
            />
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-lg bg-[#141d2e] hover:bg-[#1a263c] text-[#f0f6fc] font-medium text-xs border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70"
            >
              Simulate
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#626c79]">Quick Scenarios:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-2.5 py-1.5 rounded-md text-[11px] bg-[#141d2e] hover:bg-[#1a263c] text-[#8b949e] hover:text-[#f0f6fc] border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Primary Mathematical Projections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Monthly Cashflow Delta</span>
          <div className={`text-2xl font-bold mt-2 font-mono tabular-nums ${
            simulationResult.monthlySavingsDelta >= 0 ? 'text-[#2ea043]' : 'text-rose-400'
          }`}>
            {simulationResult.monthlySavingsDelta >= 0 ? '+' : ''}
            ₹{simulationResult.monthlySavingsDelta.toLocaleString('en-IN')}
            <span className="text-xs text-[#8b949e] font-sans font-normal"> / mo</span>
          </div>
          <div className="text-[11px] text-[#626c79] mt-1 font-mono tabular-nums">
            Adjusted surplus: ₹{simulationResult.newMonthlySurplus.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Emergency Reserve Date</span>
          <div className="text-2xl font-bold text-[#f0f6fc] mt-2 font-mono tabular-nums">
            {simulationResult.impactOnEmergencyFund.targetDateNew}
          </div>
          <div className="text-[11px] text-[#8b949e] mt-1">
            {simulationResult.impactOnEmergencyFund.monthsSaved > 0
              ? `${simulationResult.impactOnEmergencyFund.monthsSaved} months faster`
              : 'Timeline steady'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e1420] border border-[#1a2333]">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e]">Runway Impact</span>
          <div className="text-2xl font-bold text-[#f0f6fc] mt-2 font-mono tabular-nums">
            {simulationResult.runwayImpactDays >= 0 ? '+' : ''}
            {simulationResult.runwayImpactDays} Days
          </div>
          <div className="text-[11px] text-[#626c79] mt-1">Daily liquidity buffer</div>
        </div>
      </div>

      {/* Goal Timeline Shifts */}
      <section 
        aria-labelledby="goal-shifts-heading"
        className="p-6 rounded-xl bg-[#0e1420] border border-[#1a2333]"
      >
        <h3 id="goal-shifts-heading" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8b949e] mb-3">
          Goal Timeline Re-calculations
        </h3>

        <div className="space-y-2 text-xs">
          {simulationResult.impactOnGoals.map((g: { goalTitle: string; originalTargetDate: string; newTargetDate: string; monthsSavedOrDelayed: number }, idx: number) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#141d2e] border border-[#232f44] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#f0f6fc]">{g.goalTitle}</span>
                <div className="flex items-center space-x-2 text-[11px] text-[#626c79] mt-1 font-mono tabular-nums">
                  <span>Current: {g.originalTargetDate}</span>
                  <ArrowRight className="w-3 h-3 text-[#626c79]" />
                  <span className="text-[#f0f6fc]">Projected: {g.newTargetDate}</span>
                </div>
              </div>

              {g.monthsSavedOrDelayed !== 0 && (
                <span className="text-[11px] font-mono text-[#f0f6fc] bg-[#0e1420] px-2.5 py-1 rounded border border-[#232f44] tabular-nums">
                  {g.monthsSavedOrDelayed > 0 ? `-${g.monthsSavedOrDelayed} mo` : `+${Math.abs(g.monthsSavedOrDelayed)} mo`}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
