
import { 
  ArrowUpRight, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard
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
import { TODAY_METRICS, REVENUE_BY_DEPT, PAYER_MIX, FINANCIAL_DATA_7D } from '../utils/constants';

// Occupancy vs Revenue mapping derived dynamically from ground truth
const occupancies = [88, 90, 92, 90, 85, 82, 85];
const correlationData = FINANCIAL_DATA_7D.map((d, index) => ({
  day: d.day,
  occ: occupancies[index] || 85,
  rev: d.revenue / 10 // Scales 8452 (from constants.js) to 845.2 to fit the "k" (thousands) chart scale
}));

const CommandCenter = ({ setActiveTab }) => {
  return (
    <div className="content-wrapper">
      {/* ROW 1: P&L Strip */}
      <div className="row-1-grid">
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Revenue</h2>
          <div className="hero-number">${TODAY_METRICS.revenue.toLocaleString()}</div>
          <p className="sub-label status-green">
            <ArrowUpRight size={16} /> {TODAY_METRICS.revenueDiff} vs same day last week
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Expenses</h2>
          <div className="hero-number">${TODAY_METRICS.expenses.toLocaleString()}</div>
          <p className="sub-label status-amber">
            <Clock size={16} /> Estimated ({TODAY_METRICS.expensesEstimate})
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Net P&L Today</h2>
          <div className="hero-number status-green">+${TODAY_METRICS.netPL.toLocaleString()}</div>
          <p className="sub-label status-green">
            <ArrowUpRight size={16} /> {TODAY_METRICS.netPLDiff} vs same day last week
          </p>
        </div>
      </div>

      {/* ROW 2: Money Inflow Breakdown */}
      <div className="row-2-grid">
        <div className="card">
          <h2 className="card-title">Patient Direct Payments</h2>
          <div className="metric-number">${TODAY_METRICS.directPayments.toLocaleString()}</div>
          <p className="sub-label">{TODAY_METRICS.directPaymentsPct} of total inflow</p>
        </div>
        <div className="card">
          <h2 className="card-title">Insurance / TPA</h2>
          <div className="metric-number">${TODAY_METRICS.insurancePayments.toLocaleString()}</div>
          <p className="sub-label">{TODAY_METRICS.insurancePaymentsPct} of total inflow</p>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-amber)' }}>
          <h2 className="card-title">Pending Claims</h2>
          <div className="metric-number status-amber">${(TODAY_METRICS.pendingClaims / 1000000).toFixed(2)}M</div>
          <p className="sub-label">Submitted, unpaid value</p>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-red)' }}>
          <h2 className="card-title">Claim Denials Today</h2>
          <div className="metric-number status-red">${TODAY_METRICS.claimDenialsToday.toLocaleString()}</div>
          <p className="sub-label status-red">
            <AlertCircle size={16} /> {TODAY_METRICS.claimDenialsCount} claims denied
          </p>
        </div>
      </div>

      {/* ROW 3: Revenue Performance */}
      <div className="row-3-grid">
        <div className="card">
          <h2 className="card-title">Revenue by Department (Top 5)</h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={REVENUE_BY_DEPT} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
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
                <Pie data={PAYER_MIX} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {PAYER_MIX.map((entry, index) => (
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
          <div className="hero-number" style={{ fontSize: '36px' }}>$18.5M</div>
          <p className="sub-label">Target: $25.0M</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '74%' }}></div>
          </div>
          <p className="sub-label" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>74% of monthly goal</p>
        </div>
      </div>

      {/* ROW 4: Critical Business Alerts */}
      <div className="row-4-grid">
        <div className="card">
          <h2 className="card-title">Days in AR</h2>
          <div className="metric-number status-red">52</div>
          <p className="sub-label status-red">
            <TrendingUp size={16} /> Up from 48 days
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Claim Denial Rate (MTD)</h2>
          <div className="metric-number status-red">6.2%</div>
          <p className="sub-label status-red">
            <AlertCircle size={16} /> Target: &lt;5.0%
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Occupancy vs Rev (7D)</h2>
          <div style={{ width: '100%', height: 60, marginTop: '8px' }}>
             <ResponsiveContainer>
              <LineChart data={correlationData}>
                <Tooltip />
                <Line type="monotone" dataKey="occ" stroke="var(--text-tertiary)" strokeWidth={2} dot={false} name="Occupancy %" />
                <Line type="monotone" dataKey="rev" stroke="var(--primary-color)" strokeWidth={2} dot={false} name="Revenue (k)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="sub-label status-amber" style={{marginTop: '12px'}}>
            <TrendingDown size={16} /> Divergence detected Fri-Sun
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">Top 3 Revenue Risks</h2>
          <ul className="alert-list">
            <li className="alert-item">
              <AlertCircle size={16} className="alert-icon status-amber" />
              <span>ICU at 60% occupancy (Lost margin)</span>
            </li>
            <li className="alert-item">
              <AlertCircle size={16} className="alert-icon status-red" />
              <span>5 high-value claims denied by BlueCross</span>
            </li>
            <li className="alert-item">
              <TrendingDown size={16} className="alert-icon status-amber" />
              <span>Orthopedics revenue down 15% WoW</span>
            </li>
          </ul>
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
