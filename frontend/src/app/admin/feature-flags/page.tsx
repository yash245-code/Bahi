'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getFeatureFlags, saveFeatureFlags, FeatureFlag } from '@/lib/cms-store';

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(getFeatureFlags());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleFlag = (key: string) => {
    const updated = flags.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f));
    setFlags(updated);
    saveFeatureFlags(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePercentageChange = (key: string, val: number) => {
    const updated = flags.map((f) => (f.key === key ? { ...f, rolloutPercentage: val } : f));
    setFlags(updated);
    saveFeatureFlags(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-bold">
          Progressive Rollouts
        </span>
        <h1 className="font-serif text-3xl font-black text-white mt-1">
          Feature Flags & Beta Management
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Feature flag toggles compiled and published to edge CDN cache!</span>
        </div>
      )}

      <div className="space-y-4">
        {flags.map((flag) => (
          <div
            key={flag.key}
            className="rounded-3xl p-6 bg-[#11131A] border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-rose-400 font-bold">{flag.key}</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Target Plans: {flag.targetPlans.join(', ')}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white">{flag.name}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">{flag.description}</p>
            </div>

            <div className="flex items-center gap-8 shrink-0">
              {/* Rollout percentage slider */}
              <div className="space-y-1 w-36">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">Rollout</span>
                  <span className="text-white font-bold">{flag.rolloutPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={flag.rolloutPercentage}
                  onChange={(e) => handlePercentageChange(flag.key, Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Master toggle */}
              <button
                type="button"
                onClick={() => toggleFlag(flag.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  flag.enabled
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-neutral-400 border border-white/10'
                }`}
              >
                <span>{flag.enabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
