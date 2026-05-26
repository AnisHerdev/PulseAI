/**
 * materialChangeDetector.js
 *
 * Compares previous and current dashboard state to determine whether a
 * "material change" has occurred that justifies triggering a new LLM
 * summary.
 *
 * IMPORTANT: Does NOT hardcode KPI names.  Instead, it inspects the
 * state shape dynamically and applies heuristics based on field
 * semantics (percentage-like, count-like, status-like, alerts).
 */

/**
 * Check whether the transition from `prev` to `curr` constitutes a
 * material change.
 *
 * @param {object} prev — previous dashboard state
 * @param {object} curr — current dashboard state
 * @param {Array}  prevAlerts — previous alert list
 * @param {Array}  currAlerts — current alert list
 * @returns {{ isMaterial: boolean, reasons: string[] }}
 */
export function detectMaterialChange(prev, curr, prevAlerts = [], currAlerts = []) {
  const reasons = [];

  // 1. New critical alert appeared
  const prevCriticalTexts = new Set(
    prevAlerts.filter((a) => a.severity === 'red').map((a) => a.text)
  );
  const newCriticals = currAlerts.filter(
    (a) => a.severity === 'red' && !prevCriticalTexts.has(a.text)
  );
  if (newCriticals.length > 0) {
    reasons.push(`${newCriticals.length} new critical alert(s)`);
  }

  // 2. Alert count changed significantly (±2 or more)
  if (Math.abs(currAlerts.length - prevAlerts.length) >= 2) {
    reasons.push(`Alert count changed from ${prevAlerts.length} to ${currAlerts.length}`);
  }

  // 3. Status escalation (amber → red or normal/green → amber/red)
  const prevRedCount = prevAlerts.filter((a) => a.severity === 'red').length;
  const currRedCount = currAlerts.filter((a) => a.severity === 'red').length;
  if (currRedCount > prevRedCount) {
    reasons.push(`Critical alerts increased from ${prevRedCount} to ${currRedCount}`);
  }

  // 4. Walk all top-level state keys and compare numerics
  for (const key of Object.keys(curr)) {
    if (key.startsWith('_')) continue; // skip meta fields
    const prevVal = prev[key];
    const currVal = curr[key];

    if (prevVal == null || currVal == null) continue;

    // Compare nested objects with `.value` (most KPI cards)
    if (typeof currVal === 'object' && !Array.isArray(currVal) && 'value' in currVal) {
      const pv = prevVal.value;
      const cv = currVal.value;
      if (typeof pv === 'number' && typeof cv === 'number' && pv !== 0) {
        const changePct = Math.abs((cv - pv) / pv) * 100;

        // Percentage-like fields: material if > 5 percentage points
        if (isPercentageLikeKey(key)) {
          if (Math.abs(cv - pv) > 5) {
            reasons.push(`${key} changed by ${Math.abs(cv - pv).toFixed(1)} pp`);
          }
        }
        // Count-like fields: material if > 10% change
        else if (isCountLikeKey(key)) {
          if (changePct > 10) {
            reasons.push(`${key} changed by ${changePct.toFixed(1)}%`);
          }
        }
        // Currency/revenue-like: material if > 5% change
        else {
          if (changePct > 5) {
            reasons.push(`${key} changed by ${changePct.toFixed(1)}%`);
          }
        }
      }
    }
  }

  return {
    isMaterial: reasons.length > 0,
    reasons,
  };
}

// ── Field-type heuristics ────────────────────────────────────────────────────

const PERCENTAGE_KEYWORDS = [
  'percent', 'rate', 'pct', 'occupancy', 'utilization', 'utilisation',
  'mix', 'ratio', 'efficiency',
];

const COUNT_KEYWORDS = [
  'count', 'days', 'number', 'total', 'denials', 'claims',
];

function isPercentageLikeKey(key) {
  const lower = key.toLowerCase();
  return PERCENTAGE_KEYWORDS.some((kw) => lower.includes(kw));
}

function isCountLikeKey(key) {
  const lower = key.toLowerCase();
  return COUNT_KEYWORDS.some((kw) => lower.includes(kw));
}
