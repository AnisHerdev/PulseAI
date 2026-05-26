import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
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
      {/* ROW 1: P&L Strip */}
      <div className="row-1-grid">
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Revenue</h2>
          <div className="hero-number">$845,200</div>
          <p className="sub-label status-green">
            <ArrowUpRight size={16} /> +5.2% vs same day last week
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Today's Expenses</h2>
          <div className="hero-number">$612,400</div>
          <p className="sub-label status-amber">
            <Clock size={16} /> Estimated (Staffing + Consumables)
          </p>
        </div>
        <div className="card clickable-card" onClick={() => setActiveTab('financial-details')}>
          <h2 className="card-title">Net P&L Today</h2>
          <div className="hero-number status-green">+$232,800</div>
          <p className="sub-label status-green">
            <ArrowUpRight size={16} /> +12.4% vs same day last week
          </p>
        </div>
      </div>

      {/* ROW 2: Money Inflow Breakdown */}
      <div className="row-2-grid">
        <div className="card">
          <h2 className="card-title">Patient Direct Payments</h2>
          <div className="metric-number">$185,944</div>
          <p className="sub-label">22% of total inflow</p>
        </div>
        <div className="card">
          <h2 className="card-title">Insurance / TPA</h2>
          <div className="metric-number">$659,256</div>
          <p className="sub-label">78% of total inflow</p>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-amber)' }}>
          <h2 className="card-title">Pending Claims</h2>
          <div className="metric-number status-amber">$4.25M</div>
          <p className="sub-label">Submitted, unpaid value</p>
        </div>
        <div className="card" style={{ borderColor: 'var(--color-red)' }}>
          <h2 className="card-title">Claim Denials Today</h2>
          <div className="metric-number status-red">$18,400</div>
          <p className="sub-label status-red">
            <AlertCircle size={16} /> 14 claims denied
          </p>
        </div>
      </div>

      {/* ROW 3: Revenue Performance */}
      <div className="row-3-grid">
        <div className="card">
          <h2 className="card-title">Revenue by Department (Top 5)</h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={revenueByDeptData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
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
                <Pie data={payerMixData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {payerMixData.map((entry, index) => (
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

export const config = {
  id: 'dashboard',
  label: 'Dashboard',
  title: 'Business Command Center',
  icon: LayoutDashboard,
  order: 1
};

export default CommandCenter;
