'use client';

import { useState, useEffect } from 'react';

export function CrmThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));

    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    window.addEventListener('bahi-theme-change', handleThemeChange);
    return () => window.removeEventListener('bahi-theme-change', handleThemeChange);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('bahi-theme', 'dark');
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('bahi-theme', 'light');
      } catch (_) {}
    }
    window.dispatchEvent(new Event('bahi-theme-change'));
  };

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-lg border border-border bg-neutral-100/40 dark:bg-neutral-800/40 ${className}`} />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`p-2 rounded-lg border border-border text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {isDark ? (
        <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}
