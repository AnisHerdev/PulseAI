import { useState, useEffect } from 'react';
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
  Cell
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
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="content-wrapper command-center-distilled">
      {/* Live indicator */}
      <div className="live-indicator">
        <span className="pulse-dot" />
        <span className="live-label">Live Simulation</span>
        <span className="live-timestamp">Last update: {timeAgo(lastUpdate)}</span>
      </div>

      {/* Dynamic Header Metrics (Editorial layout, no cards) */}
      <section className="executive-strip" aria-label="Daily financial performance summary">
        <div className="strip-item clickable-strip-item" onClick={() => setActiveTab('financial-details')}>
          <span className="strip-label">Today's Revenue</span>
          <div className="strip-number">{formatCurrency(d.todaysRevenue.value)}</div>
          <span className={`strip-trend ${d.todaysRevenue.changePercent >= 0 ? 'status-green' : 'status-red'}`}>
            {d.todaysRevenue.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {d.todaysRevenue.changePercent >= 0 ? '+' : ''}{d.todaysRevenue.changePercent.toFixed(1)}% vs last week
          </span>
        </div>
        <div className="strip-item clickable-strip-item" onClick={() => setActiveTab('financial-details')}>
          <span className="strip-label">Today's Expenses</span>
          <div className="strip-number">{formatCurrency(d.todaysExpenses.value)}</div>
          <span className="strip-trend status-amber">
            <Clock size={14} /> Estimated ({TODAY_METRICS.expensesEstimate})
          </span>
        </div>
        <div className="strip-item clickable-strip-item" onClick={() => setActiveTab('financial-details')}>
          <span className="strip-label">Net Profit Today</span>
          <div className={`strip-number ${d.netPnL.value >= 0 ? 'status-green' : 'status-red'}`}>
            {d.netPnL.value >= 0 ? '+' : ''}{formatCurrency(d.netPnL.value)}
          </div>
          <span className={`strip-trend ${d.netPnL.changePercent >= 0 ? 'status-green' : 'status-red'}`}>
            {d.netPnL.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {d.netPnL.changePercent >= 0 ? '+' : ''}{d.netPnL.changePercent.toFixed(1)}% vs last week
          </span>
        </div>
      </section>

      {/* Main Grid: Data Visualization & Key Indicators */}
      <div className="cc-main-grid">
        {/* Left Column: Visual Analytics */}
        <div className="cc-analytics-column">
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

          <div className="card clickable-card" onClick={() => setActiveTab('partners')}>
            <h2 className="card-title">Payer Mix & Sources</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={d.payerMix} innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {d.payerMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="payer-mix-legend-distilled">
                <div><span className="legend-indicator" style={{background: 'var(--primary-color)'}}></span> Pvt Insurance ({d.insuranceTPA.percentOfInflow}%)</div>
                <div><span className="legend-indicator" style={{background: 'var(--color-green)'}}></span> Self-Pay ({d.patientDirectPayments.percentOfInflow}%)</div>
                <div><span className="legend-indicator" style={{background: 'var(--color-amber)'}}></span> Government</div>
              </div>
            </div>
          </div>

          {/* AI Command Summary */}
          <div className="card ai-summary-card distilled-ai-card">
            <div className="card-header-row">
              <h2 className="card-title">
                <Bot size={16} className="card-title-icon" /> AI Command Summary
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
              {aiSummary.loading && !aiSummary.summary ? (
                <span className="ai-loading-pulse">Generating executive summary...</span>
              ) : (
                aiSummary.summary || 'Waiting for first data cycle...'
              )}
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

        {/* Right Column: Goal & Health Indicators */}
        <div className="cc-health-column">
          <div className="card">
            <h2 className="card-title">MTD Revenue Performance</h2>
            <div className="mtd-progress-hero">
              <span className="mtd-value">{formatCurrency(d.mtdRevenue.value)}</span>
              <span className="mtd-target">of {formatCurrency(d.mtdRevenue.target)} target</span>
            </div>
            <div className="progress-bar-container" style={{ marginTop: '20px' }}>
              <div className="progress-bar-fill" style={{ width: `${Math.min(d.mtdRevenue.percent, 100)}%` }}></div>
            </div>
            <span className="progress-sub-text" style={{ marginTop: '12px', display: 'block', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>
              {d.mtdRevenue.percent.toFixed(0)}% of monthly goal achieved
            </span>
          </div>

          <div className="card cc-kpi-distilled-card">
            <h2 className="card-title">Key Cycle Metrics</h2>
            <div className="kpi-row-distilled">
              <div className="kpi-item-distilled">
                <span className="kpi-label">Days in AR</span>
                <span className={`kpi-val ${d.daysInAR.value > 55 ? 'status-red' : d.daysInAR.value > 50 ? 'status-amber' : 'status-green'}`}>{d.daysInAR.value}</span>
                <span className="kpi-sub">Target: &lt;50 days</span>
              </div>
              <div className="kpi-item-distilled">
                <span className="kpi-label">Denial Rate</span>
                <span className={`kpi-val ${d.claimDenialRate.value > d.claimDenialRate.target + 1 ? 'status-red' : d.claimDenialRate.value > d.claimDenialRate.target ? 'status-amber' : 'status-green'}`}>{d.claimDenialRate.value.toFixed(1)}%</span>
                <span className="kpi-sub">Target: &lt;{d.claimDenialRate.target}%</span>
              </div>
              <div className="kpi-item-distilled" style={{ borderRight: 'none' }}>
                <span className="kpi-label">Pending Claims</span>
                <span className={`kpi-val ${d.pendingClaims.value > 4500000 ? 'status-red' : 'status-amber'}`}>{formatCurrency(d.pendingClaims.value)}</span>
                <span className="kpi-sub">submitted value</span>
              </div>
            </div>
          </div>

          {/* Revenue Risks list */}
          <div className="card distilled-risks-card">
            <h2 className="card-title">Active Revenue Risks ({alerts.length})</h2>
            <ul className="alert-list">
              {alerts.slice(0, 4).map((alert, idx) => {
                const IconComp = getAlertIcon(alert);
                return (
                  <li key={idx} className="alert-item">
                    <IconComp size={16} className={`alert-icon status-${alert.severity}`} />
                    <span className="alert-item-text">{alert.text}</span>
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
