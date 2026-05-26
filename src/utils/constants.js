// Unified ground-truth financial data for PulseAI CEO Dashboard

export const TODAY_METRICS = {
  revenue: 845200,
  revenueDiff: '+5.2%',
  expenses: 612400,
  expensesEstimate: 'Staffing + Consumables',
  netPL: 232800,
  netPLDiff: '+12.4%',
  directPayments: 185944,
  directPaymentsPct: '22%',
  insurancePayments: 659256,
  insurancePaymentsPct: '78%',
  pendingClaims: 4250000,
  claimDenialsToday: 18400,
  claimDenialsCount: 14,
};

export const REVENUE_BY_DEPT = [
  { name: 'Cardiology', revenue: 240000 },
  { name: 'Orthopedics', revenue: 190000 },
  { name: 'Oncology', revenue: 150000 },
  { name: 'Surgery', revenue: 110000 },
  { name: 'Emergency', revenue: 80000 },
];

export const PAYER_MIX = [
  { name: 'Private Insurance', value: 55, color: '#2563eb' },
  { name: 'Self-Pay', value: 25, color: '#10b981' },
  { name: 'Govt Scheme', value: 20, color: '#f59e0b' },
];

// Financial data values are scaled: value * 100 equals the dollar amount in the tooltip.
// e.g. revenue 8452 * 100 = $845,200.
// This allows rendering charts with compact numbers (on Y axis) while tooltip shows full formatted dollars.

export const FINANCIAL_DATA_7D = [
  { day: 'Wed', revenue: 7600, savings: 2200, expenses: -5400, fullDate: 'Wednesday, 20 May 2026' },
  { day: 'Thu', revenue: 7800, savings: 2300, expenses: -5500, fullDate: 'Thursday, 21 May 2026' },
  { day: 'Fri', revenue: 8100, savings: 2200, expenses: -5900, fullDate: 'Friday, 22 May 2026' },
  { day: 'Sat', revenue: 7200, savings: 2200, expenses: -5000, fullDate: 'Saturday, 23 May 2026' },
  { day: 'Sun', revenue: 6900, savings: 2100, expenses: -4800, fullDate: 'Sunday, 24 May 2026' },
  { day: 'Mon', revenue: 8200, savings: 2300, expenses: -5900, fullDate: 'Monday, 25 May 2026' },
  { day: 'Tue', revenue: 8452, savings: 2328, expenses: -6124, fullDate: 'Tuesday, 26 May 2026' }, // Today
];

export const FINANCIAL_DATA_30D = [
  { day: '27 Apr', revenue: 7100, savings: 2000, expenses: -5100, fullDate: 'Monday, 27 Apr 2026' },
  { day: '28 Apr', revenue: 7300, savings: 2100, expenses: -5200, fullDate: 'Tuesday, 28 Apr 2026' },
  { day: '29 Apr', revenue: 7400, savings: 2200, expenses: -5200, fullDate: 'Wednesday, 29 Apr 2026' },
  { day: '30 Apr', revenue: 7500, savings: 2000, expenses: -5500, fullDate: 'Thursday, 30 Apr 2026' },
  { day: '01 May', revenue: 7800, savings: 2300, expenses: -5500, fullDate: 'Friday, 1 May 2026' },
  { day: '02 May', revenue: 6500, savings: 1800, expenses: -4700, fullDate: 'Saturday, 2 May 2026' },
  { day: '03 May', revenue: 6200, savings: 1700, expenses: -4500, fullDate: 'Sunday, 3 May 2026' },
  { day: '04 May', revenue: 7600, savings: 2200, expenses: -5400, fullDate: 'Monday, 4 May 2026' },
  { day: '05 May', revenue: 7700, savings: 2100, expenses: -5600, fullDate: 'Tuesday, 5 May 2026' },
  { day: '06 May', revenue: 7900, savings: 2300, expenses: -5600, fullDate: 'Wednesday, 6 May 2026' },
  { day: '07 May', revenue: 8000, savings: 2400, expenses: -5600, fullDate: 'Thursday, 7 May 2026' },
  { day: '08 May', revenue: 8300, savings: 2300, expenses: -6000, fullDate: 'Friday, 8 May 2026' },
  { day: '09 May', revenue: 6900, savings: 1900, expenses: -5000, fullDate: 'Saturday, 9 May 2026' },
  { day: '10 May', revenue: 6400, savings: 1800, expenses: -4600, fullDate: 'Sunday, 10 May 2026' },
  { day: '11 May', revenue: 7800, savings: 2200, expenses: -5600, fullDate: 'Monday, 11 May 2026' },
  { day: '12 May', revenue: 7900, savings: 2300, expenses: -5600, fullDate: 'Tuesday, 12 May 2026' },
  { day: '13 May', revenue: 8100, savings: 2400, expenses: -5700, fullDate: 'Wednesday, 13 May 2026' },
  { day: '14 May', revenue: 8200, savings: 2500, expenses: -5700, fullDate: 'Thursday, 14 May 2026' },
  { day: '15 May', revenue: 8500, savings: 2400, expenses: -6100, fullDate: 'Friday, 15 May 2026' },
  { day: '16 May', revenue: 7000, savings: 2000, expenses: -5000, fullDate: 'Saturday, 16 May 2026' },
  { day: '17 May', revenue: 6700, savings: 1900, expenses: -4800, fullDate: 'Sunday, 17 May 2026' },
  { day: '18 May', revenue: 8000, savings: 2300, expenses: -5700, fullDate: 'Monday, 18 May 2026' },
  { day: '19 May', revenue: 8100, savings: 2200, expenses: -5900, fullDate: 'Tuesday, 19 May 2026' },
  // Last 7 days align with FINANCIAL_DATA_7D
  { day: '20 May', revenue: 7600, savings: 2200, expenses: -5400, fullDate: 'Wednesday, 20 May 2026' },
  { day: '21 May', revenue: 7800, savings: 2300, expenses: -5500, fullDate: 'Thursday, 21 May 2026' },
  { day: '22 May', revenue: 8100, savings: 2200, expenses: -5900, fullDate: 'Friday, 22 May 2026' },
  { day: '23 May', revenue: 7200, savings: 2200, expenses: -5000, fullDate: 'Saturday, 23 May 2026' },
  { day: '24 May', revenue: 6900, savings: 2100, expenses: -4800, fullDate: 'Sunday, 24 May 2026' },
  { day: '25 May', revenue: 8200, savings: 2300, expenses: -5900, fullDate: 'Monday, 25 May 2026' },
  { day: '26 May', revenue: 8452, savings: 2328, expenses: -6124, fullDate: 'Tuesday, 26 May 2026' }, // Today
];

export const CASH_FLOW_PROJECTION = [
  { date: '27 May', amount: 12000000, fullDate: 'Wednesday, 27 May 2026 (Projected)' },
  { date: '31 May', amount: 12500000, fullDate: 'Sunday, 31 May 2026 (Projected)' },
  { date: '05 Jun', amount: 12200000, fullDate: 'Friday, 5 Jun 2026 (Projected)' },
  { date: '10 Jun', amount: 13800000, fullDate: 'Wednesday, 10 Jun 2026 (Projected)' },
  { date: '15 Jun', amount: 14100000, fullDate: 'Monday, 15 Jun 2026 (Projected)' },
  { date: '20 Jun', amount: 14900000, fullDate: 'Saturday, 20 Jun 2026 (Projected)' },
  { date: '25 Jun', amount: 15600000, fullDate: 'Thursday, 25 Jun 2026 (Projected)' },
];
