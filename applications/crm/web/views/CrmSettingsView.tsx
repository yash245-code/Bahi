'use client';

import { useState, useEffect } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

interface PipelineStageConfig {
  name: string;
  probability: number;
  rottingDays: number;
  color: string;
  stageType: 'OPEN' | 'WON' | 'LOST';
}

interface CustomFieldConfig {
  id: string;
  label: string;
  key: string;
  entity: 'Lead' | 'Deal' | 'Company' | 'Contact';
  type: 'Text' | 'Number' | 'Select' | 'Date' | 'Currency';
  required: boolean;
}

const defaultStages: PipelineStageConfig[] = [
  { name: 'New Leads', probability: 25, rottingDays: 7, color: '#75766E', stageType: 'OPEN' },
  { name: 'Qualified', probability: 50, rottingDays: 10, color: '#2563EB', stageType: 'OPEN' },
  { name: 'Proposal Sent', probability: 70, rottingDays: 10, color: '#D97706', stageType: 'OPEN' },
  { name: 'Negotiation', probability: 85, rottingDays: 7, color: '#A8462F', stageType: 'OPEN' },
  { name: 'Won / Closed', probability: 100, rottingDays: 0, color: '#1F7A4D', stageType: 'WON' },
];

const defaultCustomFields: CustomFieldConfig[] = [
  { id: '1', label: 'Legacy ERP Provider', key: 'legacy_erp', entity: 'Company', type: 'Select', required: false },
  { id: '2', label: 'Annual IT Software Budget', key: 'it_budget', entity: 'Deal', type: 'Currency', required: true },
  { id: '3', label: 'Decision Target Date', key: 'decision_date', entity: 'Deal', type: 'Date', required: false },
  { id: '4', label: 'Current Warehouse Count', key: 'warehouse_count', entity: 'Lead', type: 'Number', required: false },
];

