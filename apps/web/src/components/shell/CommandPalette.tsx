'use client';

import { useState, useEffect, useRef } from 'react';

const commands = [
  { category: 'Navigation', items: [
    { label: 'Go to Dashboard', shortcut: '', action: '/dashboard' },
    { label: 'Go to CRM', shortcut: '', action: '/crm' },
    { label: 'Go to Sales', shortcut: '', action: '/sales' },
    { label: 'Go to Inventory', shortcut: '', action: '/inventory' },
    { label: 'Go to Accounting', shortcut: '', action: '/accounting' },
    { label: 'Go to HR', shortcut: '', action: '/hr' },
    { label: 'Go to Projects', shortcut: '', action: '/projects' },
    { label: 'Go to Settings', shortcut: '', action: '/settings' },
  ]},
  { category: 'Quick Actions', items: [
    { label: 'Create new Lead', shortcut: 'L', action: '#new-lead' },
    { label: 'Create new Quotation', shortcut: 'Q', action: '#new-quote' },
    { label: 'Create new Invoice', shortcut: 'I', action: '#new-invoice' },
    { label: 'Create new Contact', shortcut: 'C', action: '#new-contact' },
    { label: 'Create new Project', shortcut: 'P', action: '#new-project' },
  ]},
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const allItems = filteredCommands.flatMap((g) => g.items);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, allItems.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && allItems[activeIndex]) {
        const item = allItems[activeIndex];
        if (item.action.startsWith('/')) window.location.href = item.action;
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeIndex, allItems]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  let flatIndex = -1;

  return (
    <div className="command-overlay" onClick={onClose}>
      <div className="command-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 border-b border-border">
          <svg className="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="command-input border-0 py-3.5"
            placeholder="Search commands, records, actions..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.map((group) => (
            <div key={group.category}>
              <div className="px-5 py-2">
                <span className="text-[10px] uppercase font-semibold text-ink-muted tracking-widest">
                  {group.category}
                </span>
              </div>
              {group.items.map((item) => {
                flatIndex++;
                const isCurrent = flatIndex === activeIndex;
                return (
                  <div
                    key={item.label}
                    className={`command-item ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      if (item.action.startsWith('/')) {
                        window.location.href = item.action;
                      }
                      onClose();
                    }}
                  >
                    <span className="flex-1 text-ink">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="text-[10px] font-mono bg-[#F7F6F3] text-ink-muted px-1.5 py-0.5 rounded border border-border">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-ink-muted">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-border text-[11px] text-ink-muted bg-[#FAF9F6]">
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white text-ink-muted border border-border px-1.5 py-0.5 rounded shadow-xs">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white text-ink-muted border border-border px-1.5 py-0.5 rounded shadow-xs">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white text-ink-muted border border-border px-1.5 py-0.5 rounded shadow-xs">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
