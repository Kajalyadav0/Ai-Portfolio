import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PortfolioData } from './src/types/portfolio';
import { validateContactInput } from './src/utils/portfolioLogic';
import {
  addMessage,
  claimAdminPasscode,
  deleteMessage,
  ensureDirectories,
  getAuthStatus,
  issueSessionToken,
  readMessages,
  readPortfolio,
  resetPortfolio,
  resolveSafeUploadPath,
  savePortfolio,
  saveUploadedFile,
  verifyAdminPasscode,
  verifySessionToken,
} from './server/store';

dotenv.config();
ensureDirectories();

const PORT = Number(process.env.PORT || 3000);

function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice(7).trim();
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Please sign in to the Admin area.' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Public portfolio data
  app.get('/api/portfolio', (_req, res) => {
    const data = readPortfolio();
    res.json(data);
  });

  // Contact form persistence
  app.post('/api/contact', (req, res) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const input = {
      name: typeof body.name === 'string' ? body.name : '',
      email: typeof body.email === 'string' ? body.email : '',
      subject: typeof body.subject === 'string' ? body.subject : '',
      message: typeof body.message === 'string' ? body.message : '',
    };
    const validation = validateContactInput(input);
    if (!validation.valid) {
      res.status(400).json({ error: 'Please complete all required fields.', errors: validation.errors });
      return;
    }
    const saved = addMessage(input);
    res.status(201).json({
      ok: true,
      id: saved.id,
      note: 'Inquiry saved in the portfolio inbox. Direct email notification requires SMTP setup, so you may also reach out directly via email or phone.',
    });
  });

  // Safe static serving for uploaded images & resume PDF
  app.get('/uploads/:bucket/:filename', (req, res) => {
    const resolved = resolveSafeUploadPath(req.params.bucket, req.params.filename);
    if (!resolved) {
      res.status(404).json({ error: 'File not found.' });
      return;
    }
    if (req.params.bucket === 'resume' && req.query.download === '1') {
      res.download(resolved, 'Kajal_Yadav_Resume.pdf');
      return;
    }
    res.sendFile(resolved);
  });

  // Admin auth status
  app.get('/api/admin/status', (req, res) => {
    const status = getAuthStatus();
    const authenticated = verifySessionToken(extractBearerToken(req));
    res.json({
      ...status,
      authenticated,
    });
  });

  // First-run passcode claim
  app.post('/api/admin/claim', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    const result = claimAdminPasscode(passcode);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    const token = issueSessionToken();
    res.json({ ok: true, token });
  });

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const status = getAuthStatus();
    if (!status.configured) {
      res.status(400).json({ error: 'Admin passcode is not configured yet.' });
      return;
    }
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (!verifyAdminPasscode(passcode)) {
      res.status(401).json({ error: 'Incorrect passcode.' });
      return;
    }
    const token = issueSessionToken();
    res.json({ ok: true, token });
  });

  // Protected admin endpoints
  app.put('/api/admin/portfolio', requireAdminAuth, (req, res) => {
    const body = req.body as PortfolioData | undefined;
    if (!body || typeof body !== 'object' || !body.profile || !Array.isArray(body.experiences)) {
      res.status(400).json({ error: 'Invalid portfolio payload.' });
      return;
    }
    const saved = savePortfolio(body);
    res.json(saved);
  });

  app.post('/api/admin/reset', requireAdminAuth, (_req, res) => {
    const fresh = resetPortfolio();
    res.json(fresh);
  });

  app.post('/api/admin/upload', requireAdminAuth, (req, res) => {
    const purpose = req.body?.purpose === 'resume' ? 'resume' : 'image';
    const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : '';
    const base64Data = typeof req.body?.base64Data === 'string' ? req.body.base64Data : '';
    const originalName =
      typeof req.body?.originalName === 'string' ? req.body.originalName : undefined;

    const result = saveUploadedFile({ purpose, mimeType, base64Data, originalName });
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json(result);
  });

  app.get('/api/admin/messages', requireAdminAuth, (_req, res) => {
    res.json(readMessages());
  });

  app.delete('/api/admin/messages/:id', requireAdminAuth, (req, res) => {
    const removed = deleteMessage(req.params.id);
    if (!removed) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }
    res.json({ ok: true });
  });

  // Frontend middleware / static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
