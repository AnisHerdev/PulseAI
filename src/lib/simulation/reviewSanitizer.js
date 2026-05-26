/**
 * reviewSanitizer.js
 *
 * Strips PII from patient feedback text before sending to the LLM.
 * Removes: names, phone numbers, emails, IDs, addresses, diagnosis details.
 */

// ── PII regex patterns ──────────────────────────────────────────────────────

const PATTERNS = [
  // Email addresses
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL]' },

  // Phone numbers (various formats)
  { regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, replacement: '[PHONE]' },

  // Indian Aadhaar-like numbers (12 digits with optional spaces)
  { regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[ID]' },

  // Generic IDs (MRN, Patient ID patterns)
  { regex: /\b(?:MRN|ID|Patient\s*ID|Case\s*#?|Ref)\s*[:#]?\s*[A-Z0-9-]{4,}/gi, replacement: '[ID]' },

  // Addresses (patterns with pin/zip codes)
  { regex: /\b\d{1,5}\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Colony|Nagar|Marg)\b[^.]*\d{5,6}\b/gi, replacement: '[ADDRESS]' },

  // Zip/PIN codes (standalone)
  { regex: /\b(?:PIN|ZIP)\s*[:#]?\s*\d{5,6}\b/gi, replacement: '[POSTAL_CODE]' },

  // Diagnosis-specific medical codes (ICD-like)
  { regex: /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g, replacement: '[CODE]' },

  // SSN-like patterns
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN]' },
];

// Common first-name patterns that might be patient names in reviews
// We DON'T strip doctor/nurse names since those are intentional mentions
// that the staff matcher needs. We only strip "my name is X" patterns.
const SELF_NAME_PATTERN = /\b(?:my name is|I am|I'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;

/**
 * Sanitise a single feedback text string.
 * @param {string} text — raw feedback text
 * @returns {string} sanitised text
 */
export function sanitizeFeedback(text) {
  if (!text || typeof text !== 'string') return '';

  let clean = text;

  // Remove self-identifying name patterns
  clean = clean.replace(SELF_NAME_PATTERN, '[PATIENT]');

  // Apply PII regex patterns
  for (const { regex, replacement } of PATTERNS) {
    clean = clean.replace(regex, replacement);
  }

  return clean;
}

/**
 * Sanitise an array of review objects (mutates feedback_text).
 * Returns new array with sanitised copies.
 */
export function sanitizeReviews(reviews) {
  return reviews.map((r) => ({
    ...r,
    feedback_text: sanitizeFeedback(r.feedback_text),
  }));
}

/**
 * Truncate feedback text to maxLen characters.
 */
export function truncateFeedback(text, maxLen = 300) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}
