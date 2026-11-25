import React, { useState } from 'react';
import { CaseStudyItem } from '../types/portfolio';
import { summarizeMetaCplRows } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface CaseStudiesViewProps {
  caseStudies: CaseStudyItem[];
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({ caseStudies }) => {
  const [selectedId, setSelectedId] = useState<string>(caseStudies[0]?.id ?? '');
  const activeCase = caseStudies.find((c) => c.id === selectedId) ?? caseStudies[0];

  if (!activeCase) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">Featured Case Studies</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Campaign Performance, Analytics &amp; Marketing Insights
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Structured reporting case studies built strictly from supplied Meta Ads Manager and Google Analytics 4 snapshots — without fabricated ROI, spend, or attribution claims.
        </p>
      </header>

      {/* Case Study Selector Tabs */}
      <div
        role="tablist"
        aria-label="Select case study"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {caseStudies.map((cs) => {
          const active = cs.id === activeCase.id;
          return (
            <button
              key={cs.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedId(cs.id)}
              className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                active
                  ? 'border-[#1E3A5F] bg-white shadow-xs'
                  : 'border-[#E6E4DF] bg-[#F5F3EE] hover:bg-white'
              }`}
            >
              <p className="text-xs font-mono text-[#1E3A5F]">{cs.number}</p>
              <p className="font-display text-sm font-semibold text-[#18181B] mt-1 line-clamp-2">
                {cs.title}
              </p>
              <p className="text-xs text-[#71717A] mt-1 truncate">{cs.reportingPeriod}</p>
            </button>
          );
        })}
      </div>

      {/* Active Case Study Detail */}
      <article className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-10 space-y-10">
        {/* Top Metadata & Overview */}
        <div className="space-y-4 pb-8 border-b border-[#E6E4DF]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
            <span className="font-mono text-[#1E3A5F]">{activeCase.number}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{activeCase.subtitle}</span>
            <span aria-hidden="true">&middot;</span>
            <span>Period: {activeCase.reportingPeriod}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
            {activeCase.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
            <div>
              <p className="text-xs font-medium text-[#71717A]">01. Project Overview</p>
              <p className="text-sm text-[#3F3F46] leading-relaxed mt-1.5">
                {activeCase.overview}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#71717A]">02. Objective</p>
              <p className="text-sm text-[#3F3F46] leading-relaxed mt-1.5">
                {activeCase.objective}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-[#71717A]">03. My Role</p>
                <p className="text-sm text-[#3F3F46] mt-1">{activeCase.role}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#71717A]">04. Tools Used</p>
                <p className="text-sm font-medium text-[#1E3A5F] mt-1">
                  {activeCase.tools.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 05 & 06: Available Data & Visual Results */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#18181B]">
              05. Available Data &amp; 06. Visual Results
            </h3>
            <ul className="space-y-1.5 text-sm text-[#52525B]">
              {activeCase.availableDataNotes.map((note, idx) => (
                <li key={idx}>&bull; {note}</li>
              ))}
            </ul>
          </div>

          {/* Chart 1: Meta Ads CPL & Leads Comparison */}
          {activeCase.chartType === 'meta_cpl' && activeCase.metaHighlights && (
            <div className="space-y-6 rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-[#E6E4DF]">
                <div>
                  <p className="text-xs text-[#71717A]">Campaigns in Filtered View</p>
                  <p className="font-mono text-2xl font-semibold text-[#18181B] tabular-nums mt-1">
                    {activeCase.metaHighlights.totalCampaignsInView}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A]">Total Form Leads (View)</p>
                  <p className="font-mono text-2xl font-semibold text-[#18181B] tabular-nums mt-1">
                    {activeCase.metaHighlights.totalFormLeads.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A]">Average Cost Per Lead</p>
                  <p className="font-mono text-2xl font-semibold text-[#1E3A5F] tabular-nums mt-1">
                    &#8377;{activeCase.metaHighlights.averageCplInr.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-[#3F3F46]">
                  Selected Campaign Examples — Leads &amp; Cost Per Lead (INR)
                </p>
                {(() => {
                  const summary = summarizeMetaCplRows(
                    activeCase.metaHighlights.campaigns
                  );
                  const maxCpl = Math.max(
                    ...activeCase.metaHighlights.campaigns.map((c) => c.cplInr),
                    1
                  );
                  return (
                    <div className="space-y-3">
                      {summary.sortedByCplAsc.map((row) => {
                        const widthPct = Math.max(8, Math.round((row.cplInr / maxCpl) * 100));
                        return (
                          <div key={row.campaignName} className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                              <span className="font-medium text-[#18181B]">
                                {row.campaignName}
                              </span>
                              <span className="font-mono text-[#3F3F46] tabular-nums">
                                {row.leads} leads &middot; &#8377;{row.cplInr.toFixed(2)} CPL
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-[#E6E4DF] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#1E3A5F]"
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Chart 2: GA4 Traffic & Engagement Snapshot */}
          {activeCase.chartType === 'ga4_traffic' && activeCase.ga4Snapshot && (
            <div className="rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg bg-white border border-[#E6E4DF] p-4">
                  <p className="text-xs text-[#71717A]">Active Users</p>
                  <p className="font-mono text-2xl font-semibold text-[#18181B] tabular-nums mt-1">
                    {activeCase.ga4Snapshot.activeUsers}
                  </p>
                </div>
                <div className="rounded-lg bg-white border border-[#E6E4DF] p-4">
                  <p className="text-xs text-[#71717A]">New Users</p>
                  <p className="font-mono text-2xl font-semibold text-[#1E3A5F] tabular-nums mt-1">
                    {activeCase.ga4Snapshot.newUsers}
                  </p>
                </div>
                <div className="rounded-lg bg-white border border-[#E6E4DF] p-4">
                  <p className="text-xs text-[#71717A]">Avg. Engagement Time</p>
                  <p className="font-mono text-2xl font-semibold text-[#18181B] tabular-nums mt-1">
                    {activeCase.ga4Snapshot.avgEngagementTime}
                  </p>
                </div>
                <div className="rounded-lg bg-white border border-[#E6E4DF] p-4">
                  <p className="text-xs text-[#71717A]">Event Count</p>
                  <p className="font-mono text-2xl font-semibold text-[#18181B] tabular-nums mt-1">
                    {activeCase.ga4Snapshot.eventCount}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#52525B]">
                  <span>New Users Share of Active Users (63K of 71K)</span>
                  <span className="font-mono tabular-nums">~88.7%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#E6E4DF] overflow-hidden">
                  <div className="h-full bg-[#1E3A5F] rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Chart 3: GA4 Advertising Channel Attribution View */}
          {activeCase.chartType === 'ga4_channels' && activeCase.ga4Channels && (
            <div className="rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] p-5 sm:p-6 space-y-4">
              <p className="text-xs font-medium text-[#3F3F46]">
                Channels Observed in GA4 Advertising Snapshot
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeCase.ga4Channels.channels.map((ch, idx) => (
                  <div
                    key={ch}
                    className="rounded-lg bg-white border border-[#E6E4DF] p-4 space-y-1"
                  >
                    <p className="text-xs font-mono text-[#1E3A5F]">
                      Channel 0{idx + 1}
                    </p>
                    <p className="font-medium text-sm text-[#18181B]">{ch}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#71717A]">{activeCase.ga4Channels.notes}</p>
            </div>
          )}

          {/* Chart 4: Conceptual Integrated Marketing Funnel */}
          {activeCase.chartType === 'integrated_funnel' && (
            <div className="rounded-xl border border-[#E6E4DF] bg-[#FAF9F6] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-[#1E3A5F]">
                  Conceptual Marketing Funnel (Framework Visualization)
                </p>
                <span className="text-xs text-[#71717A]">
                  Conceptual model — not an individual-user tracked journey
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  'Ads & Reach',
                  'Website / Landing Page',
                  'User Engagement',
                  'Enquiries / Leads',
                  'Qualified Prospects',
                  'Business Conversion',
                ].map((stage, i) => (
                  <div
                    key={stage}
                    className="rounded-lg bg-white border border-[#E6E4DF] p-3.5 space-y-1"
                  >
                    <p className="text-[11px] font-mono text-[#1E3A5F]">Stage 0{i + 1}</p>
                    <p className="text-xs font-semibold text-[#18181B] leading-snug">
                      {stage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 07, 08, 09: Observations, Learnings, Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#F0EDE6]">
          <div className="space-y-2.5">
            <h3 className="font-display text-base font-semibold text-[#18181B]">
              07. Key Observations
            </h3>
            <ul className="space-y-2 text-sm text-[#3F3F46]">
              {activeCase.observations.map((obs, idx) => (
                <li key={idx}>&bull; {obs}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-base font-semibold text-[#18181B]">
              08. Learnings
            </h3>
            <ul className="space-y-2 text-sm text-[#3F3F46]">
              {activeCase.learnings.map((l, idx) => (
                <li key={idx}>&bull; {l}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-display text-base font-semibold text-[#18181B]">
              09. Improvement Opportunities
            </h3>
            <ul className="space-y-2 text-sm text-[#3F3F46]">
              {activeCase.improvementOpportunities.map((imp, idx) => (
                <li key={idx}>&bull; {imp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10: Original Screenshots / Upload Placeholders */}
        <div className="space-y-4 pt-4 border-t border-[#E6E4DF]">
          <h3 className="font-display text-base font-semibold text-[#18181B]">
            10. Original Screenshots &amp; Evidence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeCase.screenshots.map((shot) => (
              <div
                key={shot.id}
                className="rounded-xl border border-dashed border-[#D4D1C9] bg-[#FAF9F6] overflow-hidden"
              >
                {shot.imageUrl ? (
                  <div className="space-y-2 p-3">
                    <SafeImage
                      src={shot.imageUrl}
                      alt={shot.label}
                      className="w-full max-h-72 object-contain rounded-lg bg-white"
                      fallbackTitle={shot.label}
                    />
                    <p className="text-xs text-[#52525B] px-1">{shot.label}</p>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-1.5">
                    <p className="text-sm font-medium text-[#27272A]">{shot.label}</p>
                    <p className="text-xs text-[#71717A]">
                      No original screenshot uploaded yet. Upload your screenshot securely in Portfolio Admin.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
