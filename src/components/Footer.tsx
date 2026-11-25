import React from 'react';
import { PortfolioPageId, ProfileInfo } from '../types/portfolio';
import { sanitizeExternalUrl } from '../utils/portfolioLogic';

interface FooterProps {
  profile: ProfileInfo;
  onNavigate: (page: PortfolioPageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigate }) => {
  const safeLinkedIn = sanitizeExternalUrl(profile.linkedInUrl);

  return (
    <footer className="border-t border-[#E6E4DF] bg-[#F5F3EE] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E6E4DF]">
          <div className="md:col-span-5 space-y-3">
            <p className="font-display text-lg font-semibold text-[#18181B]">
              {profile.name}
            </p>
            <p className="text-sm text-[#52525B] leading-relaxed max-w-md">
              {profile.positioning}
            </p>
            <p className="font-serif italic text-base text-[#3F3F46]">
              &ldquo;{profile.tagline}&rdquo;
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="text-xs font-medium text-[#71717A]">Portfolio Sections</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {(
                [
                  ['about', 'About'],
                  ['experience', 'Experience'],
                  ['social-media', 'Social Media'],
                  ['digital-marketing', 'Digital Marketing'],
                  ['websites', 'Website Development'],
                  ['ai-automation', 'AI & Automation'],
                  ['case-studies', 'Case Studies'],
                  ['contact', 'Contact & Resume'],
                ] as [PortfolioPageId, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="text-left text-[#3F3F46] hover:text-[#1E3A5F] transition-colors cursor-pointer py-0.5"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm text-[#3F3F46]">
            <p className="text-xs font-medium text-[#71717A]">Direct Contact</p>
            <p>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-[#1E3A5F] transition-colors"
              >
                {profile.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="hover:text-[#1E3A5F] transition-colors tabular-nums"
              >
                {profile.phone}
              </a>
            </p>
            <p className="text-[#52525B]">{profile.location}</p>
            {safeLinkedIn && (
              <p>
                <a
                  href={safeLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E3A5F] hover:underline"
                >
                  LinkedIn Profile
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}. Built with thoughtful design &amp; AI-assisted workflows.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            Portfolio Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
