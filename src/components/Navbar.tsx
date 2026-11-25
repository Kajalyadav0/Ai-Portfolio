import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PortfolioPageId } from '../types/portfolio';

interface NavbarProps {
  currentPage: PortfolioPageId;
  onNavigate: (page: PortfolioPageId) => void;
  brandName: string;
}

const NAV_ITEMS: { id: PortfolioPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'digital-marketing', label: 'Digital Marketing' },
  { id: 'websites', label: 'Websites' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'case-studies', label: 'Case Studies' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  brandName,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (page: PortfolioPageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="text-base sm:text-lg font-semibold tracking-tight text-[#18181B] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] rounded"
        >
          {brandName}
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] font-medium text-[#52525B]"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] rounded ${
                  active
                    ? 'text-[#1E3A5F] font-semibold'
                    : 'text-[#52525B] hover:text-[#18181B]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[1px] h-[1.5px] bg-[#1E3A5F]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('contact')}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] ${
              currentPage === 'contact'
                ? 'bg-[#152B47] text-white'
                : 'bg-[#1E3A5F] text-white hover:bg-[#152B47]'
            }`}
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E4DF] bg-white text-[#18181B] hover:bg-[#F4F2ED] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[#E6E4DF] bg-[#FAF9F6] px-4 py-4 space-y-1"
        >
          {[...NAV_ITEMS, { id: 'contact' as PortfolioPageId, label: 'Contact' }].map(
            (item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1E3A5F] text-white'
                      : 'text-[#3F3F46] hover:bg-[#EFECE6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            }
          )}
        </nav>
      )}
    </header>
  );
};
