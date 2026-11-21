import React, { useState } from 'react';
import { 
  Calculator, Sparkles, ArrowRight, Calendar, 
  TrendingUp, Shield, Clock, HelpCircle, CheckCircle2 
} from 'lucide-react';
import { LivingProfile, Goal, WhatIfScenarioInput, WhatIfSimulationResult } from '../../types';
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
  const [activeScenario, setActiveScenario] = useState<WhatIfScenarioInput>({
    scenarioType: 'CUT_CATEGORY',
    category: 'Food & Dining',
    percentChange: 30
  });

  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult>(() =>
    runWhatIfSimulation(profile, goals, categorySpends, {
      scenarioType: 'CUT_CATEGORY',
      category: 'Food & Dining',
      percentChange: 30
    })
  );

  const presetScenarios: Array<{ label: string; query: string; scenario: WhatIfScenarioInput }> = [
    {
      label: 'Cut Dining Out by 30%',
      query: 'What if I cut dining out by 30%?',
      scenario: { scenarioType: 'CUT_CATEGORY', category: 'Food & Dining', percentChange: 30 }
    },
    {
      label: 'Rent Hike (+₹3,500/mo)',
      query: 'What if my rent goes up by ₹3,500?',
      scenario: { scenarioType: 'RENT_INCREASE', amountDelta: 3500 }
    },
    {
      label: 'Salary Hike (+₹15,000/mo)',
      query: 'What if my salary increases by ₹15,000?',
      scenario: { scenarioType: 'SALARY_CHANGE', amountDelta: 15000 }
    },
    {
      label: 'New Car EMI (₹12,000/mo)',
      query: 'What if I commit to a new car EMI of ₹12,000/mo?',
      scenario: { scenarioType: 'NEW_RECURRING', amountDelta: 12000 }
    }
  ];

  const handleSelectPreset = (preset: typeof presetScenarios[0]) => {
    setQuery(preset.query);
    setActiveScenario(preset.scenario);
    const res = runWhatIfSimulation(profile, goals, categorySpends, preset.scenario);
    setSimulationResult(res);
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse conversational intent
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

    setActiveScenario(parsedScenario);
    const res = runWhatIfSimulation(profile, goals, categorySpends, parsedScenario);
    setSimulationResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Architectural Rigor Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Deterministic Simulator Architecture
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              <strong>The LLM does zero arithmetic.</strong> Natural language input is translated into structured JSON parameters, while our unit-tested deterministic math engine calculates the projections.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Query Box */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <form onSubmit={handleRunSimulation} className="space-y-4">
          <label className="block text-sm font-bold text-white">
            Ask a What-If Scenario in Natural Language:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What if I cut dining out by 30%?"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate</span>
            </button>
          </div>

          {/* Quick preset scenario chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">Quick Test Scenarios:</span>
            {presetScenarios.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Simulation Result Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Surplus Delta */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Monthly Surplus Impact
          </span>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold ${
              simulationResult.monthlySavingsDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {simulationResult.monthlySavingsDelta >= 0 ? '+' : ''}
              ₹{simulationResult.monthlySavingsDelta.toLocaleString('en-IN')}
              <span className="text-xs text-slate-400 font-normal"> / mo</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Original Surplus: <strong className="text-white">₹{simulationResult.originalMonthlySurplus.toLocaleString('en-IN')}</strong><br />
              New Projected: <strong className="text-teal-400">₹{simulationResult.newMonthlySurplus.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Emergency Cushion Timeline */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Emergency Cushion Target
          </span>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white">
              {simulationResult.impactOnEmergencyFund.targetDateNew}
            </div>
            <div className="mt-2 text-xs">
              {simulationResult.impactOnEmergencyFund.monthsSaved > 0 ? (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Reaches target {simulationResult.impactOnEmergencyFund.monthsSaved} months sooner!</span>
                </span>
              ) : simulationResult.impactOnEmergencyFund.monthsSaved < 0 ? (
                <span className="text-rose-400 font-bold flex items-center space-x-1">
                  <span>Delayed by {Math.abs(simulationResult.impactOnEmergencyFund.monthsSaved)} months</span>
                </span>
              ) : (
                <span className="text-slate-400">Timeline remains unchanged</span>
              )}
            </div>
          </div>
        </div>

        {/* Daily Runway Shift */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Daily Runway Shift
          </span>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold ${
              simulationResult.runwayImpactDays >= 0 ? 'text-teal-400' : 'text-rose-400'
            }`}>
              {simulationResult.runwayImpactDays >= 0 ? '+' : ''}
              {simulationResult.runwayImpactDays} Days
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Buffer impact on your safe-to-spend allowance until next salary deposit.
            </p>
          </div>
        </div>
      </div>

      {/* Goal Milestones Projected Adjustments */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3">
          Goal Milestones Under This Scenario
        </h3>

        <div className="space-y-3">
          {simulationResult.impactOnGoals.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{g.goalTitle}</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                  <span>Current Target: <strong className="text-slate-300">{g.originalTargetDate}</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>New Target: <strong className="text-teal-400">{g.newTargetDate}</strong></span>
                </div>
              </div>

              <div className="text-right">
                {g.monthsSavedOrDelayed > 0 ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    +{g.monthsSavedOrDelayed} Mo Faster
                  </span>
                ) : g.monthsSavedOrDelayed < 0 ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    {g.monthsSavedOrDelayed} Mo Delay
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">No Change</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
