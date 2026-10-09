'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppCard {
  id: string;
  name: string;
  route: string;
  accentColor: string;
  icon: React.ReactNode;
}

const APPS: AppCard[] = [
  {
    id: 'crm',
    name: 'CRM',
    route: '/crm',
    accentColor: 'from-emerald-400 to-teal-600',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'sales',
    name: 'Sales',
    route: '/sales',
    accentColor: 'from-blue-400 to-indigo-600',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m0 0v1.5a.75.75 0 0 1-.75.75H2.25m0 0v1.5a.75.75 0 0 0 .75.75H3m18-6v-.75A.75.75 0 0 0 20.25 4.5H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5m0 0v1.5a.75.75 0 0 1 .75.75h.75m0 0v1.5a.75.75 0 0 0-.75.75H19.5M3.75 4.5h16.5M3.75 19.5h16.5M5.25 9h13.5m-13.5 3h13.5m-13.5 3h13.5" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    name: 'Inventory',
    route: '/inventory',
    accentColor: 'from-amber-400 to-orange-600',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    id: 'accounting',
    name: 'Accounting',
    route: '/accounting',
    accentColor: 'from-violet-400 to-purple-600',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: 'hr',
    name: 'HR',
    route: '/hr',
    accentColor: 'from-rose-400 to-pink-600',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    name: 'Projects',
    route: '/projects',
    accentColor: 'from-cyan-400 to-teal-500',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    route: '#', 
    accentColor: 'from-gray-600 to-gray-800', 
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    id: 'play', 
    name: 'Play Store', 
    route: '#', 
    accentColor: 'from-white to-gray-100', 
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="text-blue-500 !text-blue-500">
        <path d="M5 2.5L20 12 5 21.5V2.5z"/>
      </svg>
    )
  },
  { 
    id: 'camera', 
    name: 'Camera', 
    route: '#', 
    accentColor: 'from-slate-700 to-black', 
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ) 
  },
  { 
    id: 'gallery', 
    name: 'Gallery', 
    route: '#', 
    accentColor: 'from-yellow-400 to-orange-500', 
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ) 
  },
  { 
    id: 'browser', 
    name: 'Browser', 
    route: '#', 
    accentColor: 'from-blue-500 to-cyan-500', 
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ) 
  },
  { 
    id: 'calculator', 
    name: 'Calculator', 
    route: '#', 
    accentColor: 'from-teal-500 to-emerald-600', 
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V21m-7.5-5.25h7.5m-7.5-5.25v.008H8.25v-.008zm7.5 0v.008H15.75v-.008zm-7.5-5.25v.008H8.25v-.008zm7.5 0v.008H15.75v-.008zM4.5 4.5h15a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z" />
      </svg>
    ) 
  },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'APPS' | 'WIDGETS'>('APPS');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col font-sans select-none text-white animate-fade-in">
      {/* Android Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-1.5 bg-black/90 backdrop-blur text-white/90 text-[10px] sm:text-[11px] font-medium tracking-wide">
        <div className="flex gap-2.5 items-center">
           <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.71 5.29c-.39-.39-1.02-.39-1.41 0L12 13.59l-8.3-8.3c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.39.39-1.02 0-1.41z"/></svg>
           <span className="opacity-80">Provider</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
          <span className="font-semibold ml-1">{time || '12:00 PM'}</span>
        </div>
      </div>

      {/* Android App Drawer Tabs */}
      <div className="flex items-center justify-between px-6 pt-3 pb-0 border-b border-[#333]">
        <div className="flex items-center gap-8 h-full">
          <button 
            onClick={() => setActiveTab('APPS')}
            className={`text-[13px] font-bold pb-3 border-b-4 transition-colors ${activeTab === 'APPS' ? 'text-cyan-400 border-cyan-400' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
          >
            APPS
          </button>
          <button 
            onClick={() => setActiveTab('WIDGETS')}
            className={`text-[13px] font-bold pb-3 border-b-4 transition-colors ${activeTab === 'WIDGETS' ? 'text-cyan-400 border-cyan-400' : 'text-gray-400 border-transparent hover:text-gray-200'}`}
          >
            WIDGETS
          </button>
        </div>
        
        <button className="flex items-center gap-2 pb-3 group">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
          <span className="text-gray-400 font-bold text-[13px] group-hover:text-white transition-colors">SHOP</span>
        </button>
      </div>

      {/* App Grid Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 hide-scrollbar">
        {activeTab === 'APPS' ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-x-2 sm:gap-x-4 gap-y-8 sm:gap-y-12 w-full max-w-7xl mx-auto">
            {APPS.map((app) => (
              <Link href={app.route} key={app.id} className="flex flex-col items-center gap-2.5 group outline-none">
                <div className={`w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-[18px] bg-gradient-to-br ${app.accentColor} flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-200 ease-out group-active:scale-95 [&>svg]:!text-white [&>svg]:w-8 [&>svg]:h-8`}>
                  {app.icon}
                </div>
                <span className="text-white/90 text-[11px] sm:text-xs text-center w-full truncate px-1 drop-shadow-md font-medium tracking-wide group-hover:text-white transition-colors">
                  {app.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full gap-4 text-gray-500">
            <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <p className="font-medium text-sm">No widgets available yet.</p>
          </div>
        )}
      </div>

      {/* Android Navigation Bar */}
      <div className="w-full h-14 bg-black flex justify-center items-center gap-20 pb-2 pt-1 border-t border-[#222]">
        <Link href="/" className="w-5 h-5 border-l-[3px] border-b-[3px] border-white/60 hover:border-white rotate-45 transition-colors"></Link>
        <Link href="/" className="w-[22px] h-[22px] rounded-full border-[3px] border-white/60 hover:border-white transition-colors"></Link>
        <button className="w-5 h-5 border-[3px] border-white/60 hover:border-white rounded-sm transition-colors"></button>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
