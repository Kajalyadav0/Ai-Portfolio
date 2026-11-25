import React, { useState } from 'react';
import { Download, ExternalLink, FileText, Mail, MapPin, Phone, Send } from 'lucide-react';
import { AboutInfo, PortfolioPageId, ProfileInfo } from '../types/portfolio';
import {
  buildResumeDownloadUrl,
  sanitizeExternalUrl,
  validateContactInput,
} from '../utils/portfolioLogic';

interface ContactResumeViewProps {
  profile: ProfileInfo;
  about: AboutInfo;
  onNavigate: (page: PortfolioPageId) => void;
}

export const ContactResumeView: React.FC<ContactResumeViewProps> = ({
  profile,
  about,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const safeLinkedIn = sanitizeExternalUrl(profile.linkedInUrl);
  const safeResumeUrl = sanitizeExternalUrl(profile.resumePdfUrl);
  const resumeDownloadHref = buildResumeDownloadUrl(profile.resumePdfUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitFeedback(null);

    const check = validateContactInput({ name, email, subject, message });
    if (!check.valid) {
      setErrors(check.errors as Record<string, string>);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitFeedback({
          type: 'error',
          text: data.error || 'Could not record your message. Please try again.',
        });
      } else {
        setSubmitFeedback({
          type: 'success',
          text:
            data.note ||
            'Your message has been saved to the portfolio inbox. For immediate follow-up, you can also email or call directly.',
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setSubmitFeedback({
        type: 'error',
        text: 'Network error while saving your inquiry. Please contact via email or phone directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">Contact &amp; Resume</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Let&apos;s Connect
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Have a project, opportunity or collaboration in mind? I&apos;d love to connect and explore how we can work together.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Details & Resume */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-7 space-y-5">
            <h2 className="font-display text-xl font-semibold text-[#18181B]">
              Direct Contact Details
            </h2>

            <div className="space-y-3.5 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E4DF] hover:bg-[#FAF9F6] transition-colors text-[#18181B]"
              >
                <Mail size={18} className="text-[#1E3A5F] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#71717A]">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </a>

              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E4DF] hover:bg-[#FAF9F6] transition-colors text-[#18181B]"
              >
                <Phone size={18} className="text-[#1E3A5F] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#71717A]">Phone</p>
                  <p className="font-medium tabular-nums">{profile.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] text-[#18181B]">
                <MapPin size={18} className="text-[#1E3A5F] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#71717A]">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
              </div>

              {safeLinkedIn ? (
                <a
                  href={safeLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#1E3A5F] bg-[#1E3A5F] text-white hover:bg-[#152B47] transition-colors"
                >
                  <span className="text-sm font-medium">View LinkedIn Profile</span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ) : (
                <div className="p-3 rounded-xl border border-dashed border-[#D4D1C9] text-xs text-[#71717A]">
                  LinkedIn URL not added yet — editable in Portfolio Admin.
                </div>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div className="rounded-2xl border border-[#E6E4DF] bg-[#F5F3EE] p-6 sm:p-7 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E6E4DF] flex items-center justify-center text-[#1E3A5F] shrink-0">
                <FileText size={18} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  Resume &amp; Profile Summary
                </h2>
                <p className="text-xs text-[#52525B]">
                  {about.education.degree} &middot; {about.education.duration}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#3F3F46] leading-relaxed">
              {profile.heroSupportingText}
            </p>

            {safeResumeUrl ? (
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={resumeDownloadHref}
                    download={profile.resumeFileName || 'Kajal_Yadav_Resume.pdf'}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] transition-colors"
                  >
                    <Download size={15} aria-hidden="true" />
                    Download Resume PDF
                  </a>
                  <a
                    href={safeResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D4D1C9] bg-white text-[#18181B] text-sm font-medium hover:bg-[#FAF9F6]"
                  >
                    Preview PDF
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
                {profile.resumeFileName && (
                  <p className="text-xs text-[#71717A]">
                    File: {profile.resumeFileName}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#C9C5BC] bg-white p-4 space-y-2">
                <p className="text-sm font-medium text-[#18181B]">
                  Resume PDF Upload Pending
                </p>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  No resume PDF has been uploaded yet. Upload your official PDF inside Portfolio Admin to activate instant download and preview.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="text-xs font-medium text-[#1E3A5F] hover:underline cursor-pointer"
                >
                  Open Portfolio Admin to Upload Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold text-[#18181B]">
              Send a Message
            </h2>
            <p className="text-sm text-[#52525B]">
              Messages submitted here are saved to the portfolio&apos;s private Admin inbox. For email alerts, configure an external email/SMTP service when deploying.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-medium text-[#3F3F46] mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-700">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-medium text-[#3F3F46] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-700">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-medium text-[#3F3F46] mb-1.5"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Role opportunity, freelance project, or collaboration"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-700">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-medium text-[#3F3F46] mb-1.5"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me a little about your project or role..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4D1C9] bg-[#FAF9F6] text-sm text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-700">{errors.message}</p>
              )}
            </div>

            {submitFeedback && (
              <div
                role="status"
                className={`rounded-xl p-4 text-sm border ${
                  submitFeedback.type === 'success'
                    ? 'bg-[#F2F7F4] border-[#B7D6C3] text-[#1D4B32]'
                    : 'bg-[#FDF2F2] border-[#E8B8B8] text-[#7F1D1D]'
                }`}
              >
                {submitFeedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Send size={15} aria-hidden="true" />
              {submitting ? 'Saving Inquiry...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
