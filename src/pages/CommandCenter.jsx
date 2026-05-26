import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard,
  RefreshCw,
  Bot,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useDashboardStream } from '../hooks/useDashboardStream.js';
import { TODAY_METRICS } from '../utils/constants.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value) {
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US')}`;
}

function timeAgo(timestamp) {
  if (!timestamp) return '—';
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function getAlertIcon(alert) {
  if (alert.icon === 'trending-down') return TrendingDown;
  if (alert.icon === 'trending-up') return TrendingUp;
  return AlertCircle;
}

// ── Component ────────────────────────────────────────────────────────────────

const CommandCenter = ({ setActiveTab }) => {
  const { dashboardData, alerts, aiSummary, lastUpdate, refreshSummary } = useDashboardStream();

  // Destructure for readability
  const d = dashboardData;

  // Force re-render of timeAgo labels
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

// --- MOCK DATA ---
const revenueByDeptData = [
  { name: 'Cardiology', revenue: 240000 },
  { name: 'Orthopedics', revenue: 190000 },
  { name: 'Oncology', revenue: 150000 },
  { name: 'Surgery', revenue: 110000 },
  { name: 'Emergency', revenue: 80000 },
];

const payerMixData = [
  { name: 'Private Insurance', value: 55, color: '#2563eb' },
  { name: 'Self-Pay', value: 25, color: '#10b981' },
  { name: 'Govt Scheme', value: 20, color: '#f59e0b' },
];

const correlationData = [
  { day: 'Mon', occ: 82, rev: 800 },
  { day: 'Tue', occ: 85, rev: 840 },
  { day: 'Wed', occ: 88, rev: 860 },
  { day: 'Thu', occ: 90, rev: 890 },
  { day: 'Fri', occ: 92, rev: 810 }, // Divergence here
  { day: 'Sat', occ: 90, rev: 780 },
  { day: 'Sun', occ: 85, rev: 750 },
];

const CommandCenter = ({ setActiveTab }) => {
  return (
    <div className="content-wrapper">
      {/* Live indicator */}
      <div className="live-indicator">
        <span className="pulse-dot" />
        <span className="live-label">Live Simulation</span>
        <span className="live-timestamp">Last update: {timeAgo(lastUpdate)}</span>
      </div>

      {/* ROW 1: P&L Strip */}
      <div className="row-1-grid">
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Revenue</h2>
          <div className="hero-number">{formatCurrency(d.todaysRevenue.value)}</div>
          <p className={`sub-label ${d.todaysRevenue.changePercent >= 0 ? 'status-green' : 'status-red'}`}>
            {d.todaysRevenue.changePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {d.todaysRevenue.changePercent >= 0 ? '+' : ''}{d.todaysRevenue.changePercent.toFixed(1)}% vs same day last week
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Expenses</h2>
          <div className="hero-number">{formatCurrency(d.todaysExpenses.value)}</div>
          <p className="sub-label status-amber">
            <Clock size={16} /> Estimated ({TODAY_METRICS.expensesEstimate})
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Net P&L Today</h2>
          <div className={`hero-number ${d.netPnL.value >= 0 ? 'status-green' : 'status-red'}`}>
            {d.netPnL.value >= 0 ? '+' : ''}{formatCurrency(d.netPnL.value)}
          </div>
          <p className={`sub-label ${d.netPnL.changePercent >= 0 ? 'status-green' : 'status-red'}`}>
            {d.netPnL.changePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {d.netPnL.changePercent >= 0 ? '+' : ''}{d.netPnL.changePercent.toFixed(1)}% vs same day last week
          </p>
        </div>
      </div>

      {/* ROW 2: Money Inflow Breakdown */}
      <div className="row-2-grid">
        <div className="card">
          <h2 className="card-title">Patient Direct Payments</h2>
          <div className="metric-number">{formatCurrency(d.patientDirectPayments.value)}</div>
          <p className="sub-label">{d.patientDirectPayments.percentOfInflow}% of total inflow</p>
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('partners')}>
          <h2 className="card-title">Insurance / TPA</h2>
          <div className="metric-number">{formatCurrency(d.insuranceTPA.value)}</div>
          <p className="sub-label">{d.insuranceTPA.percentOfInflow}% of total inflow</p>
        </div>
        <div className="card" style={{ borderColor: d.pendingClaims.value > 4500000 ? 'var(--color-red)' : 'var(--color-amber)' }}>
          <h2 className="card-title">Pending Claims</h2>
          <div className={`metric-number ${d.pendingClaims.value > 4500000 ? 'status-red' : 'status-amber'}`}>
            {formatCurrency(d.pendingClaims.value)}
          </div>
          <p className="sub-label">Submitted, unpaid value</p>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-red)' }}>
          <h2 className="card-title">Claim Denials Today</h2>
          <div className="metric-number status-red">{formatCurrency(d.claimDenialsToday.value)}</div>
          <p className="sub-label status-red">
            <AlertCircle size={16} /> {d.claimDenialsToday.count} claims denied
          </p>
        </div>
      </div>

      {/* ROW 3: Revenue Performance */}
      <div className="row-3-grid">
        <div className="card">
          <h2 className="card-title">Revenue by Department (Top 5)</h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={d.revenueByDept} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip cursor={{fill: 'var(--surface-hover)'}} formatter={(val) => `$${val.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="var(--primary-color)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Payer Mix</h2>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={d.payerMix} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {d.payerMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{color: '#2563eb'}}>■ Pvt</span>
            <span style={{color: '#10b981'}}>■ Self</span>
            <span style={{color: '#f59e0b'}}>■ Govt</span>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">MTD Revenue vs Target</h2>
          <div className="hero-number" style={{ fontSize: '36px' }}>{formatCurrency(d.mtdRevenue.value)}</div>
          <p className="sub-label">Target: {formatCurrency(d.mtdRevenue.target)}</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${Math.min(d.mtdRevenue.percent, 100)}%` }}></div>
          </div>
          <p className="sub-label" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>{d.mtdRevenue.percent.toFixed(0)}% of monthly goal</p>
        </div>
      </div>

      {/* ROW 4: Critical Business Alerts */}
      <div className="row-4-grid">
        <div className="card">
          <h2 className="card-title">Days in AR</h2>
          <div className={`metric-number ${d.daysInAR.value > 55 ? 'status-red' : d.daysInAR.value > 50 ? 'status-amber' : 'status-green'}`}>
            {d.daysInAR.value}
          </div>
          <p className={`sub-label ${d.daysInAR.value > d.daysInAR.previousValue ? 'status-red' : 'status-green'}`}>
            {d.daysInAR.value > d.daysInAR.previousValue ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {d.daysInAR.value > d.daysInAR.previousValue ? 'Up' : 'Down'} from {d.daysInAR.previousValue} days
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Claim Denial Rate (MTD)</h2>
          <div className={`metric-number ${d.claimDenialRate.value > d.claimDenialRate.target + 1 ? 'status-red' : d.claimDenialRate.value > d.claimDenialRate.target ? 'status-amber' : 'status-green'}`}>
            {d.claimDenialRate.value.toFixed(1)}%
          </div>
          <p className={`sub-label ${d.claimDenialRate.value > d.claimDenialRate.target ? 'status-red' : 'status-green'}`}>
            {d.claimDenialRate.value > d.claimDenialRate.target && <AlertCircle size={16} />}
            Target: &lt;{d.claimDenialRate.target}%
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Occupancy vs Rev (7D)</h2>
          <div style={{ width: '100%', height: 60, marginTop: '8px' }}>
             <ResponsiveContainer>
              <LineChart data={d.correlationData}>
                <Tooltip />
                <Line type="monotone" dataKey="occ" stroke="var(--text-tertiary)" strokeWidth={2} dot={false} name="Occupancy %" />
                <Line type="monotone" dataKey="rev" stroke="var(--primary-color)" strokeWidth={2} dot={false} name="Revenue (k)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="sub-label status-amber" style={{marginTop: '12px'}}>
            <TrendingDown size={16} /> Correlation tracking active
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Revenue Risks ({alerts.length})</h2>
          <ul className="alert-list">
            {alerts.slice(0, 4).map((alert, idx) => {
              const IconComp = getAlertIcon(alert);
              return (
                <li key={idx} className="alert-item">
                  <IconComp size={16} className={`alert-icon status-${alert.severity}`} />
                  <span>{alert.text}</span>
                </li>
              );
            })}
            {alerts.length === 0 && (
              <li className="alert-item">
                <span style={{ color: 'var(--text-tertiary)' }}>No active alerts</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* AI Dashboard Summary — single full-width card */}
      <div className="section-divider">
        <Bot size={18} />
        <span>AI Intelligence</span>
      </div>

      <div className="card ai-summary-card">
        <div className="card-header-row">
          <h2 className="card-title">
            <Bot size={16} className="card-title-icon" /> AI Dashboard Summary
          </h2>
          <button
            className="refresh-btn"
            onClick={refreshSummary}
            disabled={aiSummary.loading}
            title="Refresh AI Summary"
          >
            <RefreshCw size={14} className={aiSummary.loading ? 'spin' : ''} />
          </button>
        </div>
        <p className="ai-summary-text">
          {aiSummary.loading && !aiSummary.summary
            ? 'Generating executive summary...'
            : aiSummary.summary || 'Waiting for first data cycle...'}
        </p>
        <div className="summary-footer">
          <span className="timestamp-label">
            {aiSummary.timestamp ? `Generated ${timeAgo(aiSummary.timestamp)}` : 'Pending'}
          </span>
          {aiSummary.model && (
            <span className={`model-badge ${aiSummary.fallback ? 'badge-fallback' : ''}`}>
              {aiSummary.fallback ? 'Fallback' : aiSummary.model}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

CommandCenter.config = {
  id: 'dashboard',
  label: 'Dashboard',
  title: 'Business Command Center',
  icon: LayoutDashboard,
  order: 1
};

export default CommandCenter;
