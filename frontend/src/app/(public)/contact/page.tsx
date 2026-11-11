'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'Sales & Plan Demo',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    // Save contact inquiry to localStorage / local dispatch queue
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        const inquiries = JSON.parse(localStorage.getItem('bahi_contact_inquiries') || '[]');
        inquiries.unshift({
          ...formData,
          id: `inq-${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('bahi_contact_inquiries', JSON.stringify(inquiries));
      } catch (e) {
        console.error(e);
      }
    }, 900);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With Our Team</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            How can we help your business thrive?
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Have questions about custom migrations, security audits, or enterprise pricing? Our solutions
            engineers respond within 4 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Direct Channels</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-400 block text-[11px] uppercase tracking-wider">
                      Sales & Inquiries
                    </span>
                    <a href="mailto:sales@bahi.app" className="text-ink dark:text-white font-medium hover:text-accent">
                      sales@bahi.app
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-400 block text-[11px] uppercase tracking-wider">
                      Direct Support Line
                    </span>
                    <span className="text-ink dark:text-white font-medium">+1 (800) 555-BAHI (2244)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-400 block text-[11px] uppercase tracking-wider">
                      Support SLA
                    </span>
                    <span className="text-ink dark:text-white font-medium">Mon–Fri: 8:00 AM – 8:00 PM EST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-400 block text-[11px] uppercase tracking-wider">
                      Global Headquarters
                    </span>
                    <span className="text-ink dark:text-white font-medium leading-relaxed block">
                      500 Howard Street, Suite 400
                      <br />
                      San Francisco, CA 94105
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-[11px] text-emerald-500 font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Encrypted transmission & zero spam promise</span>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-ink dark:text-white">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Our enterprise solutions team has received your inquiry and will
                    follow up with you at <strong className="text-ink dark:text-white">{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        phone: '',
                        inquiryType: 'Sales & Plan Demo',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-black/5 dark:border-white/5 pb-4">
                    <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Send us a message</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Fill out the form below and an engineer will reply directly.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Rostova"
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nexus Global Ltd."
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        <option>Sales & Plan Demo</option>
                        <option>Custom ERP Migration</option>
                        <option>Enterprise Security / SOC2</option>
                        <option>Technical Partnership / API</option>
                        <option>Billing & Invoices</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                      Message / Project Scope *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your team size, modules required, and current software pain points..."
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E2029] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Transmitting Note...' : 'Submit Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

