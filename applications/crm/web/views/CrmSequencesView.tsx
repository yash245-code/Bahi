'use client';

import { useState } from 'react';
import { CrmNav } from '../components/CrmNav';
import { CrmAnnouncer } from '../components/CrmAnnouncer';
import { NewDealModal } from '../components/NewDealModal';
import { NewLeadModal } from '../components/NewLeadModal';

export interface SequenceStep {
  day: number;
  type: 'email' | 'call' | 'task' | 'linkedin';
  title: string;
  templateSnippet: string;
}

export interface SequenceRecord {
  id: string;
  name: string;
  targetAudience: string;
  status: 'ACTIVE' | 'PAUSED';
  enrolledCount: number;
  openRate: number;
  replyRate: number;
  meetingsBooked: number;
  steps: SequenceStep[];
}

const initialSequences: SequenceRecord[] = [
  {
    id: 'SEQ-1',
    name: 'Enterprise ERP Inbound Nurture',
    targetAudience: 'Inbound trial signups & VP/C-level leads',
    status: 'ACTIVE',
    enrolledCount: 38,
    openRate: 64.2,
    replyRate: 28.5,
    meetingsBooked: 11,
    steps: [
      { day: 1, type: 'email', title: 'Personalized Intro & Product Whitepaper', templateSnippet: 'Hi {{firstName}}, noticed you explored our multi-warehouse inventory engine...' },
      { day: 3, type: 'task', title: 'LinkedIn Profile Check & Connection', templateSnippet: 'Review company tech stack and connect on LinkedIn.' },
      { day: 5, type: 'email', title: 'Customer ROI Case Study (Apex Dynamics)', templateSnippet: 'See how Apex Dynamics scaled revenue 38% after ERP migration...' },
      { day: 8, type: 'call', title: 'Discovery Phone Touchpoint', templateSnippet: 'Review budget and technical integration requirements.' },
    ],
  },
  {
    id: 'SEQ-2',
    name: 'Stalled Deal Re-engagement Cadence',
    targetAudience: 'Deals untouched for >14 days in Proposal Sent',
    status: 'ACTIVE',
    enrolledCount: 14,
    openRate: 52.0,
    replyRate: 35.7,
    meetingsBooked: 5,
    steps: [
      { day: 1, type: 'email', title: 'Quarterly Executive Pricing Recheck', templateSnippet: 'Hi {{firstName}}, wanted to check if timing has shifted for the operations project...' },
      { day: 4, type: 'call', title: 'Stakeholder Alignment Call', templateSnippet: 'Offer 15% incentive for signature by end of quarter.' },
      { day: 10, type: 'email', title: 'Final Status Check & Project Archive Notice', templateSnippet: 'Should we pause our project file or keep your pricing locked in?' },
    ],
  },
  {
    id: 'SEQ-3',
    name: 'Outbound Cold Prospecting - Logistics Leaders',
    targetAudience: 'Head of Supply Chain & Ops Directors (100-1000 employees)',
    status: 'PAUSED',
    enrolledCount: 65,
    openRate: 41.8,
    replyRate: 14.2,
    meetingsBooked: 6,
    steps: [
      { day: 1, type: 'email', title: 'Supply Chain Friction Point Intro', templateSnippet: 'Are warehouse allocation delays slowing down fulfillment?' },
      { day: 3, type: 'linkedin', title: 'InMail Follow-up with 2-Minute Demo', templateSnippet: 'Share quick dispatch overview video link.' },
      { day: 7, type: 'call', title: 'Quick 5-Minute Introductory Call', templateSnippet: 'Qualify warehouse volume and ERP setup.' },
    ],
  },
];

export interface EnrolledProspect {
  id: string;
  name: string;
  company: string;
  email: string;
  currentStep: number;
  totalSteps: number;
  status: 'In Progress' | 'Replied' | 'Finished' | 'Opted Out';
  enrolledDate: string;
}