export function CrmSettingsView() {
  const [activeTab, setActiveTab] = useState<'general' | 'display' | 'stages' | 'scoring' | 'fields' | 'webhooks'>('general');
  const [currency, setCurrency] = useState('USD ($)');
  const [fiscalYearStart, setFiscalYearStart] = useState('January');
  const [rottingDefault, setRottingDefault] = useState('7');
  const [stages, setStages] = useState<PipelineStageConfig[]>(defaultStages);
  const [customFields, setCustomFields] = useState<CustomFieldConfig[]>(defaultCustomFields);

  // Scoring settings
  const [routingStrategy, setRoutingStrategy] = useState<'ROUND_ROBIN' | 'LOAD_BASED'>('ROUND_ROBIN');
  const [decayPenalty, setDecayPenalty] = useState(5);
  const [autoSweepDays, setAutoSweepDays] = useState(7);

  // Webhook settings
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourcompany.com/crm-events');
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [whatsAppSync, setWhatsAppSync] = useState(true);

  // Display & Dark Mode
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [currentDensity, setCurrentDensity] = useState<'normal' | 'compact'>('normal');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('bahi-theme') === 'dark';
      setCurrentTheme(isDark ? 'dark' : 'light');
      const savedDensity = (localStorage.getItem('bahi-crm-density') as 'normal' | 'compact') || 'normal';
      setCurrentDensity(savedDensity);

      const handleThemeSync = (e: any) => {
        if (e.detail?.theme) setCurrentTheme(e.detail.theme);
      };
      const handleDensitySync = (e: any) => {
        if (e.detail?.density) setCurrentDensity(e.detail.density);
      };
      window.addEventListener('bahi-theme-change', handleThemeSync);
      window.addEventListener('bahi-crm-density-change', handleDensitySync);
      return () => {
        window.removeEventListener('bahi-theme-change', handleThemeSync);
        window.removeEventListener('bahi-crm-density-change', handleDensitySync);
      };
    }
  }, []);

  const setThemeMode = (mode: 'light' | 'dark') => {
    setCurrentTheme(mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bahi-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bahi-theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('bahi-theme-change', { detail: { theme: mode } }));
    showToast(`Switched theme to ${mode === 'dark' ? '🌙 Dark Mode (Obsidian & Ember)' : '☀️ Light Mode (Paper & Rust)'}`);
  };

  const setDensityMode = (density: 'normal' | 'compact') => {
    setCurrentDensity(density);
    localStorage.setItem('bahi-crm-density', density);
    window.dispatchEvent(new CustomEvent('bahi-crm-density-change', { detail: { density } }));
    showToast(`Display density set to ${density === 'compact' ? 'High-Density Compact' : 'Comfortable'}`);
  };

  // New field modal state
  const [newFieldModalOpen, setNewFieldModalOpen] = useState(false);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldEntity, setFieldEntity] = useState<CustomFieldConfig['entity']>('Deal');
  const [fieldType, setFieldType] = useState<CustomFieldConfig['type']>('Text');
  const [fieldRequired, setFieldRequired] = useState(false);

  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setAnnouncement(msg);
    setTimeout(() => setToastMessage((c) => (c === msg ? null : c)), 3500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Saved general CRM configuration preferences');
  };

  const handleUpdateStage = (idx: number, rotting: number, prob: number) => {
    setStages((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, rottingDays: rotting, probability: prob } : s))
    );
    showToast(`Updated pipeline stage rules`);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel) return;

    const created: CustomFieldConfig = {
      id: Date.now().toString(),
      label: fieldLabel,
      key: fieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      entity: fieldEntity,
      type: fieldType,
      required: fieldRequired,
    };

    setCustomFields((prev) => [...prev, created]);
    setNewFieldModalOpen(false);
    setFieldLabel('');
    showToast(`Registered custom field "${fieldLabel}" on ${fieldEntity}`);
  };

  return (
    <div className="space-y-6">
      <CrmAnnouncer message={announcement} />

      <CrmNav
        onNewDeal={() => setDealModalOpen(true)}
        onNewLead={() => setLeadModalOpen(true)}
        totalPipelineValue={`$272,000`}
        activeDealsCount={11}
      />

      {/* ── Settings Console Header ── */}
      <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            Admin Console
          </span>
          <h2 className="text-xl font-black text-ink dark:text-[#F7F6F3] mt-1">
            CRM System Configuration &amp; Rules
          </h2>
          <p className="text-xs text-ink-muted dark:text-[#A0A29C] mt-0.5">
            Configure appearance, sales stages, routing algorithms, custom data fields, lead decay penalties, and webhook dispatches.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border/80 dark:border-[#2E302A] pt-3 text-xs font-semibold">
          {[
            { id: 'general', label: '⚙️ General & Fiscal' },
            { id: 'display', label: '🎨 Display & Dark Mode' },
            { id: 'stages', label: '📊 Pipelines & Rotting' },
            { id: 'scoring', label: '🎯 Scoring & Rep Routing' },
            { id: 'fields', label: '📝 Custom Schema Fields' },
            { id: 'webhooks', label: '🔌 Webhooks & Integrations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#20211F] text-white dark:bg-white dark:text-[#20211F] shadow-xs'
                  : 'text-ink-muted dark:text-[#A0A29C] hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#252722]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab 1: General & Fiscal ── */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-5 text-xs max-w-2xl">
          <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">General Workspace Preferences</h3>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="currency-select" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Default Currency Display
                </label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
                >
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="EUR (€)">EUR (€) - Eurozone</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                </select>
              </div>
              <div>
                <label htmlFor="fiscal-select" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Fiscal Year Commencement
                </label>
                <select
                  id="fiscal-select"
                  value={fiscalYearStart}
                  onChange={(e) => setFiscalYearStart(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
                >
                  <option value="January">January (Calendar Year)</option>
                  <option value="April">April (UK / India standard)</option>
                  <option value="October">October (US Federal standard)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rotting-default-input" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                Default Rotting Deal Threshold (Days Untouched)
              </label>
              <input
                id="rotting-default-input"
                type="number"
                min="1"
                max="60"
                value={rottingDefault}
                onChange={(e) => setRottingDefault(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] font-mono"
              />
              <span className="text-[11px] text-ink-muted dark:text-[#A0A29C] mt-1 block">
                Deals with no logged activity past this threshold will be flagged as Stalled.
              </span>
            </div>

            <div className="flex justify-end pt-2 border-t border-border dark:border-[#2E302A]">
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab: Display & Dark Mode ── */}
      {activeTab === 'display' && (
        <div className="space-y-6 max-w-4xl text-xs">
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-6">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Display Theme &amp; Color Scheme</h3>
              <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">
                Switch between high-contrast light mode and ergonomic deep obsidian dark mode. You can also toggle anytime using the <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[10px]">T</kbd> key.
              </p>
            </div>

            {/* Theme cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Card */}
              <div
                onClick={() => setThemeMode('light')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  currentTheme === 'light'
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">☀️</span>
                    <div>
                      <h4 className="font-bold text-sm text-ink dark:text-[#F7F6F3]">Paper &amp; Rust (Light)</h4>
                      <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Warm artisan parchment aesthetic</p>
                    </div>
                  </div>
                  {currentTheme === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-white border border-border shadow-xs space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-ink font-semibold">
                    <span>Apex Dynamics ERP</span>
                    <span className="text-accent font-mono font-bold">$52,000</span>
                  </div>
                  <div className="text-ink-muted text-[10px]">Contract Negotiation • 85% Win Prob</div>
                </div>
              </div>

              {/* Dark Card */}
              <div
                onClick={() => setThemeMode('dark')}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                  currentTheme === 'dark'
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <div>
                      <h4 className="font-bold text-sm text-ink dark:text-[#F7F6F3]">Obsidian &amp; Ember (Dark)</h4>
                      <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Deep obsidian background with ember highlights</p>
                    </div>
                  </div>
                  {currentTheme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#1E1F1C] border border-[#2E302A] shadow-xs space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-[#F7F6F3] font-semibold">
                    <span>Apex Dynamics ERP</span>
                    <span className="text-accent font-mono font-bold">$52,000</span>
                  </div>
                  <div className="text-[#A0A29C] text-[10px]">Contract Negotiation • 85% Win Prob</div>
                </div>
              </div>
            </div>

            {/* Density Preferences */}
            <div className="pt-4 border-t border-border dark:border-[#2E302A] space-y-3">
              <div>
                <h4 className="font-bold text-ink dark:text-[#F7F6F3]">Table &amp; Board Information Density</h4>
                <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">
                  Configure row spacing for high-volume sales reps. Toggle quickly anytime with <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[10px]">C</kbd>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDensityMode('normal')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    currentDensity === 'normal'
                      ? 'border-accent bg-accent/5 ring-1 ring-accent text-ink dark:text-[#F7F6F3]'
                      : 'border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-[#A0A29C]'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Comfortable Density</span>
                    {currentDensity === 'normal' && <span className="text-accent">✓ Active</span>}
                  </div>
                  <div className="text-[11px] text-ink-muted dark:text-[#A0A29C] mt-1">
                    Generous line heights and spacious card padding for relaxed executive scanning.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDensityMode('compact')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    currentDensity === 'compact'
                      ? 'border-accent bg-accent/5 ring-1 ring-accent text-ink dark:text-[#F7F6F3]'
                      : 'border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-[#A0A29C]'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>High-Density Compact</span>
                    {currentDensity === 'compact' && <span className="text-accent">✓ Active</span>}
                  </div>
                  <div className="text-[11px] text-ink-muted dark:text-[#A0A29C] mt-1">
                    Condensed rows and tighter chips allowing 40% more leads and deals per viewport.
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Pipelines & Stages ── */}
      {activeTab === 'stages' && (
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border dark:border-[#2E302A]">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Enterprise Pipeline Stage Rules</h3>
              <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Configure probability forecasting weights and rotting velocity days per stage</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] dark:bg-[#141513] border-b border-border dark:border-[#2E302A] text-[11px] font-bold text-ink-muted dark:text-[#A0A29C] uppercase">
                  <th className="p-3">Stage Name</th>
                  <th className="p-3">Win Probability (%)</th>
                  <th className="p-3">Rotting Stagnancy Alert</th>
                  <th className="p-3">Stage Type</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2E302A]">
                {stages.map((stg, idx) => (
                  <tr key={stg.name} className="hover:bg-neutral-50/80 dark:hover:bg-[#252722]">
                    <td className="p-3 font-bold text-ink dark:text-[#F7F6F3] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stg.color }} />
                      <span>{stg.name}</span>
                    </td>
                    <td className="p-3 font-mono text-ink dark:text-[#F7F6F3]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={stg.probability}
                        onChange={(e) => handleUpdateStage(idx, stg.rottingDays, Number(e.target.value))}
                        className="w-16 p-1 border border-border dark:border-[#2E302A] bg-white dark:bg-[#141513] text-ink dark:text-[#F7F6F3] rounded font-mono text-xs"
                      /> %
                    </td>
                    <td className="p-3 font-mono text-ink dark:text-[#F7F6F3]">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={stg.rottingDays}
                        onChange={(e) => handleUpdateStage(idx, Number(e.target.value), stg.probability)}
                        className="w-16 p-1 border border-border dark:border-[#2E302A] bg-white dark:bg-[#141513] text-ink dark:text-[#F7F6F3] rounded font-mono text-xs"
                      /> days
                    </td>
                    <td className="p-3 font-bold">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${stg.stageType === 'WON' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}`}>
                        {stg.stageType}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`Stage rules for "${stg.name}" saved`)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-[#2A2B27] dark:hover:bg-[#343630] text-ink dark:text-[#F7F6F3] cursor-pointer"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 3: Lead Scoring & Routing ── */}
      {activeTab === 'scoring' && (
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-6 text-xs max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Lead Scoring &amp; Intelligent Rep Routing</h3>
            <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Automated assignment strategies and behavioral decay engines</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="routing-strategy" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                Inbound Lead Routing Strategy
              </label>
              <select
                id="routing-strategy"
                value={routingStrategy}
                onChange={(e) => {
                  setRoutingStrategy(e.target.value as any);
                  showToast(`Assignment strategy updated to ${e.target.value}`);
                }}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
              >
                <option value="ROUND_ROBIN">Round Robin (Sequential rotation across active reps)</option>
                <option value="LOAD_BASED">Load-Based Balancing (Directs to rep with fewest open leads)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="decay-input" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Inactivity Decay Penalty (-Pts / 14 Days)
                </label>
                <input
                  id="decay-input"
                  type="number"
                  value={decayPenalty}
                  onChange={(e) => setDecayPenalty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] font-mono"
                />
              </div>
              <div>
                <label htmlFor="sweep-input" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                  Untouched Leads Sweep (Days)
                </label>
                <input
                  id="sweep-input"
                  type="number"
                  value={autoSweepDays}
                  onChange={(e) => setAutoSweepDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-1">
              <span className="font-bold text-ink dark:text-[#F7F6F3]">Active Qualification Scoring Rules:</span>
              <ul className="list-disc list-inside text-ink-muted dark:text-[#A0A29C] space-y-0.5">
                <li>VP / Chief / Director in Job Title: <strong>+25 Points</strong></li>
                <li>Enterprise Company (&gt;500 Employees): <strong>+20 Points</strong></li>
                <li>Product Trial Signup / Interactive Demo: <strong>+30 Points</strong></li>
                <li>Hot Lead Threshold: <strong>≥80 Points</strong></li>
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-border dark:border-[#2E302A]">
              <button
                type="button"
                onClick={() => showToast('Scoring algorithms & routing updated')}
                className="btn-primary text-xs py-2 px-5"
              >
                Update Routing Engine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Custom Fields Manager ── */}
      {activeTab === 'fields' && (
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border dark:border-[#2E302A]">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Custom Schema Fields</h3>
              <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Extend CRM data models with custom metadata inputs</p>
            </div>
            <button
              type="button"
              onClick={() => setNewFieldModalOpen(true)}
              className="btn-primary text-xs py-1.5 px-3"
            >
              + Define Field
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] dark:bg-[#141513] border-b border-border dark:border-[#2E302A] text-[11px] font-bold text-ink-muted dark:text-[#A0A29C] uppercase">
                  <th className="p-3">Field Label</th>
                  <th className="p-3">API Key</th>
                  <th className="p-3">Attached Entity</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Mandatory</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2E302A]">
                {customFields.map((f) => (
                  <tr key={f.id} className="hover:bg-neutral-50/80 dark:hover:bg-[#252722]">
                    <td className="p-3 font-bold text-ink dark:text-[#F7F6F3]">{f.label}</td>
                    <td className="p-3 font-mono text-ink-muted dark:text-[#A0A29C]">{f.key}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {f.entity}
                      </span>
                    </td>
                    <td className="p-3 text-ink-muted dark:text-[#A0A29C]">{f.type}</td>
                    <td className="p-3">
                      {f.required ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Yes (Required)</span>
                      ) : (
                        <span className="text-ink-muted dark:text-[#A0A29C]">Optional</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomFields((prev) => prev.filter((item) => item.id !== f.id));
                          showToast(`Removed field "${f.label}"`);
                        }}
                        className="text-red-700 dark:text-red-400 hover:text-red-900 font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 5: Webhooks & Integrations ── */}
      {activeTab === 'webhooks' && (
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] space-y-5 text-xs max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-[#F7F6F3]">Webhooks &amp; Real-time Event Dispatch</h3>
            <p className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Send domain events to Zapier, Slack, or internal microservices</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="webhook-url-input" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">
                Outbound Webhook HTTPS Endpoint
              </label>
              <input
                id="webhook-url-input"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3] font-mono"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-2">
              <span className="font-bold text-ink dark:text-[#F7F6F3]">Subscribed Domain Events:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span className="text-ink dark:text-[#F7F6F3]">lead.created (Instant alert)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span className="text-ink dark:text-[#F7F6F3]">deal.stage_changed (Movement)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span className="text-ink dark:text-[#F7F6F3]">deal.won (Revenue celebration)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-accent" />
                  <span className="text-ink dark:text-[#F7F6F3]">quote.accepted (E-signature)</span>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] cursor-pointer">
                <div>
                  <span className="font-bold text-ink dark:text-[#F7F6F3] block">Slack Channel Notifications</span>
                  <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Post win announcements and high-value deal alerts to #sales-wins</span>
                </div>
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] cursor-pointer">
                <div>
                  <span className="font-bold text-ink dark:text-[#F7F6F3] block">WhatsApp Business Cloud Sync</span>
                  <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Sync client chat threads into the CRM activity timeline</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsAppSync}
                  onChange={(e) => setWhatsAppSync(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2 border-t border-border dark:border-[#2E302A]">
              <button
                type="button"
                onClick={() => showToast('Dispatched test webhook ping (HTTP 200 OK)')}
                className="btn-secondary text-xs py-2 px-4 mr-2"
              >
                Send Test Ping
              </button>
              <button
                type="button"
                onClick={() => showToast('Saved integration settings')}
                className="btn-primary text-xs py-2 px-5"
              >
                Save Integrations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Define Custom Field Modal ── */}
      {newFieldModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="field-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewFieldModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-md w-full p-6 space-y-4 text-ink dark:text-[#F7F6F3]">
            <h3 id="field-modal-title" className="text-base font-bold text-ink dark:text-[#F7F6F3]">
              Define Custom Schema Field
            </h3>
            <form onSubmit={handleAddCustomField} className="space-y-3 text-xs">
              <div>
                <label htmlFor="field-lbl" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">Field Label *</label>
                <input
                  id="field-lbl"
                  type="text"
                  required
                  placeholder="e.g. Current Cloud Provider"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="field-ent" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">Target Entity</label>
                  <select
                    id="field-ent"
                    value={fieldEntity}
                    onChange={(e) => setFieldEntity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
                  >
                    <option value="Lead">Lead Intake</option>
                    <option value="Deal">Opportunity Deal</option>
                    <option value="Company">Company Account</option>
                    <option value="Contact">Contact</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="field-type" className="font-semibold text-ink dark:text-[#F7F6F3] block mb-1">Field Type</label>
                  <select
                    id="field-type"
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-[#F7F6F3]"
                  >
                    <option value="Text">Short Text</option>
                    <option value="Number">Number</option>
                    <option value="Currency">Currency Amount</option>
                    <option value="Select">Dropdown Select</option>
                    <option value="Date">Date Picker</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldRequired}
                  onChange={(e) => setFieldRequired(e.target.checked)}
                  className="accent-accent"
                />
                <span className="font-semibold text-ink dark:text-[#F7F6F3]">Make field mandatory on record creation</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-[#2E302A]">
                <button
                  type="button"
                  onClick={() => setNewFieldModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border dark:border-[#2E302A] text-ink-muted dark:text-[#A0A29C] hover:bg-neutral-100 dark:hover:bg-[#252722]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526]"
                >
                  Create Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewDealModal
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={() => {}}
      />
      <NewLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        onSubmit={() => {}}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#20211F] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
