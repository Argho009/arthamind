import React from 'react';
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
    <aside 
      aria-label="Recurring change notification"
      className="border-b border-[#1a2333] bg-[#0e1420] px-4 py-3"
    >
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
          <div>
            <span className="font-semibold text-[#f0f6fc]">Recurring shift detected: </span>
            <span className="text-[#8b949e]">{currentEvent.description}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onResolve(currentEvent.id, true)}
            className="min-h-[36px] px-3 py-1.5 rounded-md bg-[#141d2e] hover:bg-[#1a263c] text-[#f0f6fc] text-xs font-medium border border-[#232f44] transition-transform duration-150 ease-taste active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1420]"
          >
            Update baseline profile
          </button>
          <button
            type="button"
            onClick={() => onResolve(currentEvent.id, false)}
            className="min-h-[36px] px-2.5 py-1.5 rounded-md text-[#8b949e] hover:text-[#f0f6fc] text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1420]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </aside>
  );
};
