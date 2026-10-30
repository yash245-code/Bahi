'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  category: 'Service Contract' | 'NDA' | 'Vendor Agreement' | 'Employment';
  counterparty: string;
  signedDate: string;
  status: 'Signed' | 'Pending Signature' | 'Draft';
}

const initialDocs: DocumentItem[] = [
  { id: 'DOC-501', title: 'Master Services Agreement (MSA)', category: 'Service Contract', counterparty: 'Apex Logistics Hub', signedDate: 'Oct 20, 2026', status: 'Signed' },
  { id: 'DOC-502', title: 'Mutual Non-Disclosure Agreement', category: 'NDA', counterparty: 'Green Garden Cafe', signedDate: 'Oct 18, 2026', status: 'Signed' },
  { id: 'DOC-503', title: 'Warehouse Logistics Service Level Agreement', category: 'Vendor Agreement', counterparty: 'Nordic Warehouses', signedDate: 'Pending', status: 'Pending Signature' },
  { id: 'DOC-504', title: 'Senior Field Technician Employment Contract', category: 'Employment', counterparty: 'Carlos Mendez', signedDate: 'Sep 15, 2026', status: 'Signed' },
];

export default function DocumentsPage() {
  const [docs] = useState<DocumentItem[]>(initialDocs);
  const [search, setSearch] = useState('');

  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.counterparty.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 font-mono">
              Documents &amp; Signatures
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Documents &amp; Signatures
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Store contracts and forms, send them to clients to sign online, and keep everything safe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Total Documents</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">4</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Stored safely</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Signed Documents</span>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">3</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Fully signed and saved</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Awaiting Signature</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">1</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Waiting on client</p>
        </div>
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">Legal Signatures</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">Legally Valid</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Accepted everywhere</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search contract or signatory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Client or Signer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Signed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1]">{d.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{d.title}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{d.category}</td>
                  <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-medium">{d.counterparty}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'Signed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-ink-muted dark:text-neutral-400 font-mono">
                    {d.signedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
