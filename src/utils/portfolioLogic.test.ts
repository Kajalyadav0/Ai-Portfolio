import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultPortfolio';
import {
  buildResumeDownloadUrl,
  filterSocialItems,
  getPortfolioReadiness,
  sanitizeExternalUrl,
  summarizeMetaCplRows,
  validateContactInput,
} from './portfolioLogic';

test('filterSocialItems filters accurately by platform category', () => {
  const all = filterSocialItems(DEFAULT_PORTFOLIO_DATA.socialMedia, 'All');
  assert.equal(all.length, DEFAULT_PORTFOLIO_DATA.socialMedia.length);

  const insta = filterSocialItems(DEFAULT_PORTFOLIO_DATA.socialMedia, 'Instagram');
  assert.ok(insta.length >= 1);
  assert.ok(insta.every((item) => item.platform === 'Instagram'));

  const realEstate = filterSocialItems(DEFAULT_PORTFOLIO_DATA.socialMedia, 'Real Estate');
  assert.ok(realEstate.every((item) => item.platform === 'Real Estate'));
});

test('sanitizeExternalUrl blocks unsafe schemes and preserves safe URLs and local assets', () => {
  assert.equal(sanitizeExternalUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeExternalUrl('data:text/html,<script>'), '');
  assert.equal(sanitizeExternalUrl('https://arcitech.ai/'), 'https://arcitech.ai/');
  assert.equal(sanitizeExternalUrl('/uploads/resume/cv.pdf'), '/uploads/resume/cv.pdf');
  assert.equal(sanitizeExternalUrl('/src/assets/images/test.jpg'), '/src/assets/images/test.jpg');
  assert.equal(
    sanitizeExternalUrl('/assets/aistudio/Kajal_Yadav_CVai_972ad927.pdf'),
    '/assets/aistudio/Kajal_Yadav_CVai_972ad927.pdf'
  );
});

test('buildResumeDownloadUrl appends download query only for /uploads/ paths', () => {
  assert.equal(
    buildResumeDownloadUrl('/assets/aistudio/Kajal_Yadav_CVai_972ad927.pdf'),
    '/assets/aistudio/Kajal_Yadav_CVai_972ad927.pdf'
  );
  assert.equal(
    buildResumeDownloadUrl('/uploads/resume/cv.pdf'),
    '/uploads/resume/cv.pdf?download=1'
  );
  assert.equal(buildResumeDownloadUrl('javascript:alert(1)'), '');
});

test('validateContactInput enforces all required fields honestly', () => {
  const invalid = validateContactInput({
    name: 'A',
    email: 'not-an-email',
    subject: 'Hi',
    message: 'Short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactInput({
    name: 'Riya Sharma',
    email: 'riya@example.com',
    subject: 'Marketing Role Inquiry',
    message: 'Hello Kajal, we would love to discuss a performance marketing role.',
  });
  assert.equal(valid.valid, true);
});

test('summarizeMetaCplRows computes accurate lowest CPL and highest leads from supplied data', () => {
  const meta = DEFAULT_PORTFOLIO_DATA.caseStudies[0].metaHighlights;
  assert.ok(meta);
  const summary = summarizeMetaCplRows(meta.campaigns);
  assert.equal(summary.lowestCpl?.campaignName, 'Serenity – Indore');
  assert.equal(summary.lowestCpl?.cplInr, 51.0);
  assert.equal(summary.highestLeads?.campaignName, 'Asnani Group – Bhopal');
  assert.equal(summary.highestLeads?.leads, 338);
});

test('getPortfolioReadiness accurately reflects attached resume and unconfigured LinkedIn default', () => {
  const readiness = getPortfolioReadiness(DEFAULT_PORTFOLIO_DATA);
  assert.equal(readiness.hasResume, true);
  assert.equal(readiness.hasLinkedIn, false);
  assert.equal(readiness.uploadedScreenshotsCount, 0);
});
