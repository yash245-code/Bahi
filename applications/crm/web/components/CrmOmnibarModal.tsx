'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import { crmApi } from '../lib/api-client';

export interface SearchResultItem {
  id: string;
  type: 'deal' | 'lead' | 'company' | 'contact' | 'activity' | 'quote';
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}

const mockIndex: SearchResultItem[] = [
  { id: '1', type: 'deal', title: 'TechStart Enterprise OS', subtitle: 'TechStart Inc. • $3,200 • 25% Probability', badge: 'New Leads', href: '/crm' },
  { id: '2', type: 'deal', title: 'DataFlow Multi-Warehouse Sync', subtitle: 'DataFlow Corp • $5,400 • Rotting 8 days', badge: 'New Leads', href: '/crm' },
  { id: '3', type: 'deal', title: 'NexGen Cloud ERP Suite', subtitle: 'NexGen Systems • $15,000 • 50% Probability', badge: 'Qualified', href: '/crm' },
  { id: '4', type: 'deal', title: 'Summit Digital Operations OS', subtitle: 'Summit Digital • $22,000 • 70% Probability', badge: 'Proposal Sent', href: '/crm' },
  { id: '5', type: 'deal', title: 'Vortex Global Accounting', subtitle: 'Vortex Global • $34,000 • 85% Probability', badge: 'Negotiation', href: '/crm' },
  { id: '6', type: 'deal', title: 'Apex Dynamics Annual ERP', subtitle: 'Apex Dynamics • $52,000 • Won', badge: 'Won / Closed', href: '/crm' },
  { id: '7', type: 'lead', title: 'Sarah Chen', subtitle: 'Head of Supply Chain • Summit Retail Corp • Score: 92 (HOT)', badge: 'Qualified Lead', href: '/crm/leads' },
  { id: '8', type: 'lead', title: 'Marcus Vance', subtitle: 'VP of Technology • DataFlow Systems • Score: 85 (HOT)', badge: 'Working Lead', href: '/crm/leads' },
  { id: '9', type: 'lead', title: 'Elena Rostova', subtitle: 'Operations Director • Nordic Logistics • Score: 78 (WARM)', badge: 'New Lead', href: '/crm/leads' },
  { id: '10', type: 'company', title: 'TechStart Inc.', subtitle: 'Enterprise Software • $38,200 Volume • 2 Deals', badge: 'Enterprise Account', href: '/crm/companies' },
  { id: '11', type: 'company', title: 'DataFlow Corp', subtitle: 'Logistics • $74,500 Volume • 3 Deals', badge: 'Strategic Account', href: '/crm/companies' },
  { id: '12', type: 'contact', title: 'Marcus Rodriguez', subtitle: 'VP of Global Logistics • DataFlow Corp • marcus@dataflow.com', badge: 'Contact', href: '/crm/contacts' },
  { id: '13', type: 'activity', title: 'Commercial Terms Review with David Chen', subtitle: 'Due Today 2:30 PM • Apex Tech Deal', badge: 'Call', href: '/crm/activities' },
  { id: '14', type: 'quote', title: 'QUO-2026-0819 (Vortex Global)', subtitle: 'Total: $34,000 • Net 30 • Awaiting Signature', badge: 'Sent Quote', href: '/crm/quotes' },
];

interface CrmOmnibarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrmOmnibarModal({ isOpen, onClose }: CrmOmnibarModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>(mockIndex.slice(0, 6));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Reset and auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(mockIndex.slice(0, 6));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Live query search
  useEffect(() => {
    if (!query.trim()) {
      setResults(mockIndex.slice(0, 6));
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const liveData = await crmApi.search.query(query, 10);
        if (liveData && liveData.length > 0) {
          const mapped: SearchResultItem[] = liveData.map((item: any) => ({
            id: item.id,
            type: item.type?.toLowerCase() || 'deal',
            title: item.title,
            subtitle: item.subtitle || item.description || '',
            badge: item.badge || item.status,
            href: item.href || (item.type === 'LEAD' ? '/crm/leads' : item.type === 'COMPANY' ? '/crm/companies' : item.type === 'CONTACT' ? '/crm/contacts' : item.type === 'ACTIVITY' ? '/crm/activities' : '/crm'),
          }));
          setResults(mapped);
          setSelectedIndex(0);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to local filter
      }

      const q = query.toLowerCase();
      const filtered = mockIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
      );
      setResults(filtered);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        router.push(results[selectedIndex].href);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return '💰';
      case 'lead':
        return '🎯';
      case 'company':
        return '🏢';
      case 'contact':
        return '👤';
      case 'activity':
        return '📅';
      case 'quote':
        return '📄';
      default:
        return '🔍';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="omnibar-search-label"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-2xl w-full overflow-hidden text-ink dark:text-neutral-100">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-border dark:border-[#2E302A] px-4 py-3 bg-[#FAF9F5] dark:bg-[#141513]">
          <svg
            className="w-5 h-5 text-ink-muted mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={inputRef}
            id="omnibar-search-label"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={results[selectedIndex] ? `result-${results[selectedIndex].id}` : undefined}
            placeholder="Search deals, leads, accounts, contacts, or activities... (Use ↑↓ to navigate)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-ink dark:text-white placeholder:text-ink-muted/60 dark:placeholder:text-[#A0A29C]/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="text-xs text-ink-muted hover:text-ink dark:hover:text-white px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-[10px] font-semibold text-ink-muted dark:text-[#A0A29C] bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2E302A] px-1.5 py-0.5 rounded shadow-2xs ml-2">
            ESC to close
          </kbd>
        </div>

        {/* Results Listbox */}
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-border/20 dark:divide-[#2E302A]"
        >
          {isLoading ? (
            <div className="py-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              Searching across all records...
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center space-y-1">
              <p className="text-xs font-semibold text-ink dark:text-white">No results found</p>
              <p className="text-[11px] text-ink-muted">
                Try searching by deal title, customer email, or company name.
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  id={`result-${item.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent/15 border border-accent/40 text-ink dark:text-white' : 'hover:bg-neutral-50 dark:hover:bg-[#141513] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base select-none shrink-0" aria-hidden="true">
                      {getTypeIcon(item.type)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-white dark:bg-[#141513] border border-border dark:border-[#2E302A] text-ink-muted dark:text-[#A0A29C]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-accent shrink-0 ml-3 uppercase tracking-wider">
                    {item.type} →
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Guidance */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#FAF9F5] dark:bg-[#141513] border-t border-border dark:border-[#2E302A] text-[11px] text-ink-muted dark:text-[#A0A29C]">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono font-bold bg-white dark:bg-[#1E1F1C] text-ink dark:text-white px-1.5 py-0.5 rounded border border-border dark:border-[#2E302A]">↑</kbd> <kbd className="font-mono font-bold bg-white dark:bg-[#1E1F1C] text-ink dark:text-white px-1.5 py-0.5 rounded border border-border dark:border-[#2E302A]">↓</kbd> Navigate</span>
            <span><kbd className="font-mono font-bold bg-white dark:bg-[#1E1F1C] text-ink dark:text-white px-1.5 py-0.5 rounded border border-border dark:border-[#2E302A]">↵</kbd> Open Record</span>
          </div>
          <span className="font-medium text-ink dark:text-neutral-300">Bahi Omnibar v1.5</span>
        </div>
      </div>
    </div>
  );
}
