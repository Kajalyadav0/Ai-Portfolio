import { useEffect, useState } from 'react';
import { AboutView } from './components/AboutView';
import { AdminView } from './components/AdminView';
import { AiAutomationView } from './components/AiAutomationView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { ContactResumeView } from './components/ContactResumeView';
import { DigitalMarketingView } from './components/DigitalMarketingView';
import { ExperienceView } from './components/ExperienceView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { SocialMediaView } from './components/SocialMediaView';
import { WebsitesView } from './components/WebsitesView';
import { DEFAULT_PORTFOLIO_DATA } from './data/defaultPortfolio';
import { PortfolioData, PortfolioPageId } from './types/portfolio';

const VALID_PAGES: PortfolioPageId[] = [
  'home',
  'about',
  'experience',
  'social-media',
  'digital-marketing',
  'websites',
  'ai-automation',
  'case-studies',
  'contact',
  'admin',
];

function getInitialPage(): PortfolioPageId {
  const hash = window.location.hash.replace(/^#\/?/, '').trim() as PortfolioPageId;
  if (VALID_PAGES.includes(hash)) return hash;
  const pathSegment = window.location.pathname
    .replace(/^\/+/, '')
    .split('/')[0] as PortfolioPageId;
  if (VALID_PAGES.includes(pathSegment)) return pathSegment;
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PortfolioPageId>(getInitialPage);
  const [portfolio, setPortfolio] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = (await res.json()) as PortfolioData;
          setPortfolio(data);
        }
      } catch {
        // Fallback smoothly to default data if offline
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page: PortfolioPageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18181B]">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        brandName={portfolio.profile.name}
      />

      <main className="flex-1" data-loading={loading ? 'true' : 'false'}>
        {currentPage === 'home' && <HomeView data={portfolio} onNavigate={navigate} />}
        {currentPage === 'about' && (
          <AboutView
            profile={portfolio.profile}
            about={portfolio.about}
            skills={portfolio.skills}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'experience' && (
          <ExperienceView experiences={portfolio.experiences} onNavigate={navigate} />
        )}
        {currentPage === 'social-media' && (
          <SocialMediaView items={portfolio.socialMedia} />
        )}
        {currentPage === 'digital-marketing' && (
          <DigitalMarketingView data={portfolio.digitalMarketing} onNavigate={navigate} />
        )}
        {currentPage === 'websites' && <WebsitesView websites={portfolio.websites} />}
        {currentPage === 'ai-automation' && (
          <AiAutomationView data={portfolio.aiAutomation} />
        )}
        {currentPage === 'case-studies' && (
          <CaseStudiesView caseStudies={portfolio.caseStudies} />
        )}
        {currentPage === 'contact' && (
          <ContactResumeView
            profile={portfolio.profile}
            about={portfolio.about}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'admin' && (
          <AdminView
            data={portfolio}
            onDataSaved={setPortfolio}
            onNavigate={navigate}
          />
        )}
      </main>

      <Footer profile={portfolio.profile} onNavigate={navigate} />
    </div>
  );
}
