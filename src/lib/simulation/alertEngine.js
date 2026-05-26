/**
 * alertEngine.js
 *
 * Recalculates the `revenueRisks` alert list after every dashboard state
 * update.  Thresholds are derived from the field semantics visible in
 * the existing CommandCenter.jsx UI.
 */

/**
 * Severity enum used in the alert objects.
 * 'red'   = Critical
 * 'amber' = Warning
 * 'green' = Normal (rarely emitted as an alert)
 */

const INITIAL_DEPT_REVENUES = {
  Cardiology: 240000,
  Orthopedics: 190000,
  Oncology: 150000,
  Surgery: 110000,
  Emergency: 80000,
};

/**
 * Rebuild the revenue-risk alerts from the current state.
 * Returns an array of { severity, icon, text } objects (max 8).
 */
export function recalculateAlerts(state) {
  const alerts = [];

  // 1. Claim denial rate exceeds target
  if (state.claimDenialRate.value > state.claimDenialRate.target + 2) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `Claim denial rate at ${state.claimDenialRate.value.toFixed(1)}% — well above ${state.claimDenialRate.target}% target`,
    });
  } else if (state.claimDenialRate.value > state.claimDenialRate.target) {
    alerts.push({
      severity: 'amber',
      icon: 'alert',
      text: `Claim denial rate at ${state.claimDenialRate.value.toFixed(1)}% — above ${state.claimDenialRate.target}% target`,
    });
  }

  // 2. Days in AR rising
  if (state.daysInAR.value > 55) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `Days in AR at ${state.daysInAR.value} — critically high`,
    });
  } else if (state.daysInAR.value > 50) {
    alerts.push({
      severity: 'amber',
      icon: 'trending-up',
      text: `Days in AR at ${state.daysInAR.value} — elevated (was ${state.daysInAR.previousValue})`,
    });
  }

  // 3. High pending claims
  if (state.pendingClaims.value > 5000000) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `Pending claims at $${(state.pendingClaims.value / 1e6).toFixed(2)}M — critical backlog`,
    });
  } else if (state.pendingClaims.value > 4000000) {
    alerts.push({
      severity: 'amber',
      icon: 'alert',
      text: `Pending claims at $${(state.pendingClaims.value / 1e6).toFixed(2)}M — elevated`,
    });
  }

  // 4. Claim denial count spiking
  if (state.claimDenialsToday.count > 20) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `${state.claimDenialsToday.count} claims denied today — investigate payer issues`,
    });
  } else if (state.claimDenialsToday.count > 12) {
    alerts.push({
      severity: 'amber',
      icon: 'alert',
      text: `${state.claimDenialsToday.count} claims denied today`,
    });
  }

  // 5. Department revenue drops vs initial baseline
  for (const dept of state.revenueByDept) {
    const baseline = INITIAL_DEPT_REVENUES[dept.name];
    if (baseline) {
      const dropPct = ((baseline - dept.revenue) / baseline) * 100;
      if (dropPct > 15) {
        alerts.push({
          severity: 'red',
          icon: 'trending-down',
          text: `${dept.name} revenue down ${dropPct.toFixed(0)}% from baseline`,
        });
      } else if (dropPct > 10) {
        alerts.push({
          severity: 'amber',
          icon: 'trending-down',
          text: `${dept.name} revenue down ${dropPct.toFixed(0)}% from baseline`,
        });
      }
    }
  }

  // 6. Occupancy-revenue divergence in correlation data
  const lastThreeDays = state.correlationData.slice(-3);
  const occTrend = lastThreeDays[2]?.occ - lastThreeDays[0]?.occ;
  const revTrend = lastThreeDays[2]?.rev - lastThreeDays[0]?.rev;
  if (occTrend > 0 && revTrend < -20) {
    alerts.push({
      severity: 'amber',
      icon: 'trending-down',
      text: 'Occupancy rising but revenue declining — possible pricing or case-mix issue',
    });
  }

  // 7. Net P&L going negative
  if (state.netPnL.value < 0) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `Net P&L is negative at -$${Math.abs(state.netPnL.value).toLocaleString()}`,
    });
  }

  // 8. MTD target at risk
  if (state.mtdRevenue.percent < 60) {
    alerts.push({
      severity: 'red',
      icon: 'alert',
      text: `MTD revenue at ${state.mtdRevenue.percent}% of target — significantly behind`,
    });
  } else if (state.mtdRevenue.percent < 70) {
    alerts.push({
      severity: 'amber',
      icon: 'trending-down',
      text: `MTD revenue at ${state.mtdRevenue.percent}% of target — slightly behind pace`,
    });
  }

  // Cap at 8 alerts, sort by severity (red first)
  const severityOrder = { red: 0, amber: 1, green: 2 };
  alerts.sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9));

  return alerts.slice(0, 8);
}

/**
 * Determine the status class for a numeric value given thresholds.
 * Used by the UI to apply status-green / status-amber / status-red.
 */
export function getStatus(value, { greenBelow, amberBelow, redAbove, inverse = false } = {}) {
  if (inverse) {
    // Lower is better (e.g., wait times, denial rate)
    if (redAbove !== undefined && value > redAbove) return 'red';
    if (amberBelow !== undefined && value > amberBelow) return 'amber';
    return 'green';
  }
  // Higher is better (e.g., utilisation)
  if (greenBelow !== undefined && value >= greenBelow) return 'green';
  if (amberBelow !== undefined && value >= amberBelow) return 'amber';
  return 'red';
}
