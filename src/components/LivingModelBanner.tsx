import React from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { LifeEvent } from '../lib/types';

interface LivingModelBannerProps {
  events: LifeEvent[];
  onResolve: (eventId: string, accept: boolean) => void;
}

export const LivingModelBanner: React.FC<LivingModelBannerProps> = ({ events, onResolve }) => {
  const pendingEvents = events.filter(e => e.status === 'PENDING_CONFIRMATION');
  if (pendingEvents.length === 0) return null;

  const currentEvent = pendingEvents[0];

  return (
    <div className="border-b border-slate-800 bg-[#0e1420] px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Recurring change detected: </span>
            <span className="text-slate-300">{currentEvent.description}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={() => onResolve(currentEvent.id, true)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            Update baseline
          </button>
          <button
            onClick={() => onResolve(currentEvent.id, false)}
            className="px-2 py-1 rounded text-slate-400 hover:text-slate-300 text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
