import {
  MetaCampaignMetricRow,
  PortfolioData,
  SocialMediaItem,
  SocialPlatformCategory,
} from '../types/portfolio';

export function filterSocialItems(
  items: SocialMediaItem[],
  category: SocialPlatformCategory
): SocialMediaItem[] {
  if (category === 'All') return items;
  return items.filter((item) => item.platform === category);
}

export function sanitizeExternalUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  // Allow clean local static or uploaded paths
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/src/assets/') ||
    trimmed.startsWith('/assets/')
  ) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function buildResumeDownloadUrl(rawUrl: string): string {
  const safe = sanitizeExternalUrl(rawUrl);
  if (!safe) return '';
  if (safe.startsWith('/uploads/')) {
    return `${safe}?download=1`;
  }
  return safe;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

export function validateContactInput(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  const email = input.email.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.subject.trim() || input.subject.trim().length < 3) {
    errors.subject = 'Please add a brief subject.';
  }
  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function summarizeMetaCplRows(rows: MetaCampaignMetricRow[]): {
  lowestCpl: MetaCampaignMetricRow | null;
  highestLeads: MetaCampaignMetricRow | null;
  sortedByCplAsc: MetaCampaignMetricRow[];
} {
  if (rows.length === 0) {
    return { lowestCpl: null, highestLeads: null, sortedByCplAsc: [] };
  }
  const sortedByCplAsc = [...rows].sort((a, b) => a.cplInr - b.cplInr);
  const highestLeads = [...rows].sort((a, b) => b.leads - a.leads)[0];
  return {
    lowestCpl: sortedByCplAsc[0],
    highestLeads,
    sortedByCplAsc,
  };
}

export function getPortfolioReadiness(data: PortfolioData): {
  hasResume: boolean;
  hasLinkedIn: boolean;
  uploadedScreenshotsCount: number;
} {
  const hasResume = Boolean(sanitizeExternalUrl(data.profile.resumePdfUrl));
  const hasLinkedIn = Boolean(sanitizeExternalUrl(data.profile.linkedInUrl));
  const websiteShots = data.websites.filter((w) => Boolean(w.screenshotUrl.trim())).length;
  const caseShots = data.caseStudies.reduce(
    (acc, cs) => acc + cs.screenshots.filter((s) => Boolean(s.imageUrl.trim())).length,
    0
  );
  return {
    hasResume,
    hasLinkedIn,
    uploadedScreenshotsCount: websiteShots + caseShots,
  };
}
