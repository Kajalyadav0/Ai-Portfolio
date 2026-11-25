export type PortfolioPageId =
  | 'home'
  | 'about'
  | 'experience'
  | 'social-media'
  | 'digital-marketing'
  | 'websites'
  | 'ai-automation'
  | 'case-studies'
  | 'contact'
  | 'admin';

export type SocialPlatformCategory =
  | 'All'
  | 'Instagram'
  | 'Facebook'
  | 'Reels'
  | 'Real Estate'
  | 'Campaign Creatives';

export interface ProfileInfo {
  name: string;
  positioning: string;
  tagline: string;
  alternativeHeadline: string;
  heroHeading: string;
  heroSupportingText: string;
  portraitUrl: string;
  portraitCaption: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl: string;
  resumePdfUrl: string;
  resumeFileName: string;
}

export interface EducationInfo {
  degree: string;
  university: string;
  duration: string;
}

export interface AboutInfo {
  paragraphs: string[];
  strengths: string[];
  education: EducationInfo;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  workAreas: string[];
}

export interface SocialMediaItem {
  id: string;
  brandOrProject: string;
  industry: string;
  role: string;
  workPerformed: string;
  platform: Exclude<SocialPlatformCategory, 'All'>;
  imageUrl: string;
  liveUrl: string;
  notes: string;
}

export interface MarketingToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface RealEstateCampaignItem {
  id: string;
  projectName: string;
  location: string;
  propertyCategory: string;
  marketingObjective: string;
  campaignType: string;
  contribution: string;
  creativeUrl: string;
  optionalResults: string;
  optionalLink: string;
}

export interface DigitalMarketingInfo {
  metaAdvertising: string[];
  strategy: string[];
  analyticsReporting: string[];
  tools: MarketingToolItem[];
  realEstateCampaigns: RealEstateCampaignItem[];
}

export interface WebsiteProjectItem {
  id: string;
  name: string;
  url: string;
  industry: string;
  contribution: string;
  technologies: string[];
  description: string;
  screenshotUrl: string;
}

export interface FeaturedAiPortfolioProject {
  title: string;
  category: string;
  description: string;
  roles: string[];
  tools: string[];
  processSteps: string[];
  previewImageUrl: string;
  liveUrl: string;
}

export interface AiWebsiteItem {
  id: string;
  title: string;
  description: string;
  workflowSummary: string;
  toolsUsed: string[];
  previewImageUrl: string;
  liveUrl: string;
}

export type AutomationStatus =
  | 'Completed'
  | 'Prototype'
  | 'Experiment'
  | 'Learning Project';

export interface AiAutomationItem {
  id: string;
  title: string;
  problemAddressed: string;
  workflowExplanation: string;
  toolsUsed: string[];
  status: AutomationStatus;
  screenshotUrl: string;
  verifiedOutcome: string;
}

export interface AiMockupItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface AiToolItem {
  id: string;
  name: string;
  purpose: string;
}

export interface AiAutomationSection {
  featuredProject: FeaturedAiPortfolioProject;
  creationWorkflow: string[];
  aiWebsites: AiWebsiteItem[];
  automations: AiAutomationItem[];
  mockups: AiMockupItem[];
  marketingUses: string[];
  tools: AiToolItem[];
}

export interface MetaCampaignMetricRow {
  campaignName: string;
  leads: number;
  cplInr: number;
}

export interface CaseStudyScreenshotSlot {
  id: string;
  label: string;
  imageUrl: string;
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  reportingPeriod: string;
  overview: string;
  objective: string;
  role: string;
  tools: string[];
  availableDataNotes: string[];
  observations: string[];
  learnings: string[];
  improvementOpportunities: string[];
  screenshots: CaseStudyScreenshotSlot[];
  chartType: 'meta_cpl' | 'ga4_traffic' | 'ga4_channels' | 'integrated_funnel';
  metaHighlights?: {
    totalCampaignsInView: number;
    totalFormLeads: number;
    averageCplInr: number;
    campaigns: MetaCampaignMetricRow[];
  };
  ga4Snapshot?: {
    activeUsers: string;
    newUsers: string;
    avgEngagementTime: string;
    eventCount: string;
  };
  ga4Channels?: {
    channels: string[];
    notes: string;
  };
}

export interface SkillCategory {
  id: string;
  title: string;
  items: string[];
}

export interface PortfolioData {
  profile: ProfileInfo;
  about: AboutInfo;
  experiences: ExperienceItem[];
  socialMedia: SocialMediaItem[];
  digitalMarketing: DigitalMarketingInfo;
  websites: WebsiteProjectItem[];
  aiAutomation: AiAutomationSection;
  caseStudies: CaseStudyItem[];
  skills: SkillCategory[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
