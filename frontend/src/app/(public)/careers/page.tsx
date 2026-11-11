'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { getJobOpenings, JobOpening } from '@/lib/cms-store';
import { Modal } from '@/components/ui/Modal';

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverNote: '',
  });

  useEffect(() => {
    const list = getJobOpenings().filter((j) => j.isOpen);
    setJobs(list);
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
    }, 2000);
  };

  if (jobs.length === 0) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-6 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-white/5 mx-auto flex items-center justify-center text-neutral-400">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink dark:text-white">No Open Roles Currently</h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          We do not have any active openings right now, but we are always eager to meet exceptional builders.
          Feel free to send a speculative note to <a href="mailto:careers@bahi.app" className="text-accent underline">careers@bahi.app</a>.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Mission</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Build the operating system for modern business
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            We are a high-autonomy team of engineers, designers, and systems architects creating high-density,
            real-time productivity tools.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
            <span className="font-serif font-black text-2xl text-accent">01.</span>
            <h3 className="font-serif font-bold text-base text-ink dark:text-white">Autonomy & Deep Work</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Minimal meetings, high async documentation, and direct ownership of entire product domains.
            </p>
          </div>
          <div className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
            <span className="font-serif font-black text-2xl text-accent">02.</span>
            <h3 className="font-serif font-bold text-base text-ink dark:text-white">Top-Tier Compensation</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Competitive global salaries, meaningful equity grants, and top-of-the-line hardware setups.
            </p>
          </div>
          <div className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
            <span className="font-serif font-black text-2xl text-accent">03.</span>
            <h3 className="font-serif font-bold text-base text-ink dark:text-white">Health & Wellness</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Comprehensive medical insurance, unlimited time off policy, and annual learning stipends.
            </p>
          </div>
        </div>

        {/* Job Listings List */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-ink dark:text-white mb-6">
            Open Positions ({jobs.length})
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {job.department}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {job.type}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-ink dark:text-white">{job.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
                    {job.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedJob(job);
                    setIsApplyModalOpen(true);
                  }}
                  className="shrink-0 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }}
          title={selectedJob ? `Apply: ${selectedJob.title}` : 'Submit Job Application'}
          subtitle="Join the Bahi engineering & operations team"
          maxWidth="lg"
        >
          {appliedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-serif font-bold text-xl text-ink dark:text-white">Application Received</h4>
              <p className="text-xs text-neutral-500">
                Thank you for applying! Our hiring team will review your credentials and contact you within 5 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicant.name}
                    onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applicant.email}
                    onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={applicant.phone}
                    onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase">LinkedIn / GitHub URL</label>
                  <input
                    type="url"
                    value={applicant.linkedin}
                    onChange={(e) => setApplicant({ ...applicant, linkedin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase">Why Bahi? (Cover Note)</label>
                <textarea
                  rows={4}
                  value={applicant.coverNote}
                  onChange={(e) => setApplicant({ ...applicant, coverNote: e.target.value })}
                  placeholder="Share recent projects you are proud of, your stack preferences, or why you want to work on enterprise tools..."
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111318] text-xs text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-accent text-white font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
