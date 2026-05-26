// RCM Mock Data

export const rcmKPIs = [
  {
    id: 'total_claims',
    label: 'Total Claims Submitted',
    value: '3,842',
    raw: 3842,
    trend: '+4.2%',
    trendUp: true,
    sub: 'vs last month',
    color: 'blue',
    icon: 'FileText',
  },
  {
    id: 'approved',
    label: 'Approved Claims',
    value: '3,496',
    raw: 3496,
    trend: '+2.1%',
    trendUp: true,
    sub: '91.0% approval rate',
    color: 'green',
    icon: 'CheckCircle',
  },
  {
    id: 'pending',
    label: 'Pending Claims',
    value: '218',
    raw: 218,
    trend: '-3.4%',
    trendUp: false,
    sub: 'Avg 6.2 days pending',
    color: 'amber',
    icon: 'Clock',
  },
  {
    id: 'rejections',
    label: 'Claim Rejections',
    value: '128',
    raw: 128,
    trend: '+8.0%',
    trendUp: false,
    sub: '3.3% rejection rate',
    color: 'red',
    icon: 'XCircle',
  },
  {
    id: 'collection',
    label: 'Collection Efficiency',
    value: '87.4%',
    raw: 87.4,
    trend: '-1.2%',
    trendUp: false,
    sub: 'Target: 92%',
    color: 'amber',
    icon: 'TrendingUp',
  },
  {
    id: 'receivables',
    label: 'Outstanding Receivables',
    value: '$6.84M',
    raw: 6840000,
    trend: '+5.6%',
    trendUp: false,
    sub: '↑ Requires attention',
    color: 'red',
    icon: 'DollarSign',
  },
];

export const pipelineStages = [
  {
    id: 1,
    label: 'Patient Registration',
    count: 4210,
    amount: '$9.2M',
    pct: 100,
    color: '#2563eb',
  },
  {
    id: 2,
    label: 'Billing Generated',
    count: 4018,
    amount: '$8.8M',
    pct: 95,
    color: '#7c3aed',
  },
  {
    id: 3,
    label: 'Insurance Submitted',
    count: 3842,
    amount: '$8.1M',
    pct: 91,
    color: '#0891b2',
  },
  {
    id: 4,
    label: 'Claims Approved',
    count: 3496,
    amount: '$7.4M',
    pct: 83,
    color: '#059669',
  },
  {
    id: 5,
    label: 'Payment Received',
    count: 3201,
    amount: '$6.6M',
    pct: 76,
    color: '#10b981',
  },
];

export const claimStatusDonut = [
  { name: 'Approved', value: 91, color: '#10b981' },
  { name: 'Pending', value: 5.7, color: '#f59e0b' },
  { name: 'Rejected', value: 3.3, color: '#ef4444' },
];

export const claimsApprovalTrend = [
  { month: 'Jan', approved: 88, rejected: 12 },
  { month: 'Feb', approved: 90, rejected: 10 },
  { month: 'Mar', approved: 89, rejected: 11 },
  { month: 'Apr', approved: 92, rejected: 8 },
  { month: 'May', approved: 91, rejected: 9 },
  { month: 'Jun', approved: 87, rejected: 13 },
  { month: 'Jul', approved: 91, rejected: 9 },
];

export const denialReasons = [
  { reason: 'Missing Prior Authorization', count: 38, pct: 29.7 },
  { reason: 'Incorrect Patient Info', count: 27, pct: 21.1 },
  { reason: 'Non-Covered Service', count: 22, pct: 17.2 },
  { reason: 'Duplicate Claim', count: 18, pct: 14.1 },
  { reason: 'Coding Error (ICD/CPT)', count: 14, pct: 10.9 },
  { reason: 'Timely Filing Exceeded', count: 9, pct: 7.0 },
];

export const denialTrend = [
  { week: 'W1', denials: 18 },
  { week: 'W2', denials: 22 },
  { week: 'W3', denials: 19 },
  { week: 'W4', denials: 31 },
  { week: 'W5', denials: 28 },
  { week: 'W6', denials: 35 },
  { week: 'W7', denials: 29 },
  { week: 'W8', denials: 38 },
];

export const deptDenials = [
  { dept: 'Neurology', denials: 28, change: '+8%', status: 'critical' },
  { dept: 'Orthopedics', denials: 22, change: '+3%', status: 'warning' },
  { dept: 'Cardiology', denials: 18, change: '-2%', status: 'normal' },
  { dept: 'Emergency', denials: 31, change: '+12%', status: 'critical' },
  { dept: 'Oncology', denials: 14, change: '-5%', status: 'normal' },
  { dept: 'Pediatrics', denials: 15, change: '+1%', status: 'normal' },
];

export const arAgingData = [
  { bucket: '0–30 Days', amount: 2100000, pct: 30.7, color: '#10b981', label: '$2.1M' },
  { bucket: '31–60 Days', amount: 1800000, pct: 26.3, color: '#f59e0b', label: '$1.8M' },
  { bucket: '61–90 Days', amount: 1540000, pct: 22.5, color: '#f97316', label: '$1.54M' },
  { bucket: '90+ Days', amount: 1400000, pct: 20.5, color: '#ef4444', label: '$1.4M' },
];

export const financialAlerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'Claim Rejection Spike',
    detail: 'Emergency dept rejections up 12% this week — 31 claims denied.',
    time: '2 min ago',
  },
  {
    id: 2,
    severity: 'critical',
    title: 'Receivables Threshold Exceeded',
    detail: 'Outstanding AR above 60 days crossed $2.94M — 43% of total AR.',
    time: '8 min ago',
  },
  {
    id: 3,
    severity: 'warning',
    title: 'Delayed Insurance Approvals',
    detail: 'BlueCross avg approval time increased to 9.4 days (target: 7 days).',
    time: '15 min ago',
  },
  {
    id: 4,
    severity: 'warning',
    title: 'Pending TPA Approvals',
    detail: '47 TPA pre-auth requests pending > 72 hours. Potential revenue hold.',
    time: '22 min ago',
  },
  {
    id: 5,
    severity: 'warning',
    title: 'Neurology Denial Surge',
    detail: 'Neurology claim denials increased 8% — review coding accuracy.',
    time: '34 min ago',
  },
  {
    id: 6,
    severity: 'stable',
    title: 'Cardiology Claims Stable',
    detail: 'Cardiology approval rate at 94.2% — above target threshold.',
    time: '1 hr ago',
  },
  {
    id: 7,
    severity: 'stable',
    title: 'Collection Efficiency Improving',
    detail: 'Self-pay collections up 3.1% after new payment portal rollout.',
    time: '2 hr ago',
  },
];

export const aiSummary = {
  headline:
    'Claim approval rates remain stable at 91%, but Emergency and Neurology denial rates have surged this week, requiring immediate coding and authorization review.',
  insights: [
    'Outstanding receivables above 60 days total $2.94M (43% of AR) — escalate collections for 90+ day bucket ($1.4M).',
    'Emergency department leads denial volume at 31 claims (+12% WoW) — primary cause: missing prior authorizations.',
    'Neurology denials increased 8% this week; ICD/CPT coding audit recommended.',
    'BlueCross approval turnaround has slipped to 9.4 days — engage payer relations team.',
    'Collection efficiency at 87.4% is 4.6 points below the 92% target — review billing workflow bottlenecks.',
  ],
  actions: [
    'Initiate AR recovery campaign for 90+ day receivables',
    'Audit Emergency & Neurology claim coding immediately',
    'Escalate BlueCross TPA delays to payer relations',
    'Review prior authorization workflow for Emergency dept',
  ],
};
