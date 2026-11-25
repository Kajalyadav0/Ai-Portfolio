import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { WebsiteProjectItem } from '../types/portfolio';
import { sanitizeExternalUrl } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface WebsitesViewProps {
  websites: WebsiteProjectItem[];
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({ websites }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">Website Development Portfolio</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Websites &amp; Technical Implementation References
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Reference websites from my web development background and WordPress implementation experience. Each project entry supports editable contribution scope, technologies, and screenshots via Portfolio Admin.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {websites.map((site) => {
          const safeUrl = sanitizeExternalUrl(site.url);
          const cleanHost = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
          return (
            <article
              key={site.id}
              className="rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden flex flex-col"
            >
              {/* Browser Window Frame Preview */}
              <div className="border-b border-[#E6E4DF] bg-[#F5F3EE]">
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#E6E4DF] bg-[#FAF9F6]">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                  </div>
                  <span className="text-xs font-mono text-[#52525B] truncate max-w-[220px]">
                    {cleanHost}
                  </span>
                  <Globe size={13} className="text-[#71717A]" aria-hidden="true" />
                </div>

                <div className="aspect-[16/9] bg-[#F2F0EB] overflow-hidden">
                  {site.screenshotUrl ? (
                    <SafeImage
                      src={site.screenshotUrl}
                      alt={`${site.name} website screenshot`}
                      className="w-full h-full object-cover object-top"
                      fallbackTitle={site.name}
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col justify-between bg-[#F7F6F2]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-[#71717A]">{site.industry}</p>
                          <p className="font-display text-2xl font-semibold text-[#18181B]">
                            {site.name}
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-[#71717A] bg-white border border-[#E6E4DF] px-2.5 py-1 rounded">
                          Reference URL
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 my-3" aria-hidden="true">
                        <div className="col-span-2 rounded-lg border border-[#E6E4DF] bg-white p-3 space-y-2">
                          <div className="h-2 w-2/3 rounded bg-[#E6E4DF]" />
                          <div className="h-2 w-full rounded bg-[#F0EDE6]" />
                          <div className="h-2 w-4/5 rounded bg-[#F0EDE6]" />
                        </div>
                        <div className="rounded-lg border border-[#E6E4DF] bg-white p-3 flex flex-col justify-between">
                          <div className="h-2 w-3/4 rounded bg-[#1E3A5F]/20" />
                          <div className="h-5 w-full rounded bg-[#EFECE6]" />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#52525B]">
                          Live URL: <span className="font-mono">{cleanHost}</span>
                        </span>
                        <span className="text-[#71717A]">
                          Upload screenshot in Admin
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#71717A]">
                    <span>{site.industry}</span>
                    {site.technologies.length > 0 && (
                      <span className="font-medium text-[#1E3A5F]">
                        {site.technologies.join(' · ')}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl font-semibold text-[#18181B]">
                    {site.name}
                  </h2>

                  <p className="text-sm text-[#27272A]">
                    <span className="font-medium">Contribution:</span> {site.contribution}
                  </p>

                  <p className="text-sm text-[#52525B] leading-relaxed">
                    {site.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EDE6] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#71717A] truncate">
                    {cleanHost}
                  </span>
                  {safeUrl && (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium hover:bg-[#152B47] transition-colors whitespace-nowrap shrink-0"
                    >
                      Visit Website
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
