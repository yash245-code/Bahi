'use client';

import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { DiscountRule } from './salesData';

interface NewDiscountRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRule: (rule: DiscountRule) => void;
}

export function NewDiscountRuleModal({
  isOpen,
  onClose,
  onAddRule,
}: NewDiscountRuleModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<DiscountRule['type']>('Volume Discount');
  const [discountRate, setDiscountRate] = useState('15%');
  const [minUnits, setMinUnits] = useState(5);
  const [targetCategory, setTargetCategory] = useState('Hardware & Devices');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRule: DiscountRule = {
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      type,
      discountRate: discountRate.trim(),
      minUnits,
      targetCategory,
      isActive: true,
      effectiveUntil: 'Dec 31, 2026',
      usageCount: 0,
      description: description.trim() || 'Custom pricing policy approved for commercial operations.',
    };

    onAddRule(newRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/25">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                New Discount Policy Rule
              </h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Define governance discount rule and wholesale price break tiers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
              Rule Title <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Tier Bulk Discount (20+ Units)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
                Rule Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DiscountRule['type'])}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              >
                <option value="Volume Discount">Volume Discount</option>
                <option value="Partner Tier">Partner Tier</option>
                <option value="Promotional">Promotional</option>
                <option value="Margin Floor">Margin Floor</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
                Discount Rate / Cap
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 15% or Max 25%"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
                Min Volume Units
              </label>
              <input
                type="number"
                min="1"
                value={minUnits}
                onChange={(e) => setMinUnits(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
                Target Category
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
              >
                <option value="All Product Lines">All Product Lines</option>
                <option value="Hardware & Devices">Hardware &amp; Devices</option>
                <option value="Cloud ERP Licenses">Cloud ERP Licenses</option>
                <option value="Services & Support">Services &amp; Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink dark:text-neutral-200 mb-1">
              Policy Description &amp; Qualification
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Applied automatically to quotes with 20 or more hardware units."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Save Rule Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
