'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shell/Sidebar';
import { Topbar } from '@/components/shell/Topbar';
import { CommandPalette } from '@/components/shell/CommandPalette';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F3] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] selection:bg-accent/20 selection:text-accent relative transition-colors duration-150">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onCommandPalette={() => setCommandPaletteOpen(true)}
      />
      <main className="main-content bg-ledger-grid/40 dark:bg-[#141513]">
        {children}
      </main>
      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
      )}
    </div>
  );
}
