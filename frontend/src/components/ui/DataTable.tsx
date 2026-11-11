'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterComponent?: React.ReactNode;
  actionsComponent?: React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
  exportFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFilter,
  filterComponent,
  actionsComponent,
  emptyMessage = 'No matching records found.',
  pageSize = 10,
  exportFilename = 'export.csv',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, query));
    }
    const lower = query.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(lower),
      ),
    );
  }, [data, query, searchFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const compare = aVal < bVal ? -1 : 1;
      return sortOrder === 'asc' ? compare : -compare;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCsv = () => {
    if (!sortedData.length) return;
    const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(','),
    );
    const csvContent = [headerRow, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Controls Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] text-ink dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {filterComponent}
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            Export CSV
          </button>
          {actionsComponent}
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] shadow-sm">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-neutral-50/70 dark:bg-white/[0.02] text-neutral-500 dark:text-neutral-400 font-semibold uppercase text-[11px] tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3.5 px-4 ${col.sortable ? 'cursor-pointer select-none hover:text-ink dark:hover:text-white' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-accent" /> : <ChevronDown className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-ink dark:text-neutral-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3.5 px-4 align-middle ${col.className || ''}`}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-neutral-400">
                  <p className="text-sm">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium text-neutral-700 dark:text-neutral-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