const initialEnrolledProspects: Record<string, EnrolledProspect[]> = {
  'SEQ-1': [
    { id: 'ENR-1', name: 'Sarah Chen', company: 'HyperGrowth AI', email: 'sarah.chen@hypergrowth.ai', currentStep: 2, totalSteps: 4, status: 'In Progress', enrolledDate: '2026-10-18' },
    { id: 'ENR-2', name: 'Marcus Vance', company: 'Apex Dynamics', email: 'm.vance@apexdynamics.com', currentStep: 3, totalSteps: 4, status: 'Replied', enrolledDate: '2026-10-14' },
    { id: 'ENR-3', name: 'Elena Rostova', company: 'Vortex Global', email: 'e.rostova@vortex.io', currentStep: 1, totalSteps: 4, status: 'In Progress', enrolledDate: '2026-10-21' },
  ],
  'SEQ-2': [
    { id: 'ENR-4', name: 'David Kim', company: 'Pacific Rim Logistics', email: 'dkim@pacificrim.com', currentStep: 2, totalSteps: 3, status: 'In Progress', enrolledDate: '2026-10-12' },
  ],
  'SEQ-3': [],
};

const availableProspectsToEnroll = [
  { id: 'P-1', name: 'Michael Scott', company: 'Paperless Office Corp', email: 'm.scott@paperless.com' },
  { id: 'P-2', name: 'Carlos Mendoza', company: 'Atlas Retailers', email: 'carlos@atlasretail.com' },
  { id: 'P-3', name: 'Amara Okafor', company: 'FinTech Zenith', email: 'a.okafor@zenithfin.com' },
  { id: 'P-4', name: 'Rachel Green', company: 'Central Perks Logistics', email: 'rachel@perkslogistics.com' },
];

