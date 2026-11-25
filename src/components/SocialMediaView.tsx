import React, { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { SocialMediaItem, SocialPlatformCategory } from '../types/portfolio';
import { filterSocialItems, sanitizeExternalUrl } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface SocialMediaViewProps {
  items: SocialMediaItem[];
}

const CATEGORIES: SocialPlatformCategory[] = [
  'All',
  'Instagram',
  'Facebook',
  'Reels',
  'Real Estate',
  'Campaign Creatives',
];

export const SocialMediaView: React.FC<SocialMediaViewProps> = ({ items }) => {
  const [activeFilter, setActiveFilter] = useState<SocialPlatformCategory>('All');
  const [selectedItem, setSelectedItem] = useState<SocialMediaItem | null>(null);

  const filtered = filterSocialItems(items, activeFilter);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">Social Media Management Portfolio</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Social Media, Content Planning &amp; Brand Creatives
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Instagram and Facebook page management, content calendars, Reels coordination, real estate promotions, and occasion-based brand communication creatives.
        </p>
      </header>

      {/* Interactive Filter Bar */}
      <div
        role="tablist"
        aria-label="Filter social media projects"
        className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFECE6] rounded-xl w-fit"
      >
        {CATEGORIES.map((category) => {
          const active = activeFilter === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveFilter(category)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-white text-[#18181B] shadow-sm'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Visual Gallery */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E6E4DF] bg-white p-12 text-center space-y-2">
          <p className="font-medium text-[#18181B]">
            No projects listed under &ldquo;{activeFilter}&rdquo; yet.
          </p>
          <p className="text-sm text-[#71717A]">
            Add new social media screenshots and projects from Portfolio Admin anytime.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item) => {
            const safeLink = sanitizeExternalUrl(item.liveUrl);
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#F2F0EB] border-b border-[#E6E4DF] overflow-hidden group">
                  <SafeImage
                    src={item.imageUrl}
                    alt={`${item.brandOrProject} — ${item.platform}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    fallbackTitle={item.brandOrProject}
                    fallbackSubtitle="Upload creative or screenshot in Admin"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    aria-label={`Preview ${item.brandOrProject}`}
                    className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 text-[#18181B] border border-[#E6E4DF] flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  >
                    <Maximize2 size={15} aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      <span className="font-medium text-[#1E3A5F]">{item.platform}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{item.industry}</span>
                    </div>
                    <h2 className="font-display text-lg font-semibold text-[#18181B]">
                      {item.brandOrProject}
                    </h2>
                    <p className="text-xs font-medium text-[#3F3F46]">
                      Role: {item.role}
                    </p>
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      {item.workPerformed}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0EDE6] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-medium text-[#1E3A5F] hover:underline cursor-pointer"
                    >
                      Inspect Preview
                    </button>
                    {safeLink ? (
                      <a
                        href={safeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18181B] hover:text-[#1E3A5F]"
                      >
                        Live Page
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-xs text-[#A1A1AA]">Link optional</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.brandOrProject}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden border border-[#E6E4DF] max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#71717A]">
                  {selectedItem.platform} &middot; {selectedItem.industry}
                </p>
                <h2 className="font-display text-lg font-semibold text-[#18181B]">
                  {selectedItem.brandOrProject}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close preview"
                className="w-9 h-9 rounded-lg border border-[#E6E4DF] flex items-center justify-center text-[#18181B] hover:bg-[#F3F1EC] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 rounded-xl overflow-hidden border border-[#E6E4DF] bg-[#F2F0EB]">
                <SafeImage
                  src={selectedItem.imageUrl}
                  alt={selectedItem.brandOrProject}
                  className="w-full max-h-[480px] object-contain"
                  fallbackTitle={selectedItem.brandOrProject}
                />
              </div>
              <div className="md:col-span-5 space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#71717A]">My Role</p>
                  <p className="text-sm text-[#18181B] mt-1">{selectedItem.role}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#71717A]">Work Performed</p>
                  <p className="text-sm text-[#3F3F46] leading-relaxed mt-1">
                    {selectedItem.workPerformed}
                  </p>
                </div>
                {selectedItem.notes && (
                  <div className="rounded-lg bg-[#FAF9F6] border border-[#E6E4DF] p-3 text-xs text-[#52525B]">
                    {selectedItem.notes}
                  </div>
                )}
                {sanitizeExternalUrl(selectedItem.liveUrl) && (
                  <a
                    href={sanitizeExternalUrl(selectedItem.liveUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47]"
                  >
                    Open Social Link
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
