/**
 * dashboardSimulator.js
 * 
 * Bounded random-walk engine.  Given the current dashboard state, produces the
 * next state with gradual, realistic mutations.  Three update "tiers":
 *   - GENERAL  (every 5 s): revenue, expenses, P&L, inflow cards, denial count
 *   - CHART    (every 10 s): bar/pie/line chart arrays, MTD
 *   - STAFFING (every 20 s): daysInAR, denial rate, correlation data
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a random float in [min, max). */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/** Clamp value between lo and hi. */
function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(hi, value));
}

/** Walk a currency value with upward bias. */
function walkCurrency(current, { minPct = -0.005, maxPct = 0.02, floor = 0 } = {}) {
  const factor = 1 + rand(minPct, maxPct);
  return Math.max(floor, Math.round(current * factor));
}

/** Walk a percentage value within [lo, hi]. */
function walkPercent(current, { step = 1, lo = 0, hi = 100 } = {}) {
  const delta = rand(-step, step);
  return clamp(parseFloat((current + delta).toFixed(1)), lo, hi);
}

/** Walk an integer count within bounds. */
function walkCount(current, { maxDelta = 1, lo = 0, hi = Infinity } = {}) {
  const delta = Math.round(rand(-maxDelta, maxDelta));
  return clamp(current + delta, lo, hi);
}

// ── Tier update functions ────────────────────────────────────────────────────

/**
 * GENERAL tier — runs every 5 s.
 * Mutates revenue, expenses, inflow, and denial count.
 */
export function applyGeneralTick(state) {
  const next = { ...state };

  // Revenue — upward bias
  const newRevenue = walkCurrency(state.todaysRevenue.value, { minPct: -0.003, maxPct: 0.015 });
  next.todaysRevenue = {
    ...state.todaysRevenue,
    value: newRevenue,
    changePercent: walkPercent(state.todaysRevenue.changePercent, { step: 0.3, lo: -10, hi: 25 }),
  };

  // Expenses — smaller jitter
  const newExpenses = walkCurrency(state.todaysExpenses.value, { minPct: -0.005, maxPct: 0.008 });
  next.todaysExpenses = {
    ...state.todaysExpenses,
    value: newExpenses,
  };

  // Net P&L — derived
  const netValue = next.todaysRevenue.value - next.todaysExpenses.value;
  next.netPnL = {
    value: netValue,
    changePercent: walkPercent(state.netPnL.changePercent, { step: 0.4, lo: -20, hi: 40 }),
  };

  // Patient Direct Payments & Insurance TPA — keep them adding to total revenue (roughly)
  const totalInflow = next.todaysRevenue.value;
  const directPct = walkPercent(state.patientDirectPayments.percentOfInflow, { step: 0.5, lo: 15, hi: 35 });
  const insurancePct = parseFloat((100 - directPct).toFixed(1));
  next.patientDirectPayments = {
    value: Math.round(totalInflow * directPct / 100),
    percentOfInflow: directPct,
  };
  next.insuranceTPA = {
    value: Math.round(totalInflow * insurancePct / 100),
    percentOfInflow: insurancePct,
  };

  // Pending Claims — very slow walk
  next.pendingClaims = {
    value: walkCurrency(state.pendingClaims.value, { minPct: -0.002, maxPct: 0.003 }),
  };

  // Claim Denials Today — small integer walk
  const newDenialCount = walkCount(state.claimDenialsToday.count, { maxDelta: 1, lo: 0, hi: 50 });
  next.claimDenialsToday = {
    value: walkCurrency(state.claimDenialsToday.value, { minPct: -0.01, maxPct: 0.015 }),
    count: newDenialCount,
  };

  next._lastUpdate = Date.now();
  next._tickCount = (state._tickCount || 0) + 1;

  return next;
}

/**
 * CHART tier — runs every 10 s.
 * Mutates bar chart, pie chart, line chart, and MTD values.
 */
export function applyChartTick(state) {
  const next = { ...state };

  // Revenue by department — walk each bar
  next.revenueByDept = state.revenueByDept.map((dept) => ({
    ...dept,
    revenue: walkCurrency(dept.revenue, { minPct: -0.02, maxPct: 0.03, floor: 10000 }),
  }));

  // Payer mix — walk then re-normalise to 100
  const rawMix = state.payerMix.map((seg) => ({
    ...seg,
    value: Math.max(5, seg.value + rand(-1.5, 1.5)),
  }));
  const mixTotal = rawMix.reduce((s, seg) => s + seg.value, 0);
  next.payerMix = rawMix.map((seg) => ({
    ...seg,
    value: parseFloat((seg.value / mixTotal * 100).toFixed(1)),
  }));

  // MTD Revenue — always trends upward during session
  const newMtd = walkCurrency(state.mtdRevenue.value, { minPct: 0.0005, maxPct: 0.003 });
  const newMtdPct = parseFloat((newMtd / state.mtdRevenue.target * 100).toFixed(1));
  next.mtdRevenue = {
    ...state.mtdRevenue,
    value: newMtd,
    percent: clamp(newMtdPct, 0, 100),
  };

  // Correlation data — walk occ and rev per day
  next.correlationData = state.correlationData.map((d) => ({
    ...d,
    occ: clamp(Math.round(d.occ + rand(-2, 2)), 50, 100),
    rev: clamp(Math.round(d.rev + rand(-15, 15)), 500, 1200),
  }));

  next._lastUpdate = Date.now();
  return next;
}

/**
 * STAFFING tier — runs every 20 s.
 * Mutates slowly-changing operational metrics.
 */
export function applyStaffingTick(state) {
  const next = { ...state };

  // Days in AR — very slow integer walk
  const newDaysAR = walkCount(state.daysInAR.value, { maxDelta: 1, lo: 30, hi: 80 });
  next.daysInAR = {
    value: newDaysAR,
    previousValue: state.daysInAR.value, // track drift
  };

  // Claim denial rate — slow percentage walk
  next.claimDenialRate = {
    ...state.claimDenialRate,
    value: walkPercent(state.claimDenialRate.value, { step: 0.3, lo: 1, hi: 15 }),
  };

  next._lastUpdate = Date.now();
  return next;
}
