/**
 * dashboardState.js
 * 
 * Central data model matching every field currently rendered in CommandCenter.jsx.
 * This is the initial "seed" state. The simulator will produce incremental
 * mutations of this shape.
 */

export function createInitialDashboardState() {
  return {
    // ── Row 1: P&L Strip ──────────────────────────────────────────
    todaysRevenue: {
      value: 845200,
      changePercent: 5.2,
    },
    todaysExpenses: {
      value: 612400,
      label: 'Estimated (Staffing + Consumables)',
    },
    // Derived: value = todaysRevenue.value - todaysExpenses.value
    netPnL: {
      value: 232800,
      changePercent: 12.4,
    },

    // ── Row 2: Money Inflow Breakdown ─────────────────────────────
    patientDirectPayments: {
      value: 185944,
      percentOfInflow: 22,
    },
    insuranceTPA: {
      value: 659256,
      percentOfInflow: 78,
    },
    pendingClaims: {
      value: 4250000,
    },
    claimDenialsToday: {
      value: 18400,
      count: 14,
    },

    // ── Row 3: Revenue Performance ────────────────────────────────
    revenueByDept: [
      { name: 'Cardiology', revenue: 240000 },
      { name: 'Orthopedics', revenue: 190000 },
      { name: 'Oncology', revenue: 150000 },
      { name: 'Surgery', revenue: 110000 },
      { name: 'Emergency', revenue: 80000 },
    ],

    payerMix: [
      { name: 'Private Insurance', value: 55, color: '#2563eb' },
      { name: 'Self-Pay', value: 25, color: '#10b981' },
      { name: 'Govt Scheme', value: 20, color: '#f59e0b' },
    ],

    mtdRevenue: {
      value: 18500000,
      target: 25000000,
      percent: 74,
    },

    // ── Row 4: Critical Business Alerts ───────────────────────────
    daysInAR: {
      value: 52,
      previousValue: 48,
    },
    claimDenialRate: {
      value: 6.2,
      target: 5.0,
    },

    correlationData: [
      { day: 'Mon', occ: 82, rev: 800 },
      { day: 'Tue', occ: 85, rev: 840 },
      { day: 'Wed', occ: 88, rev: 860 },
      { day: 'Thu', occ: 90, rev: 890 },
      { day: 'Fri', occ: 92, rev: 810 },
      { day: 'Sat', occ: 90, rev: 780 },
      { day: 'Sun', occ: 85, rev: 750 },
    ],

    // Alert items — rebuilt by alertEngine after each update
    revenueRisks: [
      {
        severity: 'amber',
        icon: 'alert',
        text: 'ICU at 60% occupancy (Lost margin)',
      },
      {
        severity: 'red',
        icon: 'alert',
        text: '5 high-value claims denied by BlueCross',
      },
      {
        severity: 'amber',
        icon: 'trending-down',
        text: 'Orthopedics revenue down 15% WoW',
      },
    ],

    // ── Meta ──────────────────────────────────────────────────────
    _lastUpdate: Date.now(),
    _tickCount: 0,
  };
}
