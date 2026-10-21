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

export function CrmSequencesView() {
  const [sequences, setSequences] = useState<SequenceRecord[]>(initialSequences);
  const [selectedSequence, setSelectedSequence] = useState<SequenceRecord | null>(initialSequences[0] || null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newSeqName, setNewSeqName] = useState('');
  const [newSeqAudience, setNewSeqAudience] = useState('');
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

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
        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Active Sequences
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            {sequences.filter((s) => s.status === 'ACTIVE').length} / {sequences.length}
          </div>
          <span className="text-[11px] text-ink-muted">Automated cadence flows</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Total Prospects Enrolled
          </span>
          <div className="text-2xl font-black font-mono text-accent mt-1">
            {sequences.reduce((sum, s) => sum + s.enrolledCount, 0)}
          </div>
          <span className="text-[11px] text-ink-muted">Across all campaigns</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Average Open Rate
          </span>
          <div className="text-2xl font-black font-mono text-ink mt-1">
            58.4%
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+14% industry benchmark</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Meetings Booked
          </span>
          <div className="text-2xl font-black font-mono text-[#1F7A4D] mt-1">
            {sequences.reduce((sum, s) => sum + s.meetingsBooked, 0)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Automatic calendar bookings</span>
        </div>
      </div>

      {/* ── Main Sequences Console ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Sequences Master List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Outreach Cadences</h3>
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
                      ? 'bg-white border-accent shadow-md ring-1 ring-accent/30'
                      : 'bg-white border-border hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink truncate max-w-[200px]">
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
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-neutral-200 text-neutral-800'
                      }`}
                    >
                      {seq.status}
                    </button>
                  </div>

                  <p className="text-[11px] text-ink-muted line-clamp-1">
                    {seq.targetAudience}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-center text-[10px]">
                    <div>
                      <span className="text-ink-muted block">Enrolled</span>
                      <strong className="text-ink font-mono">{seq.enrolledCount}</strong>
                    </div>
                    <div>
                      <span className="text-ink-muted block">Open %</span>
                      <strong className="text-ink font-mono">{seq.openRate}%</strong>
                    </div>
                    <div>
                      <span className="text-ink-muted block">Replies</span>
                      <strong className="text-accent font-mono">{seq.replyRate}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Sequence Timeline & Preview */}
        {selectedSequence && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase">
                  Multi-Touch Workflow
                </span>
                <h3 className="text-lg font-black text-ink">
                  {selectedSequence.name}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Target: {selectedSequence.targetAudience}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(selectedSequence.id)}
                  className={`btn-secondary text-xs py-1.5 px-3 cursor-pointer ${
                    selectedSequence.status === 'ACTIVE' ? 'text-amber-800' : 'text-emerald-800 font-bold'
                  }`}
                >
                  {selectedSequence.status === 'ACTIVE' ? 'Pause Cadence' : 'Activate Cadence'}
                </button>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Cadence Touchpoints ({selectedSequence.steps.length} Steps)
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {selectedSequence.steps.map((step, idx) => (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Step Node Dot */}
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-2xs" />

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                        Day {step.day}
                      </span>
                      <span className="text-xs font-bold text-ink">
                        {step.type === 'email' ? '✉️ Email' : step.type === 'call' ? '📞 Call' : step.type === 'linkedin' ? '💬 LinkedIn' : '✅ Task'}: {step.title}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-border/70 text-xs text-ink-muted font-mono leading-relaxed">
                      &quot;{step.templateSnippet}&quot;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 text-ink">
            <h3 id="new-cadence-title" className="text-base font-bold text-ink">
              Create Outreach Cadence Sequence
            </h3>
            <form onSubmit={handleCreateSequence} className="space-y-3 text-xs">
              <div>
                <label htmlFor="seq-name" className="text-xs font-semibold text-ink block mb-1">
                  Sequence Name *
                </label>
                <input
                  id="seq-name"
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive Demo Outreach"
                  value={newSeqName}
                  onChange={(e) => setNewSeqName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="seq-aud" className="text-xs font-semibold text-ink block mb-1">
                  Target Audience
                </label>
                <input
                  id="seq-aud"
                  type="text"
                  placeholder="e.g. VP of Logistics & Procurement"
                  value={newSeqAudience}
                  onChange={(e) => setNewSeqAudience(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-[#FAF9F5] text-ink focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-ink-muted hover:bg-neutral-100"
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
