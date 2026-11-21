import React from 'react';
import { AlertCircle, Check, X, ArrowRight, Zap } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-b border-amber-500/40 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Living Money Model: Autonomous Event Detected
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">
              {currentEvent.description}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Detected from recent transaction trends. Would you like ArthaMind to update your baseline fixed costs and recalibrate your emergency fund?
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-center">
          <button
            onClick={() => onResolve(currentEvent.id, true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept & Update Profile</span>
          </button>
          <button
            onClick={() => onResolve(currentEvent.id, false)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};
