/**
 * snapshotBuilder.js
 *
 * Builds a compact snapshot from the full dashboard state for the LLM.
 * 
 * Rules:
 * - Only include fields visible on the dashboard or used for alerts.
 * - Summarise chart/table arrays instead of dumping raw data.
 * - Limit alerts to top 8, dept rows to top 5.
 * - Never include patient-identifiable information.
 * - Never include raw doctor roster.
 * - Prefer aggregates over raw records.
 */

/**
 * Build a compact dashboard snapshot for LLM consumption.
 * @param {object} state — full dashboard state
 * @param {Array}  alerts — current alerts from alertEngine
 * @returns {object} compact snapshot (safe to JSON-serialise and send to LLM)
 */
export function buildDashboardSnapshot(state, alerts = []) {
  // Top departments by revenue (max 5)
  const topDepts = [...state.revenueByDept]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((d) => ({ department: d.name, revenue: d.revenue }));

  // Payer mix as a compact string summary
  const payerSummary = state.payerMix
    .map((p) => `${p.name}: ${p.value}%`)
    .join(', ');

  // Correlation data summary (latest day + trend)
  const corrLatest = state.correlationData[state.correlationData.length - 1];
  const corrFirst = state.correlationData[0];
  const occTrend = corrLatest && corrFirst
    ? corrLatest.occ - corrFirst.occ
    : 0;
  const revTrend = corrLatest && corrFirst
    ? corrLatest.rev - corrFirst.rev
    : 0;

  return {
    // P&L
    todaysRevenue: formatCurrency(state.todaysRevenue.value),
    revenueChangePercent: state.todaysRevenue.changePercent,
    todaysExpenses: formatCurrency(state.todaysExpenses.value),
    netPnL: formatCurrency(state.netPnL.value),
    netPnLPositive: state.netPnL.value >= 0,

    // Inflow
    patientDirectPayments: formatCurrency(state.patientDirectPayments.value),
    patientDirectPct: state.patientDirectPayments.percentOfInflow,
    insuranceTPA: formatCurrency(state.insuranceTPA.value),
    insuranceTPAPct: state.insuranceTPA.percentOfInflow,
    pendingClaims: formatCurrency(state.pendingClaims.value),
    claimDenialsToday: {
      amount: formatCurrency(state.claimDenialsToday.value),
      count: state.claimDenialsToday.count,
    },

    // Revenue performance
    topDepartmentRevenue: topDepts,
    payerMix: payerSummary,
    mtdRevenue: formatCurrency(state.mtdRevenue.value),
    mtdTarget: formatCurrency(state.mtdRevenue.target),
    mtdPercent: state.mtdRevenue.percent,

    // Operational
    daysInAR: state.daysInAR.value,
    daysInARPrevious: state.daysInAR.previousValue,
    claimDenialRateMTD: state.claimDenialRate.value,
    claimDenialRateTarget: state.claimDenialRate.target,

    // Correlation trend
    occupancyTrend7d: occTrend > 0 ? 'rising' : occTrend < 0 ? 'falling' : 'flat',
    revenueTrend7d: revTrend > 0 ? 'rising' : revTrend < 0 ? 'falling' : 'flat',
    divergenceDetected: (occTrend > 0 && revTrend < 0) || (occTrend < 0 && revTrend > 0),

    // Alerts (max 8)
    activeAlerts: alerts.slice(0, 8).map((a) => ({
      severity: a.severity,
      message: a.text,
    })),
    criticalAlertCount: alerts.filter((a) => a.severity === 'red').length,
    warningAlertCount: alerts.filter((a) => a.severity === 'amber').length,

    // Timestamp
    snapshotTimestamp: new Date().toISOString(),
  };
}

/**
 * Build a compact review snapshot for LLM consumption.
 * @param {Array} recentLowMidReviews — sanitised low/mid reviews (max 20)
 * @param {object} aggregates — { totalReviews, ratingCounts, departmentCounts }
 * @returns {object} compact snapshot
 */
export function buildReviewSnapshot(recentLowMidReviews = [], aggregates = {}) {
  return {
    lowMidReviewCount: recentLowMidReviews.length,
    reviews: recentLowMidReviews.slice(0, 20).map((r) => ({
      rating: r.rating,
      department: r.department,
      visitType: r.visit_type,
      feedback: (r.feedback_text || '').slice(0, 300),
      timestamp: r.timestamp,
    })),
    ratingCounts: aggregates.ratingCounts || {},
    departmentCounts: aggregates.departmentCounts || {},
    snapshotTimestamp: new Date().toISOString(),
  };
}

// ── Helpers ──

function formatCurrency(value) {
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US')}`;
}
