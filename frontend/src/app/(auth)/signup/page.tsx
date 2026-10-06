'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([
    'crm',
    'sales',
    'inventory',
    'accounting',
  ]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-slug generator when orgName changes
  const handleOrgNameChange = (val: string) => {
    setOrgName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setOrgSlug(slug);
  };

  const toggleAppSelection = (appId: string) => {
    setSelectedApps((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const handleAutofillDemo = () => {
    setOrgName('Nexus Global Technologies');
    setOrgSlug('nexus-global');
    setFullName('Elena Rostova');
    setEmail('elena@nexusglobal.com');
    setPassword('NexusEnterprise2026!');
    setSelectedApps(['crm', 'sales', 'inventory', 'accounting', 'hr', 'projects']);
    setErrorMessage('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!orgName || !email || !password || !fullName) {
      setErrorMessage('Please fill out all required organization and admin fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (selectedApps.length === 0) {
      setErrorMessage('Please select at least one business application to provision.');
      return;
    }

    setIsLoading(true);

    // Simulate multi-tenant workspace provisioning
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Tenant "${orgName}" created! Initializing applications...`);
      setTimeout(() => {
        router.push('/applications');
      }, 700);
    }, 1200);
  };

  const availableApps = [
    { id: 'crm', name: 'CRM', tag: 'Sales' },
    { id: 'sales', name: 'Sales & Orders', tag: 'Commercial' },
    { id: 'inventory', name: 'Inventory', tag: 'Stock' },
    { id: 'accounting', name: 'Accounting', tag: 'Finance' },
    { id: 'hr', name: 'HR & People', tag: 'HR' },
    { id: 'projects', name: 'Projects', tag: 'Ops' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Auth Card */}
      <div className="bg-[#14161C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Glow accent pill */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* Card Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-3 shadow-inner">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h19.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v13.5A1.5 1.5 0 0 0 3.75 21ZM3 6l9 6 9-6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Workspace</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Provision your organization&apos;s isolated Bahi instance in seconds
          </p>
        </div>

        {/* Quick Demo Autofill Pill */}
        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>✨ 1-Click Autofill Demo Organization</span>
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Organization & Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="Acme Global Inc"
                value={orgName}
                onChange={(e) => handleOrgNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900/90 rounded-xl border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Workspace Subdomain
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="acme"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 bg-neutral-900/90 rounded-xl border border-white/10 text-xs text-white placeholder:text-neutral-500 font-mono focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-neutral-500 font-mono pointer-events-none">
                  .bahi.io
                </span>
              </div>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900/90 rounded-xl border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder="marcus@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900/90 rounded-xl border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 8 characters..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-900/90 rounded-xl border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Business Applications Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-300">
                Initial Applications to Provision
              </label>
              <span className="text-[10px] text-accent font-semibold">
                {selectedApps.length} Selected
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableApps.map((app) => {
                const isSelected = selectedApps.includes(app.id);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => toggleAppSelection(app.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-white shadow-2xs'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold leading-tight truncate">{app.name}</span>
                      <span
                        className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
                          isSelected ? 'bg-accent text-white font-bold' : 'bg-neutral-800'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono mt-0.5 block">
                      {app.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-neutral-900 border-white/20 text-accent focus:ring-accent"
              />
              <span className="text-[11px] text-neutral-400 leading-tight">
                I agree to the Bahi Master Services Agreement, Data Isolation Protocol, and Privacy Notice.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent to-[#A83200] text-white text-xs font-bold shadow-lg shadow-accent/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>Provisioning Tenant Instance...</span>
              </>
            ) : (
              <>
                <span>Launch My Organization Workspace</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Already have an existing organization?{' '}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
