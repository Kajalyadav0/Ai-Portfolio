import React from 'react';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { DigitalMarketingInfo, PortfolioPageId } from '../types/portfolio';
import { sanitizeExternalUrl } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface DigitalMarketingViewProps {
  data: DigitalMarketingInfo;
  onNavigate: (page: PortfolioPageId) => void;
}

export const DigitalMarketingView: React.FC<DigitalMarketingViewProps> = ({
  data,
  onNavigate,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Header */}
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">
          Digital Marketing &amp; Performance Execution
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Meta Advertising, Strategy, Analytics &amp; Real Estate Marketing
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Hands-on campaign coordination across Meta lead generation, content planning, website analytics monitoring, and regional real estate promotions.
        </p>
      </header>

      {/* Three Disciplines */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-7 space-y-4">
          <div className="space-y-1 pb-3 border-b border-[#F0EDE6]">
            <p className="text-xs font-mono text-[#1E3A5F]">01</p>
            <h2 className="font-display text-xl font-semibold text-[#18181B]">
              Meta Advertising
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[#3F3F46]">
            {data.metaAdvertising.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#1E3A5F]" aria-hidden="true">
                  &bull;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-7 space-y-4">
          <div className="space-y-1 pb-3 border-b border-[#F0EDE6]">
            <p className="text-xs font-mono text-[#1E3A5F]">02</p>
            <h2 className="font-display text-xl font-semibold text-[#18181B]">
              Digital Marketing Strategy
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[#3F3F46]">
            {data.strategy.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#1E3A5F]" aria-hidden="true">
                  &bull;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-7 space-y-4">
          <div className="space-y-1 pb-3 border-b border-[#F0EDE6]">
            <p className="text-xs font-mono text-[#1E3A5F]">03</p>
            <h2 className="font-display text-xl font-semibold text-[#18181B]">
              Analytics &amp; Reporting
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[#3F3F46]">
            {data.analyticsReporting.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#1E3A5F]" aria-hidden="true">
                  &bull;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Marketing Tools */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#1E3A5F]">Tools Used</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181B]">
              Marketing &amp; Analytics Stack
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1E3A5F] hover:underline cursor-pointer"
          >
            See Campaign Case Studies
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.tools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-[#E6E4DF] bg-white p-5 space-y-2"
            >
              <p className="text-xs text-[#71717A]">{tool.category}</p>
              <h3 className="font-display text-base font-semibold text-[#18181B]">
                {tool.name}
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Estate Marketing Portfolio Subsection */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-[#1E3A5F]">Real Estate Marketing Portfolio</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181B]">
            Property Campaigns &amp; Builder Lead Generation
          </h2>
          <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
            Practical marketing experience across residential apartments, plotted developments, villas, and commercial properties using location-based Meta advertising and creative coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.realEstateCampaigns.map((campaign) => {
            const safeLink = sanitizeExternalUrl(campaign.optionalLink);
            return (
              <article
                key={campaign.id}
                className="rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-[#F2F0EB] border-b border-[#E6E4DF] overflow-hidden">
                  <SafeImage
                    src={campaign.creativeUrl}
                    alt={campaign.projectName}
                    className="w-full h-full object-cover"
                    fallbackTitle={campaign.projectName}
                    fallbackSubtitle="Upload campaign creative in Admin"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
                      <span className="inline-flex items-center gap-1 text-[#1E3A5F] font-medium">
                        <MapPin size={12} aria-hidden="true" />
                        {campaign.location}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{campaign.propertyCategory}</span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-[#18181B]">
                      {campaign.projectName}
                    </h3>

                    <div className="space-y-1.5 text-sm text-[#52525B]">
                      <p>
                        <span className="font-medium text-[#27272A]">Objective:</span>{' '}
                        {campaign.marketingObjective}
                      </p>
                      <p>
                        <span className="font-medium text-[#27272A]">Campaign Type:</span>{' '}
                        {campaign.campaignType}
                      </p>
                      <p>
                        <span className="font-medium text-[#27272A]">My Contribution:</span>{' '}
                        {campaign.contribution}
                      </p>
                    </div>

                    {campaign.optionalResults && (
                      <p className="text-xs text-[#71717A] pt-2 border-t border-[#F0EDE6]">
                        {campaign.optionalResults}
                      </p>
                    )}
                  </div>

                  {safeLink && (
                    <div className="pt-2">
                      <a
                        href={safeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E3A5F] hover:underline"
                      >
                        View Reference
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