export function CrmSequencesView() {
  const [sequences, setSequences] = useState<SequenceRecord[]>(initialSequences);
  const [selectedSequence, setSelectedSequence] = useState<SequenceRecord | null>(initialSequences[0] || null);
  const [activeTab, setActiveTab] = useState<'steps' | 'prospects' | 'add-step'>('steps');
  const [enrolledMap, setEnrolledMap] = useState<Record<string, EnrolledProspect[]>>(initialEnrolledProspects);
  
  // Cadence creation & enrollment modal states
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newSeqName, setNewSeqName] = useState('');
  const [newSeqAudience, setNewSeqAudience] = useState('');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedToEnroll, setSelectedToEnroll] = useState<string[]>([]);

  // Add Step states
  const [newStepDay, setNewStepDay] = useState<number>(7);
  const [newStepType, setNewStepType] = useState<'email' | 'call' | 'task' | 'linkedin'>('email');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepSnippet, setNewStepSnippet] = useState('');

  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(null), 4000);
  };

  const currentEnrolled = selectedSequence ? enrolledMap[selectedSequence.id] || [] : [];

  const handleEnrollProspects = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSequence || selectedToEnroll.length === 0) return;

    const newlyEnrolled: EnrolledProspect[] = selectedToEnroll.map((id) => {
      const p = availableProspectsToEnroll.find((item) => item.id === id)!;
      return {
        id: `ENR-${Date.now()}-${p.id}`,
        name: p.name,
        company: p.company,
        email: p.email,
        currentStep: 1,
        totalSteps: selectedSequence.steps.length,
        status: 'In Progress',
        enrolledDate: new Date().toISOString().slice(0, 10),
      };
    });

    setEnrolledMap((prev) => ({
      ...prev,
      [selectedSequence.id]: [...(prev[selectedSequence.id] || []), ...newlyEnrolled],
    }));

    setSequences((prev) =>
      prev.map((s) => (s.id === selectedSequence.id ? { ...s, enrolledCount: s.enrolledCount + newlyEnrolled.length } : s))
    );

    setSelectedToEnroll([]);
    setEnrollModalOpen(false);
    setActiveTab('prospects');
    announce(`Enrolled ${newlyEnrolled.length} prospects into ${selectedSequence.name}`);
  };

  const handleAdvanceStep = (prospectId: string) => {
    if (!selectedSequence) return;
    setEnrolledMap((prev) => {
      const list = prev[selectedSequence.id] || [];
      const updated = list.map((p) => {
        if (p.id === prospectId) {
          const next = p.currentStep + 1;
          const isFinished = next > p.totalSteps;
          return {
            ...p,
            currentStep: isFinished ? p.totalSteps : next,
            status: isFinished ? ('Finished' as const) : p.status,
          };
        }
        return p;
      });
      return { ...prev, [selectedSequence.id]: updated };
    });
    announce('Prospect advanced to next cadence touchpoint.');
  };

  const handleMarkReplied = (prospectId: string) => {
    if (!selectedSequence) return;
    setEnrolledMap((prev) => {
      const list = prev[selectedSequence.id] || [];
      const updated = list.map((p) => (p.id === prospectId ? { ...p, status: 'Replied' as const } : p));
      return { ...prev, [selectedSequence.id]: updated };
    });
    announce('Prospect marked as Replied! Cadence goal attained.');
  };

  const handleOptOut = (prospectId: string) => {
    if (!selectedSequence) return;
    setEnrolledMap((prev) => {
      const list = prev[selectedSequence.id] || [];
      const updated = list.map((p) => (p.id === prospectId ? { ...p, status: 'Opted Out' as const } : p));
      return { ...prev, [selectedSequence.id]: updated };
    });
    announce('Prospect removed / opted out from sequence.');
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSequence || !newStepTitle) return;

    const newStep: SequenceStep = {
      day: newStepDay,
      type: newStepType,
      title: newStepTitle,
      templateSnippet: newStepSnippet || 'Quick outreach touchpoint.',
    };

    const updatedSteps = [...selectedSequence.steps, newStep].sort((a, b) => a.day - b.day);
    const updatedSeq = { ...selectedSequence, steps: updatedSteps };

    setSequences((prev) => prev.map((s) => (s.id === selectedSequence.id ? updatedSeq : s)));
    setSelectedSequence(updatedSeq);
    setNewStepTitle('');
    setNewStepSnippet('');
    setActiveTab('steps');
    announce(`Added Step "${newStepTitle}" to cadence.`);
  };

  const toggleStatus = (id: string) => {
    setSequences((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updatedStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          setAnnouncement(`Sequence ${s.name} is now ${updatedStatus}`);
          return { ...s, status: updatedStatus };
        }
        return s;
      })
    );
  };

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeqName) return;

    const created: SequenceRecord = {
      id: `SEQ-${Date.now().toString().slice(-3)}`,
      name: newSeqName,
      targetAudience: newSeqAudience || 'Target Prospects',
      status: 'ACTIVE',
      enrolledCount: 0,
      openRate: 0,
      replyRate: 0,
      meetingsBooked: 0,
      steps: [
        { day: 1, type: 'email', title: 'Welcome & Value Proposition', templateSnippet: 'Hi {{firstName}}, thanks for connecting...' },
        { day: 3, type: 'call', title: 'Follow-up Call', templateSnippet: 'Quick discovery call.' },
      ],
    };

    setSequences((prev) => [created, ...prev]);
    setSelectedSequence(created);
    setNewModalOpen(false);
    setNewSeqName('');
    setNewSeqAudience('');
    setAnnouncement(`Created cadence sequence: ${newSeqName}`);
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

      {/* ── Sequence Header Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Active Sequences
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            {sequences.filter((s) => s.status === 'ACTIVE').length} / {sequences.length}
          </div>
          <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Automated cadence flows</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Total Prospects Enrolled
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            {sequences.reduce((sum, s) => sum + s.enrolledCount, 0)}
          </div>
          <span className="text-[11px] text-ink-muted dark:text-[#A0A29C]">Across all campaigns</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Average Open Rate
          </span>
          <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">
            58.4%
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">+14% industry benchmark</span>
        </div>

        <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl p-4 border border-border dark:border-[#2E302A]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#A0A29C]">
            Meetings Booked
          </span>
          <div className="text-2xl font-black font-mono text-[#1F7A4D] dark:text-emerald-400 mt-1">
            {sequences.reduce((sum, s) => sum + s.meetingsBooked, 0)}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Automatic calendar bookings</span>
        </div>
      </div>

      {/* ── Main Sequences Console ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Sequences Master List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink dark:text-white">Outreach Cadences</h3>
            <button
              type="button"
              onClick={() => setNewModalOpen(true)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
            >
              + New Cadence
            </button>
          </div>

          <div className="space-y-3">
            {sequences.map((seq) => {
              const isSelected = selectedSequence?.id === seq.id;
              return (
                <div
                  key={seq.id}
                  onClick={() => setSelectedSequence(seq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white dark:bg-[#1E1F1C] border-accent shadow-md ring-1 ring-accent/30'
                      : 'bg-white dark:bg-[#1E1F1C] border-border dark:border-[#2E302A] hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink dark:text-white truncate max-w-[200px]">
                      {seq.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(seq.id);
                      }}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase cursor-pointer ${
                        seq.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {seq.status}
                    </button>
                  </div>

                  <p className="text-[11px] text-ink-muted dark:text-[#A0A29C] line-clamp-1">
                    {seq.targetAudience}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 dark:border-[#2E302A] text-center text-[10px]">
                    <div>
                      <span className="text-ink-muted dark:text-[#A0A29C] block">Enrolled</span>
                      <strong className="text-ink dark:text-white font-mono">{seq.enrolledCount}</strong>
                    </div>
                    <div>
                      <span className="text-ink-muted dark:text-[#A0A29C] block">Open %</span>
                      <strong className="text-ink dark:text-white font-mono">{seq.openRate}%</strong>
                    </div>
                    <div>
                      <span className="text-ink-muted dark:text-[#A0A29C] block">Replies</span>
                      <strong className="text-accent font-mono">{seq.replyRate}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Sequence Timeline, Enrolled Prospects & Step Builder */}
        {selectedSequence && (
          <div className="lg:col-span-2 bg-white dark:bg-[#1E1F1C] rounded-2xl p-6 border border-border dark:border-[#2E302A] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border dark:border-[#2E302A] gap-3">
              <div>
                <span className="text-[10px] font-mono text-ink-muted dark:text-[#A0A29C] uppercase">
                  Multi-Touch Workflow
                </span>
                <h3 className="text-lg font-black text-ink dark:text-white">
                  {selectedSequence.name}
                </h3>
                <p className="text-xs text-ink-muted dark:text-[#A0A29C] mt-0.5">
                  Target: {selectedSequence.targetAudience}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(true)}
                  className="btn-primary text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
                  </svg>
                  <span>+ Enroll Prospects</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus(selectedSequence.id)}
                  className={`btn-secondary text-xs py-1.5 px-3 cursor-pointer ${
                    selectedSequence.status === 'ACTIVE' ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-800 dark:text-emerald-400 font-bold'
                  }`}
                >
                  {selectedSequence.status === 'ACTIVE' ? 'Pause Cadence' : 'Activate Cadence'}
                </button>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border dark:border-[#2E302A] pb-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('steps')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'steps'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Cadence Touchpoints ({selectedSequence.steps.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prospects')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'prospects'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>Enrolled Prospects</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'prospects' ? 'bg-white text-neutral-900 font-mono' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 font-mono'}`}>
                  {currentEnrolled.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('add-step')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'add-step'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                + Add Step
              </button>
            </div>

            {/* Tab 1: Steps Timeline */}
            {activeTab === 'steps' && (
              <div className="space-y-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border dark:before:bg-[#2E302A]">
                  {selectedSequence.steps.map((step, idx) => (
                    <div key={idx} className="relative space-y-1.5">
                      <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-[#1E1F1C] shadow-2xs" />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                          Day {step.day}
                        </span>
                        <span className="text-xs font-bold text-ink dark:text-white">
                          {step.type === 'email' ? '✉️ Email' : step.type === 'call' ? '📞 Call' : step.type === 'linkedin' ? '💬 LinkedIn' : '✅ Task'}: {step.title}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border/70 dark:border-[#2E302A] text-xs text-ink-muted dark:text-neutral-300 font-mono leading-relaxed">
                        &quot;{step.templateSnippet}&quot;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Enrolled Prospects Table & Execution Drawer */}
            {activeTab === 'prospects' && (
              <div className="space-y-4">
                {currentEnrolled.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#FAF9F5] dark:bg-[#141513] border border-dashed border-border dark:border-[#2E302A] space-y-3">
                    <p className="text-xs text-ink-muted dark:text-[#A0A29C]">No prospects currently enrolled in this cadence.</p>
                    <button
                      type="button"
                      onClick={() => setEnrollModalOpen(true)}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      + Enroll First Prospect
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border dark:border-[#2E302A]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF9F5] dark:bg-[#141513] border-b border-border dark:border-[#2E302A] text-[11px] font-bold uppercase text-ink-muted dark:text-[#A0A29C]">
                        <tr>
                          <th className="py-2.5 px-3">Prospect</th>
                          <th className="py-2.5 px-3">Current Step</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Step Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 dark:divide-[#2E302A]">
                        {currentEnrolled.map((prospect) => (
                          <tr key={prospect.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-ink dark:text-white">{prospect.name}</div>
                              <div className="text-[10px] text-ink-muted dark:text-[#A0A29C]">{prospect.company} • {prospect.email}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-ink dark:text-white">
                                  Step {prospect.currentStep} of {prospect.totalSteps}
                                </span>
                              </div>
                              <div className="w-24 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1 overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full transition-all"
                                  style={{ width: `${Math.round((prospect.currentStep / prospect.totalSteps) * 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                prospect.status === 'Replied'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                                  : prospect.status === 'Finished'
                                  ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                                  : prospect.status === 'Opted Out'
                                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                              }`}>
                                {prospect.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {prospect.status === 'In Progress' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleAdvanceStep(prospect.id)}
                                      className="px-2 py-1 rounded bg-accent text-white font-bold text-[10px] hover:bg-[#853526] transition-colors cursor-pointer shadow-2xs"
                                      title="Advance to next cadence touchpoint"
                                    >
                                      ▶ Advance
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMarkReplied(prospect.id)}
                                      className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] hover:bg-emerald-100 transition-colors cursor-pointer"
                                      title="Mark as Replied"
                                    >
                                      💬 Replied
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOptOut(prospect.id)}
                                      className="px-1.5 py-1 text-[10px] text-ink-muted dark:text-[#A0A29C] hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
                                      title="Opt-Out prospect"
                                    >
                                      ✕
                                    </button>
                                  </>
                                )}
                                {prospect.status !== 'In Progress' && (
                                  <span className="text-[10px] text-ink-muted dark:text-[#A0A29C] font-medium">Completed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Add Step Builder */}
            {activeTab === 'add-step' && (
              <form onSubmit={handleAddStep} className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] space-y-3 text-xs">
                <h4 className="font-bold text-ink dark:text-white">Add Touchpoint Step</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted dark:text-neutral-300 mb-1">
                      Day Offset
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={newStepDay}
                      onChange={(e) => setNewStepDay(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted dark:text-neutral-300 mb-1">
                      Touchpoint Channel
                    </label>
                    <select
                      value={newStepType}
                      onChange={(e) => setNewStepType(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white"
                    >
                      <option value="email">✉️ Automated / Manual Email</option>
                      <option value="call">📞 Phone Touchpoint</option>
                      <option value="linkedin">💬 LinkedIn Message</option>
                      <option value="task">✅ Task Reminder</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted dark:text-neutral-300 mb-1">
                    Step Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROI Calculation & Implementation Plan"
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted dark:text-neutral-300 mb-1">
                    Template Snippet / Script
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hi {{firstName}}, sharing a breakdown of projected cost savings..."
                    value={newStepSnippet}
                    onChange={(e) => setNewStepSnippet(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2E302A] bg-white dark:bg-[#1E1F1C] text-ink dark:text-white font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('steps')}
                    className="px-3 py-1.5 rounded-lg border border-border dark:border-[#2E302A] text-ink-muted dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-accent text-white font-bold hover:bg-[#853526]"
                  >
                    Save Step to Cadence
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ── Enroll Prospects Modal ── */}
      {enrollModalOpen && selectedSequence && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-prospects-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEnrollModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-lg w-full p-6 space-y-4 text-ink dark:text-neutral-100">
            <div className="flex items-center justify-between pb-2 border-b border-border dark:border-[#2E302A]">
              <div>
                <h3 id="enroll-prospects-title" className="text-base font-bold text-ink dark:text-white">
                  Enroll Prospects into Cadence
                </h3>
                <p className="text-xs text-ink-muted dark:text-[#A0A29C] mt-0.5">
                  Sequence: <strong>{selectedSequence.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white text-sm p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollProspects} className="space-y-4 text-xs">
              <p className="text-xs text-ink-muted dark:text-[#A0A29C]">
                Select prospect leads from the intake roster to automatically begin multi-touch outreach:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableProspectsToEnroll.map((p) => {
                  const isChecked = selectedToEnroll.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#FAF4F2] dark:bg-[#2A1B16] border-accent/60' : 'bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2E302A] hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedToEnroll((prev) => [...prev, p.id]);
                            } else {
                              setSelectedToEnroll((prev) => prev.filter((id) => id !== p.id));
                            }
                          }}
                          className="w-4 h-4 rounded accent-[#A8462F]"
                        />
                        <div>
                          <div className="font-bold text-ink dark:text-white">{p.name}</div>
                          <div className="text-[10px] text-ink-muted dark:text-[#A0A29C]">{p.company} • {p.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-accent">Active Lead</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border dark:border-[#2E302A]">
                <span className="text-xs text-ink-muted dark:text-[#A0A29C]">
                  <strong>{selectedToEnroll.length}</strong> selected
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-border dark:border-[#2E302A] text-ink-muted dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedToEnroll.length === 0}
                    className="px-4 py-1.5 rounded-lg bg-accent text-white font-bold hover:bg-[#853526] disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Enroll Prospects
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── New Sequence Modal ── */}
      {newModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-cadence-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#1E1F1C] rounded-2xl border border-border dark:border-[#2E302A] shadow-2xl max-w-md w-full p-6 space-y-4 text-ink dark:text-neutral-100">
            <h3 id="new-cadence-title" className="text-base font-bold text-ink dark:text-white">
              Create Outreach Cadence Sequence
            </h3>
            <form onSubmit={handleCreateSequence} className="space-y-3 text-xs">
              <div>
                <label htmlFor="seq-name" className="text-xs font-semibold text-ink dark:text-neutral-200 block mb-1">
                  Sequence Name *
                </label>
                <input
                  id="seq-name"
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive Demo Outreach"
                  value={newSeqName}
                  onChange={(e) => setNewSeqName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="seq-aud" className="text-xs font-semibold text-ink dark:text-neutral-200 block mb-1">
                  Target Audience
                </label>
                <input
                  id="seq-aud"
                  type="text"
                  placeholder="e.g. VP of Logistics & Procurement"
                  value={newSeqAudience}
                  onChange={(e) => setNewSeqAudience(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2E302A] bg-[#FAF9F5] dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-[#2E302A]">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border dark:border-[#2E302A] text-ink-muted dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-accent text-white hover:bg-[#853526] focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Create Cadence
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
    </div>
  );
}
