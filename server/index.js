/**
 * server/index.js
 *
 * Thin Express API proxy for Groq LLM calls.
 * Keeps API keys server-side.  Two endpoints:
 *   POST /api/summary/dashboard  — executive dashboard summary
 *   POST /api/summary/reviews    — patient feedback pain-point summary
 *
 * Groq key rotation: comma-separated keys in GROQ_API_KEYS.
 * Rotates on rate-limit (429), timeout, network error, or 5xx.
 * Max 2 retries per request.
 */

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env in the same directory as this script
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '512kb' }));

// ── Configuration ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;

const GROQ_API_KEYS = (process.env.GROQ_API_KEYS || '')
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);

const GROQ_TEST_MODEL = process.env.GROQ_TEST_MODEL || 'llama-3.1-8b-instant';
const GROQ_SUMMARY_MODEL = process.env.GROQ_SUMMARY_MODEL || 'llama-3.3-70b-versatile';
const GROQ_DEFAULT_MODEL = process.env.GROQ_DEFAULT_MODEL || 'llama-3.1-8b-instant';
const GROQ_USE_70B = (process.env.GROQ_USE_70B || 'false').toLowerCase() === 'true';

let currentKeyIndex = 0;

function getActiveModel(quality = false) {
  if (quality || GROQ_USE_70B) return GROQ_SUMMARY_MODEL;
  return GROQ_DEFAULT_MODEL;
}

function getNextKey() {
  if (GROQ_API_KEYS.length === 0) return null;
  const key = GROQ_API_KEYS[currentKeyIndex % GROQ_API_KEYS.length];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;
  return key;
}

function isRetryableError(err) {
  if (!err) return false;
  const status = err.status || err.statusCode || err?.error?.status;
  if (status === 429) return true; // rate limit
  if (status >= 500) return true;  // server error
  if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') return true;
  return false;
}

async function callGroq(systemPrompt, userContent, { quality = false, maxRetries = 2 } = {}) {
  if (GROQ_API_KEYS.length === 0) {
    return { success: false, error: 'No API keys configured' };
  }

  const model = getActiveModel(quality);
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const apiKey = getNextKey();
    if (!apiKey) break;

    try {
      const client = new Groq({ apiKey });
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: typeof userContent === 'string' ? userContent : JSON.stringify(userContent) },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const text = response.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty LLM response');

      const parsed = JSON.parse(text);
      return { success: true, data: parsed, model, timestamp: new Date().toISOString() };
    } catch (err) {
      lastError = err;
      console.error(`Groq attempt ${attempt + 1} failed (key index ${currentKeyIndex}):`, err.message || err);

      if (!isRetryableError(err) && attempt > 0) break; // non-retryable after first try
      // rotate to next key and retry
    }
  }

  return {
    success: false,
    error: lastError?.message || 'All Groq API calls failed',
  };
}

// ── Dashboard Summary Endpoint ───────────────────────────────────────────────

const DASHBOARD_SYSTEM_PROMPT = `You are a hospital operations analyst. You will receive a compact dashboard snapshot. Generate a 3-5 sentence executive summary.

Rules:
- Summarise ONLY the provided data. Do NOT invent KPIs, numbers, departments, doctors, alerts, or causes.
- Mention immediate critical issues ONLY if they appear in the snapshot.
- Use a concise executive tone suitable for a hospital CEO.
- Return valid JSON with a single "summary" key.

Example output: {"summary": "Your 3-5 sentence summary here."}`;

app.post('/api/summary/dashboard', async (req, res) => {
  const snapshot = req.body?.snapshot;
  if (!snapshot) {
    return res.status(400).json({ error: 'Missing snapshot in request body' });
  }

  const quality = req.body?.quality === true;
  const result = await callGroq(DASHBOARD_SYSTEM_PROMPT, snapshot, { quality });

  if (result.success) {
    return res.json({
      summary: result.data.summary || 'Summary unavailable.',
      model: result.model,
      timestamp: result.timestamp,
    });
  }

  // Fallback
  return res.json({
    summary: 'Current status requires review. The dashboard shows active operational signals and alerts that should be checked immediately. Focus on sections marked Warning or Critical and review staffing, patient flow, and feedback indicators.',
    model: 'fallback',
    timestamp: new Date().toISOString(),
    fallback: true,
  });
});

// ── Review Summary Endpoint ──────────────────────────────────────────────────

const REVIEW_SYSTEM_PROMPT = `You are a patient experience analyst at a hospital. You will receive a batch of recent low and mid-rated patient reviews (ratings 1-3). Summarise the top recurring pain points.

Rules:
- Identify 3-5 main complaint themes from the provided reviews.
- Include specific departments mentioned if any.
- Do NOT invent issues that are not in the data.
- Use a concise professional tone.
- Return valid JSON with a single "summary" key.

Example output: {"summary": "Your 3-5 sentence pain-point summary here."}`;

app.post('/api/summary/reviews', async (req, res) => {
  const snapshot = req.body?.snapshot;
  if (!snapshot) {
    return res.status(400).json({ error: 'Missing snapshot in request body' });
  }

  const quality = req.body?.quality === true;
  const result = await callGroq(REVIEW_SYSTEM_PROMPT, snapshot, { quality });

  if (result.success) {
    return res.json({
      summary: result.data.summary || 'Summary unavailable.',
      model: result.model,
      timestamp: result.timestamp,
    });
  }

  // Fallback
  return res.json({
    summary: 'Recent low and mid-rated reviews indicate recurring operational pain points. Review wait time, billing, communication, and department-level complaint patterns. Check the feedback mentions table for repeated doctor or staff references.',
    model: 'fallback',
    timestamp: new Date().toISOString(),
    fallback: true,
  });
});

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    groqKeysConfigured: GROQ_API_KEYS.length,
    defaultModel: getActiveModel(),
    timestamp: new Date().toISOString(),
  });
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`PulseAI API server running on port ${PORT}`);
  console.log(`Groq API keys configured: ${GROQ_API_KEYS.length}`);
  console.log(`Default model: ${getActiveModel()}`);
  console.log(`70B mode: ${GROQ_USE_70B ? 'ON' : 'OFF'}`);
});
