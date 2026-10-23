'use client';

import { useEffect, useRef } from 'react';

interface CrmShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Cmd/Ctrl + K', description: 'Open Global Omnibar Search' },
  { key: '?', description: 'Show this keyboard shortcuts guide' },
  { key: 'D', description: 'Quick-open New Deal Modal' },
  { key: 'L', description: 'Quick-open New Lead Modal' },
  { key: 'N', description: 'Quick-log Call, Meeting, or Activity Note' },
  { key: 'T', description: 'Toggle Dark / Light Mode' },
  { key: 'C', description: 'Toggle Table Density (Compact / Normal)' },
  { key: '1 – 7', description: 'Jump to CRM Tab (1: Deals, 2: Leads, 3: Companies, 4: Contacts, 5: Activities, 6: Quotes, 7: Forecast)' },
  { key: '→ / ←', description: 'On focused deal card: Advance or move back one stage' },
  { key: 'W', description: 'On focused deal card: Mark Won' },
  { key: 'X', description: 'On focused deal card: Mark Lost' },
  { key: 'Esc', description: 'Close any active modal or search bar' },
  { key: 'Tab / Shift+Tab', description: 'Accessible focus traversal through controls' },
];

export function CrmShortcutsModal({ isOpen, onClose }: CrmShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-lg w-full p-6 space-y-4 text-ink dark:text-neutral-100 focus:outline-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2E302A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 id="shortcuts-dialog-title" className="text-base font-bold text-ink dark:text-white">
              CRM Keyboard Shortcuts &amp; Accessibility
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            className="text-ink-muted hover:text-ink dark:hover:text-white text-sm p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-accent focus:outline-hidden cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-ink-muted">
          Speed up your sales workflow with quick key combinations. Designed for power reps and WCAG keyboard-only navigation.
        </p>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#141513] border border-border/60 dark:border-[#2E302A] text-xs"
            >
              <span className="text-ink dark:text-neutral-200 font-medium">{sc.description}</span>
              <kbd className="font-mono font-bold text-[11px] bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] px-2 py-0.5 rounded shadow-2xs text-ink dark:text-neutral-100">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border dark:border-[#2E302A] text-[11px] text-ink-muted dark:text-[#A0A29C]">
          <span>Press <kbd className="font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-ink dark:text-neutral-200 px-1 py-0.5 rounded border border-border dark:border-[#2E302A]">Esc</kbd> anytime to exit</span>
          <button
            onClick={onClose}
            className="btn-secondary text-xs py-1.5 px-4 focus-visible:ring-2 focus-visible:ring-accent"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
