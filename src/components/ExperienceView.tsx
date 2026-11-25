import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ExperienceItem, PortfolioPageId } from '../types/portfolio';

interface ExperienceViewProps {
  experiences: ExperienceItem[];
  onNavigate: (page: PortfolioPageId) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  experiences,
  onNavigate,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-medium text-[#1E3A5F]">Professional Timeline</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
          Work Experience
        </h1>
        <p className="text-base text-[#52525B] leading-relaxed">
          Progression from web development foundations into digital marketing, social media execution, and real estate campaign management.
        </p>
      </header>

      <div className="relative space-y-6">
        {experiences.map((exp, index) => (
          <article
            key={exp.id}
            className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-8 transition-colors hover:border-[#C9C5BC]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-5 border-b border-[#F0EDE6]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="font-mono text-[#1E3A5F]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{exp.location}</span>
                </div>
                <h2 className="font-display text-xl font-semibold text-[#18181B]">
                  {exp.role}
                </h2>
                <p className="text-sm font-medium text-[#3F3F46]">{exp.company}</p>
              </div>
              <p className="text-sm font-medium text-[#1E3A5F] tabular-nums shrink-0">
                {exp.period}
              </p>
            </div>

            <div className="pt-5">
              <p className="text-xs font-medium text-[#71717A] mb-3">Work Areas</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#3F3F46]">
                {exp.workAreas.map((area, areaIdx) => (
                  <li key={areaIdx} className="flex items-start gap-2.5">
                    <span className="text-[#1E3A5F]" aria-hidden="true">
                      &bull;
                    </span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#E6E4DF]">
        <p className="text-sm text-[#52525B]">
          Explore hands-on work across social channels, websites, and case studies.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('social-media')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] transition-colors cursor-pointer"
          >
            Social Media Work
            <ArrowRight size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D4D1C9] bg-white text-[#18181B] text-sm font-medium hover:bg-[#F3F1EC] transition-colors cursor-pointer"
          >
            Case Studies
          </button>
        </div>
      </div>
    </div>
  );
};
