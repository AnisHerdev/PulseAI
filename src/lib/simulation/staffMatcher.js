/**
 * staffMatcher.js
 *
 * Normalized grep-style matching of staff names/aliases against review
 * feedback text.  Runs on both high (≥4★) and low/mid (≤3★) reviews
 * to produce a staff feedback mention report.
 *
 * Matching rules:
 * - Lowercase + strip punctuation
 * - Match full name first (e.g. "dr ananya sharma")
 * - Match multi-token aliases (e.g. "dr sharma")
 * - Single-token aliases only match if >= 4 characters (to avoid false positives)
 * - Deduplicate: each staff member counted at most once per review
 */

import { STAFF_INDEX } from './staffIndex.js';

// ── Preprocessing ────────────────────────────────────────────────────────────

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Build a search index from the staff roster.
 * Each entry becomes a list of normalised search phrases.
 */
function buildSearchPhrases(staff) {
  const fullName = normalize(staff.name);
  const phrases = [fullName];

  for (const alias of staff.aliases || []) {
    const norm = normalize(alias);
    // Single-token aliases only if >= 4 chars (avoid "lee" false positives)
    if (!norm.includes(' ') && norm.length < 4) continue;
    if (!phrases.includes(norm)) phrases.push(norm);
  }

  return phrases;
}

const STAFF_SEARCH_INDEX = STAFF_INDEX.map((s) => ({
  ...s,
  _phrases: buildSearchPhrases(s),
}));

// ── Matching ─────────────────────────────────────────────────────────────────

/**
 * Find all staff members mentioned in a feedback text.
 * Returns array of staff IDs mentioned (deduplicated).
 */
export function findMentions(feedbackText) {
  const normText = normalize(feedbackText);
  const mentioned = new Set();

  for (const staff of STAFF_SEARCH_INDEX) {
    for (const phrase of staff._phrases) {
      if (normText.includes(phrase)) {
        mentioned.add(staff.id);
        break; // found this staff, move to next
      }
    }
  }

  return [...mentioned];
}

/**
 * Process a batch of reviews and build the staff feedback mention report.
 *
 * @param {Array} reviews — all reviews (both high and low/mid)
 * @returns {Array} staff_reports — one entry per staff member who was mentioned
 */
export function buildStaffMentionReport(reviews) {
  // Accumulator per staff ID
  const staffData = {};

  for (const review of reviews) {
    const mentionedIds = findMentions(review.feedback_text);

    for (const staffId of mentionedIds) {
      if (!staffData[staffId]) {
        const staffRecord = STAFF_INDEX.find((s) => s.id === staffId);
        staffData[staffId] = {
          staff_id: staffId,
          name: staffRecord?.name || staffId,
          role: staffRecord?.role || '',
          department: staffRecord?.department || '',
          positive_mentions: 0,
          negative_mentions: 0,
          _ratings: [],
          recent_positive_examples: [],
          recent_negative_examples: [],
        };
      }

      const entry = staffData[staffId];
      entry._ratings.push(review.rating);

      if (review.rating >= 4) {
        entry.positive_mentions += 1;
        if (entry.recent_positive_examples.length < 3) {
          entry.recent_positive_examples.push({
            rating: review.rating,
            excerpt: (review.feedback_text || '').slice(0, 120),
            department: review.department,
            timestamp: review.timestamp,
          });
        }
      } else {
        entry.negative_mentions += 1;
        if (entry.recent_negative_examples.length < 3) {
          entry.recent_negative_examples.push({
            rating: review.rating,
            excerpt: (review.feedback_text || '').slice(0, 120),
            department: review.department,
            timestamp: review.timestamp,
          });
        }
      }
    }
  }

  // Compute averages and signals
  const reports = Object.values(staffData).map((entry) => {
    const avgRating = entry._ratings.length > 0
      ? parseFloat((entry._ratings.reduce((s, r) => s + r, 0) / entry._ratings.length).toFixed(2))
      : 0;

    let signal = 'Normal';
    if (entry.negative_mentions >= 3 && avgRating <= 3) {
      signal = 'Review Needed';
    } else if (entry.positive_mentions >= 5 && entry.negative_mentions <= 1) {
      signal = 'Strong Positive Signal';
    }

    return {
      staff_id: entry.staff_id,
      name: entry.name,
      role: entry.role,
      department: entry.department,
      positive_mentions: entry.positive_mentions,
      negative_mentions: entry.negative_mentions,
      average_rating_when_mentioned: avgRating,
      recent_positive_examples: entry.recent_positive_examples,
      recent_negative_examples: entry.recent_negative_examples,
      signal,
    };
  });

  // Sort: "Review Needed" first, then by total mentions descending
  const signalOrder = { 'Review Needed': 0, 'Normal': 1, 'Strong Positive Signal': 2 };
  reports.sort((a, b) => {
    const so = (signalOrder[a.signal] ?? 1) - (signalOrder[b.signal] ?? 1);
    if (so !== 0) return so;
    return (b.positive_mentions + b.negative_mentions) - (a.positive_mentions + a.negative_mentions);
  });

  return reports;
}
