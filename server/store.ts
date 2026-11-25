import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { DEFAULT_PORTFOLIO_DATA } from '../src/data/defaultPortfolio';
import { ContactMessage, PortfolioData } from '../src/types/portfolio';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const RESUME_DIR = path.join(UPLOADS_DIR, 'resume');

const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

const SESSION_SECRET =
  process.env.SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

interface StoredAuthRecord {
  salt: string;
  hash: string;
  claimedAt: string;
}

export function ensureDirectories(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

function writeJsonAtomic(targetPath: string, payload: unknown): void {
  ensureDirectories();
  const tmpPath = `${targetPath}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.renameSync(tmpPath, targetPath);
}

export function readPortfolio(): PortfolioData {
  ensureDirectories();
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    writeJsonAtomic(PORTFOLIO_FILE, DEFAULT_PORTFOLIO_DATA);
    return structuredClone(DEFAULT_PORTFOLIO_DATA);
  }
  try {
    const raw = fs.readFileSync(PORTFOLIO_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      ...DEFAULT_PORTFOLIO_DATA,
      ...parsed,
      profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile ?? {}) },
      about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about ?? {}) },
      digitalMarketing: {
        ...DEFAULT_PORTFOLIO_DATA.digitalMarketing,
        ...(parsed.digitalMarketing ?? {}),
      },
      aiAutomation: {
        ...DEFAULT_PORTFOLIO_DATA.aiAutomation,
        ...(parsed.aiAutomation ?? {}),
        featuredProject: {
          ...DEFAULT_PORTFOLIO_DATA.aiAutomation.featuredProject,
          ...(parsed.aiAutomation?.featuredProject ?? {}),
        },
      },
    };
  } catch {
    return structuredClone(DEFAULT_PORTFOLIO_DATA);
  }
}

export function savePortfolio(nextData: PortfolioData): PortfolioData {
  writeJsonAtomic(PORTFOLIO_FILE, nextData);
  return nextData;
}

export function resetPortfolio(): PortfolioData {
  const fresh = structuredClone(DEFAULT_PORTFOLIO_DATA);
  writeJsonAtomic(PORTFOLIO_FILE, fresh);
  return fresh;
}

export function readMessages(): ContactMessage[] {
  ensureDirectories();
  if (!fs.existsSync(MESSAGES_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMessage(
  input: Omit<ContactMessage, 'id' | 'createdAt'>
): ContactMessage {
  const messages = readMessages();
  const entry: ContactMessage = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };
  messages.unshift(entry);
  writeJsonAtomic(MESSAGES_FILE, messages);
  return entry;
}

export function deleteMessage(id: string): boolean {
  const messages = readMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  writeJsonAtomic(MESSAGES_FILE, next);
  return true;
}

function getEnvPasscode(): string {
  return (process.env.ADMIN_PASSCODE || '').trim();
}

function readAuthRecord(): StoredAuthRecord | null {
  ensureDirectories();
  if (!fs.existsSync(AUTH_FILE)) return null;
  try {
    const raw = fs.readFileSync(AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoredAuthRecord;
    if (parsed && typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function getAuthStatus(): { configured: boolean; envControlled: boolean } {
  const envCode = getEnvPasscode();
  if (envCode.length > 0) {
    return { configured: true, envControlled: true };
  }
  const stored = readAuthRecord();
  return { configured: stored !== null, envControlled: false };
}

function hashPasscode(passcode: string, saltHex: string): string {
  return crypto.scryptSync(passcode, saltHex, 64).toString('hex');
}

export function claimAdminPasscode(passcode: string): { ok: boolean; error?: string } {
  const status = getAuthStatus();
  if (status.envControlled) {
    return { ok: false, error: 'Admin passcode is managed via environment secrets.' };
  }
  if (status.configured) {
    return { ok: false, error: 'Admin passcode has already been claimed.' };
  }
  const trimmed = passcode.trim();
  if (trimmed.length < 8) {
    return { ok: false, error: 'Passcode must be at least 8 characters long.' };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPasscode(trimmed, salt);
  writeJsonAtomic(AUTH_FILE, {
    salt,
    hash,
    claimedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export function verifyAdminPasscode(passcode: string): boolean {
  const envCode = getEnvPasscode();
  const candidate = passcode.trim();
  if (!candidate) return false;

  if (envCode.length > 0) {
    const a = crypto.createHash('sha256').update(candidate).digest();
    const b = crypto.createHash('sha256').update(envCode).digest();
    return crypto.timingSafeEqual(a, b);
  }

  const record = readAuthRecord();
  if (!record) return false;
  const candidateHash = Buffer.from(hashPasscode(candidate, record.salt), 'hex');
  const storedHash = Buffer.from(record.hash, 'hex');
  if (candidateHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(candidateHash, storedHash);
}

export function issueSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 12,
      nonce: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return false;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

const ALLOWED_IMAGE_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

export function saveUploadedFile(params: {
  purpose: 'image' | 'resume';
  mimeType: string;
  base64Data: string;
  originalName?: string;
}): { ok: boolean; url?: string; fileName?: string; error?: string } {
  ensureDirectories();
  const cleanBase64 = params.base64Data.includes(',')
    ? params.base64Data.split(',')[1]
    : params.base64Data;
  if (!cleanBase64) {
    return { ok: false, error: 'Empty file payload.' };
  }
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (params.purpose === 'image') {
    const ext = ALLOWED_IMAGE_MIME[params.mimeType];
    if (!ext) {
      return { ok: false, error: 'Only PNG, JPG, and WebP images are supported.' };
    }
    if (buffer.length > 5 * 1024 * 1024) {
      return { ok: false, error: 'Image size must be 5 MB or smaller.' };
    }
    const safeName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
    const resolved = path.resolve(IMAGES_DIR, safeName);
    if (!resolved.startsWith(IMAGES_DIR + path.sep)) {
      return { ok: false, error: 'Invalid upload destination.' };
    }
    fs.writeFileSync(resolved, buffer);
    return { ok: true, url: `/uploads/images/${safeName}`, fileName: safeName };
  }

  if (params.mimeType !== 'application/pdf') {
    return { ok: false, error: 'Resume must be uploaded as a PDF file.' };
  }
  if (buffer.length > 8 * 1024 * 1024) {
    return { ok: false, error: 'Resume PDF must be 8 MB or smaller.' };
  }
  const safeName = `Kajal_Yadav_Resume_${Date.now()}.pdf`;
  const resolved = path.resolve(RESUME_DIR, safeName);
  if (!resolved.startsWith(RESUME_DIR + path.sep)) {
    return { ok: false, error: 'Invalid upload destination.' };
  }
  fs.writeFileSync(resolved, buffer);
  return {
    ok: true,
    url: `/uploads/resume/${safeName}`,
    fileName: params.originalName?.trim() || safeName,
  };
}

export function resolveSafeUploadPath(
  bucket: string,
  filename: string
): string | null {
  if (bucket !== 'images' && bucket !== 'resume') return null;
  const baseDir = bucket === 'images' ? IMAGES_DIR : RESUME_DIR;
  const resolved = path.resolve(baseDir, filename);
  if (!resolved.startsWith(baseDir + path.sep)) return null;
  if (!fs.existsSync(resolved)) return null;
  return resolved;
}
