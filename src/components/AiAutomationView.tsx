import React, { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { AiAutomationSection, AiMockupItem } from '../types/portfolio';
import { sanitizeExternalUrl } from '../utils/portfolioLogic';
import { SafeImage } from './SafeImage';

interface AiAutomationViewProps {
  data: AiAutomationSection;
}

export const AiAutomationView: React.FC<AiAutomationViewProps> = ({ data }) => {
  const [selectedMockup, setSelectedMockup] = useState<AiMockupItem | null>(null);
  const { featuredProject } = data;
  const safeFeaturedUrl = sanitizeExternalUrl(featuredProject.liveUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMockup(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Page Header */}
      <header className="space-y-4 max-w-3xl">
        <p className="text-xs font-medium text-[#1E3A5F]">AI &amp; Automation Portfolio</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Practical AI-Assisted Website Creation, Creative Production &amp; Workflow Experiments
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Exploring and applying AI-powered tools for website architecture, creative product mockups, marketing copywriting, and repeatable workflow experiments — presented transparently alongside human direction and review.
        </p>
      </header>

      {/* Featured AI Project: My Own AI-Powered Portfolio Website */}
      <section className="rounded-2xl border border-[#D4D1C9] bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 bg-[#F2F0EB] border-b lg:border-b-0 lg:border-r border-[#E6E4DF]">
            <SafeImage
              src={featuredProject.previewImageUrl}
              alt={featuredProject.title}
              className="w-full h-[300px] sm:h-[360px] lg:h-full object-cover"
              fallbackTitle={featuredProject.title}
            />
          </div>

          <div className="lg:col-span-6 p-7 sm:p-9 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
                <span className="font-medium text-[#1E3A5F]">Featured AI Project</span>
                <span aria-hidden="true">&middot;</span>
                <span>{featuredProject.category}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18181B]">
                {featuredProject.title}
              </h2>

              <p className="text-sm sm:text-base text-[#3F3F46] leading-relaxed">
                {featuredProject.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0EDE6]">
                <div>
                  <p className="text-xs font-medium text-[#71717A] mb-2">My Role</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-[#3F3F46]">
                    {featuredProject.roles.map((r, i) => (
                      <li key={i}>&bull; {r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#71717A] mb-2">Development Process</p>
                  <ul className="space-y-1 text-xs sm:text-sm text-[#52525B]">
                    {featuredProject.processSteps.map((step, i) => (
                      <li key={i}>
                        {i + 1}. {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#52525B]">
                <span className="font-medium text-[#18181B]">Tools Used:</span>{' '}
                {featuredProject.tools.join(' · ')}
              </p>
              {safeFeaturedUrl ? (
                <a
                  href={safeFeaturedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E3A5F] text-white text-xs font-medium hover:bg-[#152B47]"
                >
                  Open Live Website
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <span className="text-xs text-[#71717A]">
                  Live link editable in Portfolio Admin upon publication
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* A. AI-Assisted Website Creation */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#1E3A5F]">01. AI-Assisted Website Creation</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#18181B]">
            Prompt-Based Planning to Refined Publishing
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 rounded-2xl border border-[#E6E4DF] bg-white p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-[#18181B]">
              Practical Creation Workflow
            </h3>
            <ol className="space-y-2.5 text-sm text-[#3F3F46]">
              {data.creationWorkflow.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-[#1E3A5F] mt-0.5 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-6">
            {data.aiWebsites.map((site) => {
              const safeUrl = sanitizeExternalUrl(site.liveUrl);
              return (
                <article
                  key={site.id}
                  className="rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden grid grid-cols-1 sm:grid-cols-12"
                >
                  <div className="sm:col-span-5 bg-[#F2F0EB] border-b sm:border-b-0 sm:border-r border-[#E6E4DF]">
                    <SafeImage
                      src={site.previewImageUrl}
                      alt={site.title}
                      className="w-full h-48 sm:h-full object-cover"
                      fallbackTitle={site.title}
                    />
                  </div>
                  <div className="sm:col-span-7 p-6 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-xs text-[#71717A]">{site.toolsUsed.join(' · ')}</p>
                      <h3 className="font-display text-lg font-semibold text-[#18181B]">
                        {site.title}
                      </h3>
                      <p className="text-sm text-[#52525B] leading-relaxed">
                        {site.description}
                      </p>
                      <p className="text-xs text-[#3F3F46] pt-1">
                        {site.workflowSummary}
                      </p>
                    </div>
                    {safeUrl && (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E3A5F] hover:underline"
                      >
                        Visit Preview
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* B. AI Automation & Workflow Experiments */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-[#1E3A5F]">
            02. AI Automation &amp; Workflow Experiments
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#18181B]">
            Prototypes, Experiments &amp; Process Concepts
          </h2>
          <p className="text-sm text-[#52525B]">
            Each card clearly states its current maturity level — distinguishing learning concepts and prototypes from completed workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.automations.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#E6E4DF] bg-white p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#1E3A5F]">Status: {item.status}</span>
                  <span className="text-[#71717A]">{item.toolsUsed.join(' · ')}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#18181B]">
                  {item.title}
                </h3>
                <div className="space-y-2 text-sm text-[#52525B]">
                  <p>
                    <span className="font-medium text-[#27272A]">Problem:</span>{' '}
                    {item.problemAddressed}
                  </p>
                  <p>
                    <span className="font-medium text-[#27272A]">Workflow:</span>{' '}
                    {item.workflowExplanation}
                  </p>
                </div>
              </div>

              {item.verifiedOutcome && (
                <p className="text-xs text-[#52525B] pt-4 border-t border-[#F0EDE6]">
                  <span className="font-medium text-[#27272A]">Outcome / Note:</span>{' '}
                  {item.verifiedOutcome}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* C. AI Product Mockups & Creative Production */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#1E3A5F]">
            03. AI Product Mockups &amp; Creative Production
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#18181B]">
            Product Visuals, Packaging Concepts &amp; Ad Mockups
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.mockups.map((mockup) => (
            <article
              key={mockup.id}
              className="rounded-2xl border border-[#E6E4DF] bg-white overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-[#F2F0EB] border-b border-[#E6E4DF] overflow-hidden group">
                <SafeImage
                  src={mockup.imageUrl}
                  alt={mockup.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  fallbackTitle={mockup.title}
                />
                <button
                  type="button"
                  onClick={() => setSelectedMockup(mockup)}
                  aria-label={`Inspect ${mockup.title}`}
                  className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 text-[#18181B] border border-[#E6E4DF] flex items-center justify-center hover:bg-white cursor-pointer"
                >
                  <Maximize2 size={15} aria-hidden="true" />
                </button>
              </div>
              <div className="p-5 space-y-1.5">
                <p className="text-xs text-[#1E3A5F] font-medium">{mockup.category}</p>
                <h3 className="font-display text-base font-semibold text-[#18181B]">
                  {mockup.title}
                </h3>
                <p className="text-sm text-[#52525B]">{mockup.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* D & E. AI for Digital Marketing & AI Tools */}
      <section className="border-t border-[#E6E4DF] pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-8 space-y-4">
          <p className="text-xs font-medium text-[#1E3A5F]">04. AI for Digital Marketing</p>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#18181B]">
            Supporting Daily Marketing Execution
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#3F3F46] pt-2">
            {data.marketingUses.map((use, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-[#1E3A5F]" aria-hidden="true">
                  &bull;
                </span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[#E6E4DF] bg-[#F5F3EE] p-6 sm:p-8 space-y-4">
          <p className="text-xs font-medium text-[#1E3A5F]">05. AI Tools</p>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#18181B]">
            Active Tools
          </h2>
          <div className="space-y-3 pt-1">
            {data.tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-xl border border-[#E6E4DF] bg-white p-4 space-y-1"
              >
                <h3 className="font-display text-base font-semibold text-[#18181B]">
                  {tool.name}
                </h3>
                <p className="text-sm text-[#52525B]">{tool.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup Lightbox */}
      {selectedMockup && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={selectedMockup.title}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden border border-[#E6E4DF]">
            <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#71717A]">{selectedMockup.category}</p>
                <h3 className="font-display text-lg font-semibold text-[#18181B]">
                  {selectedMockup.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMockup(null)}
                aria-label="Close mockup preview"
                className="w-9 h-9 rounded-lg border border-[#E6E4DF] flex items-center justify-center text-[#18181B] hover:bg-[#F3F1EC] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#E6E4DF] bg-[#F2F0EB]">
                <SafeImage
                  src={selectedMockup.imageUrl}
                  alt={selectedMockup.title}
                  className="w-full max-h-[480px] object-contain"
                  fallbackTitle={selectedMockup.title}
                />
              </div>
              <p className="text-sm text-[#52525B]">{selectedMockup.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
