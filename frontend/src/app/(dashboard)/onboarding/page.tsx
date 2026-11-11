'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Building2,
  Users,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Your Profile', desc: 'Personal details and role', icon: User },
  { id: 2, title: 'Organization', desc: 'Tenant workspace & currency', icon: Building2 },
  { id: 3, title: 'Invite Team', desc: 'Add colleagues & assign roles', icon: Users },
  { id: 4, title: 'First Action', desc: 'Select active starter apps', icon: Rocket },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [profile, setProfile] = useState({
    fullName: 'Elena Rostova',
    jobTitle: 'Founder & Managing Director',
    phone: '+1 (555) 234-8901',
  });

  const [org, setOrg] = useState({
    name: 'Nexus Dynamics',
    slug: 'nexus-dynamics',
    industry: 'Wholesale & Technology Distribution',
    currency: 'USD ($)',
    fiscalYear: 'January - December',
  });

  const [teamInvites, setTeamInvites] = useState([
    { email: 'alex@nexusdynamics.io', role: 'customer_admin' },
    { email: 'sarah@nexusdynamics.io', role: 'customer_user' },
  ]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState('customer_user');

  const [selectedApps, setSelectedApps] = useState<string[]>([
    'crm',
    'sales',
    'inventory',
    'accounting',
  ]);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bahi_onboarding_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setCurrentStep(parsed.step);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.org) setOrg(parsed.org);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveProgress = (nextStep: number) => {
    setCurrentStep(nextStep);
    try {
      localStorage.setItem(
        'bahi_onboarding_progress',
        JSON.stringify({ step: nextStep, profile, org }),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const addTeamMember = () => {
    if (!newInviteEmail) return;
    setTeamInvites([...teamInvites, { email: newInviteEmail, role: newInviteRole }]);
    setNewInviteEmail('');
  };

  const removeTeamMember = (index: number) => {
    setTeamInvites(teamInvites.filter((_, idx) => idx !== index));
  };

  const toggleApp = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    localStorage.removeItem('bahi_onboarding_progress');
    router.push('/dashboard');
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Wizard Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
              Step {currentStep} of 4
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-ink dark:text-white mt-0.5">
              Welcome to Bahi, {profile.fullName.split(' ')[0]}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs text-neutral-400 hover:text-ink dark:hover:text-white underline cursor-pointer"
          >
            Skip setup wizard
          </button>
        </div>

        {/* Step pills */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => isCompleted && setCurrentStep(s.id)}
                className={`p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-white dark:bg-[#14161C] border-accent shadow-sm'
                    : isCompleted
                      ? 'bg-neutral-100 dark:bg-white/5 border-transparent cursor-pointer'
                      : 'bg-neutral-50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-accent text-white'
                          : 'bg-neutral-200 dark:bg-white/10 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-ink dark:text-white hidden sm:inline">
                    {s.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-8">
        {/* STEP 1: Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-black/5 dark:border-white/5 pb-4">
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Your Profile</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Tell your team who you are and what role you play in the organization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Job Title</label>
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase">Mobile Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => saveProgress(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 cursor-pointer"
              >
                <span>Continue to Organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Organization Workspace */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-black/5 dark:border-white/5 pb-4">
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Workspace Configuration</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Configure your multi-tenant organization parameters, slug, and base operating currency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Organization Name</label>
                <input
                  type="text"
                  value={org.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setOrg({ ...org, name, slug });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Tenant Subdomain Slug</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={org.slug}
                    onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-l-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white font-mono focus:outline-none"
                  />
                  <span className="px-3 py-2.5 rounded-r-xl border border-l-0 border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-white/5 text-xs text-neutral-400 font-mono">
                    .bahi.app
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Base Currency</label>
                <select
                  value={org.currency}
                  onChange={(e) => setOrg({ ...org, currency: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>INR (₹)</option>
                  <option>AED (د.إ)</option>
                  <option>SGD ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Primary Industry</label>
                <select
                  value={org.industry}
                  onChange={(e) => setOrg({ ...org, industry: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  <option>Wholesale & Technology Distribution</option>
                  <option>Professional & Advisory Services</option>
                  <option>Manufacturing & Assemblies</option>
                  <option>Field Service & Maintenance</option>
                  <option>Retail & Multi-Channel Commerce</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs text-neutral-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => saveProgress(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 cursor-pointer"
              >
                <span>Continue to Team Invites</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Invite Team Members */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-black/5 dark:border-white/5 pb-4">
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Invite Team Members</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Collaborate with coworkers. Each invitee will receive an email verification link.
              </p>
            </div>

            {/* Add row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white focus:outline-none"
              />
              <select
                value={newInviteRole}
                onChange={(e) => setNewInviteRole(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-[#1E2029] text-xs text-ink dark:text-white focus:outline-none"
              >
                <option value="customer_admin">Admin (Full Control)</option>
                <option value="customer_user">Member (Staff Operator)</option>
              </select>
              <button
                type="button"
                onClick={addTeamMember}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs shrink-0 cursor-pointer"
              >
                + Add Invite
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 pt-2">
              {teamInvites.map((inv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-xs"
                >
                  <span className="font-medium text-ink dark:text-white">{inv.email}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">
                      {inv.role === 'customer_admin' ? 'Admin' : 'Member'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="text-rose-500 hover:text-rose-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs text-neutral-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => saveProgress(4)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 cursor-pointer"
              >
                <span>Continue to First Key Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: First Key Action / Active Apps */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-black/5 dark:border-white/5 pb-4">
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">
                Select Your Initial Applications
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Choose the ERP and CRM modules you want activated in your workspace navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'crm', title: 'CRM & Pipeline', desc: 'Customer leads, contacts, deals & Kanban' },
                { id: 'sales', title: 'Sales Orders', desc: 'Quotations, price books & invoices' },
                { id: 'inventory', title: 'Inventory & Stock', desc: 'Multi-warehouse stock movements' },
                { id: 'accounting', title: 'Double-Entry Accounting', desc: 'Ledger, P&L & bank feeds' },
                { id: 'hr', title: 'Staff & HR', desc: 'Employee records, attendance & leaves' },
                { id: 'projects', title: 'Projects & Tasks', desc: 'Gantt schedules & timesheet hours' },
              ].map((app) => {
                const isSelected = selectedApps.includes(app.id);
                return (
                  <div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-accent/5 border-accent shadow-xs'
                        : 'bg-neutral-50 dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-accent text-white' : 'border border-neutral-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-ink dark:text-white">{app.title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{app.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs text-neutral-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-lg shadow-accent/20 cursor-pointer hover:opacity-95"
              >
                <span>Launch Enterprise Workspace</span>
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
