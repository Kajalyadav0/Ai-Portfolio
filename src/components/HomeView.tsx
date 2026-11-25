import React from 'react';
import { ArrowRight, Download, ExternalLink, FileText } from 'lucide-react';
import { PortfolioData, PortfolioPageId } from '../types/portfolio';
import { buildResumeDownloadUrl, sanitizeExternalUrl } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  data: PortfolioData;
  onNavigate: (page: PortfolioPageId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ data, onNavigate }) => {
  const { profile, about, experiences, websites, aiAutomation } = data;
  const safeResumeUrl = sanitizeExternalUrl(profile.resumePdfUrl);
  const resumeDownloadHref = buildResumeDownloadUrl(profile.resumePdfUrl);

  const fourPillars: {
    id: PortfolioPageId;
    number: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl?: string;
    previewLabel: string;
  }[] = [
    {
      id: 'social-media',
      number: '01',
      title: 'Social Media & Content',
      subtitle: 'Instagram · Facebook · Reels · Brand Presence',
      description:
        'Content planning, real estate promotional creatives, brand communication posts, and consistent feed execution.',
      imageUrl: '/src/assets/images/brand_campaign_flatlay_1795632735508.jpg',
      previewLabel: 'Social Media Gallery',
    },
    {
      id: 'digital-marketing',
      number: '02',
      title: 'Digital Marketing & Performance Campaigns',
      subtitle: 'Meta Ads · Lead Generation · Real Estate Marketing',
      description:
        'Lead generation campaigns, audience targeting, instant lead forms, and real estate project promotions monitored via GA4 and Meta Ads Manager.',
      imageUrl: '/src/assets/images/realestate_social_creative_1795632735176.jpg',
      previewLabel: 'Campaigns & Real Estate',
    },
    {
      id: 'websites',
      number: '03',
      title: 'Website Development',
      subtitle: 'WordPress · Front-End Implementation · Maintenance',
      description:
        `${websites.length} referenced client and corporate websites spanning technology, finance, staffing, and travel.`,
      imageUrl: '',
      previewLabel: '7 Website References',
    },
    {
      id: 'ai-automation',
      number: '04',
      title: 'AI & Automation Projects',
      subtitle: 'AI Studio · Prompt Workflows · Product Mockups',
      description:
        'Practical AI-assisted website creation, creative product mockups, marketing copy ideation, and workflow experiments.',
      imageUrl: aiAutomation.featuredProject.previewImageUrl,
      previewLabel: 'Featured AI Portfolio',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Column: Positioning & Typography */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1E3A5F]">
                    {profile.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#52525B]">
                    {profile.positioning}
                  </p>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#18181B] leading-[1.1] max-w-2xl">
                  {profile.heroHeading}
                </h1>

                <p className="text-base sm:text-lg text-[#3F3F46] leading-relaxed max-w-2xl">
                  {profile.heroSupportingText}
                </p>

                <p className="font-serif italic text-lg sm:text-xl text-[#52525B] max-w-xl">
                  &ldquo;{profile.tagline}&rdquo;
                </p>
              </div>

              <div className="pt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('social-media')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  View My Work
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#D4D1C9] bg-white text-[#18181B] text-sm font-medium hover:bg-[#F3F1EC] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Let&apos;s Connect
                </button>

                {safeResumeUrl ? (
                  <a
                    href={resumeDownloadHref}
                    download={profile.resumeFileName || 'Kajal_Yadav_Resume.pdf'}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-[#1E3A5F] hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Download size={16} aria-hidden="true" />
                    Download Resume
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#EFECE6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <FileText size={16} aria-hidden="true" />
                    Download Resume
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Editorial Portrait */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-2xl overflow-hidden border border-[#E6E4DF] bg-white h-[380px] sm:h-[440px] lg:h-[520px]">
                <SafeImage
                  src={profile.portraitUrl}
                  alt={`${profile.name} — Digital Marketing & Website Development Portfolio Portrait`}
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={profile.name}
                  fallbackSubtitle="Upload your portrait photograph in Portfolio Admin."
                />
              </div>
              {profile.portraitCaption && (
                <p className="mt-2.5 text-xs text-[#71717A] text-right">
                  {profile.portraitCaption}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Four Portfolio Categories Visual Introduction */}
      <section className="border-t border-[#E6E4DF] pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-[#1E3A5F]">Selected Portfolio Pillars</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181B]">
                Explore Work Across Marketing, Web &amp; AI
              </h2>
            </div>
            <p className="text-sm text-[#52525B] max-w-md">
              Visual work previews, website development references, and practical AI creations organized for clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {fourPillars.map((pillar) => (
              <article
                key={pillar.id}
                className="group rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden flex flex-col transition-colors hover:border-[#C9C5BC]"
              >
                <div className="aspect-[16/10] bg-[#F2F0EB] overflow-hidden border-b border-[#E6E4DF]">
                  {pillar.imageUrl ? (
                    <SafeImage
                      src={pillar.imageUrl}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      fallbackTitle={pillar.title}
                    />
                  ) : (
                    /* Clean editorial browser frame preview for Website Development pillar */
                    <div className="w-full h-full p-5 sm:p-6 flex flex-col justify-between bg-[#F6F5F0]">
                      <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-3">
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4D1C9]" />
                        </div>
                        <span className="text-xs font-mono text-[#71717A]">
                          {pillar.previewLabel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 my-auto py-3">
                        {websites.slice(0, 4).map((site) => (
                          <div
                            key={site.id}
                            className="rounded-lg border border-[#E6E4DF] bg-white px-3 py-2.5"
                          >
                            <p className="text-xs font-semibold text-[#18181B] truncate">
                              {site.name}
                            </p>
                            <p className="text-[11px] text-[#71717A] truncate mt-0.5">
                              {site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[#52525B]">
                        Includes Arcitech AI, Marksmith, Arcot Ventures, APV Finsol &amp; more
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      <span className="font-mono text-[#1E3A5F]">{pillar.number}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{pillar.subtitle}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#18181B]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onNavigate(pillar.id)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A5F] hover:text-[#152B47] transition-colors cursor-pointer"
                    >
                      Explore {pillar.title}
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured AI Project & Case Studies Strip */}
      <section className="border-t border-[#E6E4DF] pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Featured AI Portfolio Callout */}
            <div className="lg:col-span-7 rounded-2xl border border-[#E6E4DF] bg-white p-7 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#1E3A5F]">
                  Featured AI-Assisted Project
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#18181B]">
                  {aiAutomation.featuredProject.title}
                </h2>
                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
                  {aiAutomation.featuredProject.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F0EDE6]">
                <p className="text-xs text-[#71717A]">
                  Tool: {aiAutomation.featuredProject.tools.join(' · ')}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-automation')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A5F] hover:underline cursor-pointer"
                >
                  View AI &amp; Automation Portfolio
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Experience & Case Studies Direct Entry */}
            <div className="lg:col-span-5 rounded-2xl border border-[#E6E4DF] bg-[#F5F3EE] p-7 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium text-[#1E3A5F]">
                  Background &amp; Practical Reporting
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#18181B]">
                  {about.education.degree}
                </h2>
                <p className="text-sm text-[#52525B]">
                  {about.education.university} &middot; {about.education.duration}
                </p>
                <div className="pt-2 space-y-2 border-t border-[#E6E4DF]">
                  <p className="text-xs font-medium text-[#71717A]">Recent Roles</p>
                  {experiences.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="text-sm text-[#27272A]">
                      <span className="font-medium">{exp.role}</span>{' '}
                      <span className="text-[#52525B]">
                        &mdash; {exp.company}, {exp.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('experience')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E3A5F] hover:underline cursor-pointer"
                >
                  Experience Timeline
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('case-studies')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3F3F46] hover:text-[#18181B] hover:underline cursor-pointer"
                >
                  Case Studies
                  <ExternalLink size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
