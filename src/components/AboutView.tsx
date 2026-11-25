import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { AboutInfo, PortfolioPageId, ProfileInfo, SkillCategory } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface AboutViewProps {
  profile: ProfileInfo;
  about: AboutInfo;
  skills: SkillCategory[];
  onNavigate: (page: PortfolioPageId) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  profile,
  about,
  skills,
  onNavigate,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* About Introduction */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border border-[#E6E4DF] bg-white">
            <SafeImage
              src={profile.portraitUrl}
              alt={`${profile.name} portrait`}
              className="w-full h-[380px] sm:h-[430px] object-cover object-top"
              fallbackTitle={profile.name}
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#1E3A5F]">About Me</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
              Bridging Digital Marketing, Web Implementation &amp; Practical AI
            </h1>
          </div>

          <div className="space-y-4 text-base text-[#3F3F46] leading-relaxed">
            {about.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E6E4DF] space-y-3">
            <h2 className="text-sm font-semibold text-[#18181B]">Core Focus Areas</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#52525B]">
              {about.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1E3A5F] mt-0.5" aria-hidden="true">
                    &bull;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('experience')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E3A5F] text-white text-sm font-medium hover:bg-[#152B47] transition-colors cursor-pointer"
            >
              View Experience Timeline
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#D4D1C9] bg-white text-[#18181B] text-sm font-medium hover:bg-[#F3F1EC] transition-colors cursor-pointer"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="border-t border-[#E6E4DF] pt-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-medium text-[#1E3A5F]">Education</p>
          <div className="rounded-2xl border border-[#E6E4DF] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F2F0EB] border border-[#E5E2DC] flex items-center justify-center text-[#1E3A5F] shrink-0">
                <GraduationCap size={20} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-[#18181B]">
                  {about.education.degree}
                </h2>
                <p className="text-sm text-[#52525B]">{about.education.university}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-[#1E3A5F] tabular-nums sm:text-right shrink-0">
              {about.education.duration}
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="border-t border-[#E6E4DF] pt-14 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#1E3A5F]">Capabilities &amp; Skill Set</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#18181B]">
            Skills Across Marketing, Analytics, Web &amp; AI
          </h2>
          <p className="text-sm text-[#52525B]">
            Organized by practical discipline without arbitrary percentage ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-[#E6E4DF] bg-white p-6 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-[#18181B] pb-3 border-b border-[#F0EDE6]">
                {category.title}
              </h3>
              <ul className="space-y-2 text-sm text-[#3F3F46]">
                {category.items.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="text-[#1E3A5F]" aria-hidden="true">
                      &mdash;
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
