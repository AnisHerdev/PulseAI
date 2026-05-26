import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  RefreshCcw, 
  Users, 
  FileBarChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  DollarSign
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
import './App.css';

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

// --- COMPONENTS ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kpi', label: 'KPI Overview', icon: Activity },
    { id: 'rcm', label: 'Revenue Cycle', icon: RefreshCcw },
    { id: 'partners', label: 'Third-Party Partners', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>PulseAI</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

const CommandCenter = () => {
  return (
    <div className="content-wrapper">
      {/* ROW 1: P&L Strip */}
      <div className="row-1-grid">
        <div className="card">
          <h2 className="card-title">Today's Revenue</h2>
          <div className="hero-number">$845,200</div>
          <p className="sub-label status-green">
            <ArrowUpRight size={16} /> +5.2% vs same day last week
          </p>
        </div>
        <div className="card">
          <h2 className="card-title">Today's Expenses</h2>
          <div className="hero-number">$612,400</div>
          <p className="sub-label status-amber">
            <Clock size={16} /> Estimated (Staffing + Consumables)
          </p>
        </div>
        <div className="card">
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

const KPIOverview = () => {
  return (
    <div className="content-wrapper">
      <div className="kpi-section">
        <h3 className="kpi-section-title">Bed Utilization</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">Bed Occupancy Rate</h2>
            <div className="metric-number status-green">82%</div>
            <p className="sub-label">Target: 80-85%</p>
          </div>
          <div className="card">
            <h2 className="card-title">Average Length of Stay</h2>
            <div className="metric-number">4.2 <span style={{fontSize: '16px'}}>days</span></div>
            <p className="sub-label status-green"><ArrowDownRight size={14}/> 0.3 days vs last month</p>
          </div>
          <div className="card">
            <h2 className="card-title">Room Turnaround Time</h2>
            <div className="metric-number status-amber">48 <span style={{fontSize: '16px'}}>mins</span></div>
            <p className="sub-label status-amber">Target: &lt;45 mins</p>
          </div>
          <div className="card">
            <h2 className="card-title">Bed Turnover Rate</h2>
            <div className="metric-number">6.8</div>
            <p className="sub-label">Patients per bed per month</p>
          </div>
        </div>
      </div>

      <div className="kpi-section">
        <h3 className="kpi-section-title">Operational & Flow Metrics</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">OR Utilization</h2>
            <div className="metric-number status-green">76%</div>
            <p className="sub-label">Target: &gt;75%</p>
          </div>
          <div className="card">
            <h2 className="card-title">ER Wait Time</h2>
            <div className="metric-number status-red">34 <span style={{fontSize: '16px'}}>mins</span></div>
            <p className="sub-label status-red"><AlertCircle size={14}/> Target: &lt;30 mins</p>
          </div>
          <div className="card">
            <h2 className="card-title">Discharge Efficiency</h2>
            <div className="metric-number">2.5 <span style={{fontSize: '16px'}}>hrs</span></div>
            <p className="sub-label">Approval to exit</p>
          </div>
          <div className="card">
            <h2 className="card-title">Equipment Utilization (MRI)</h2>
            <div className="metric-number status-green">88%</div>
            <p className="sub-label">Healthy volume</p>
          </div>
        </div>
      </div>

      <div className="kpi-section">
        <h3 className="kpi-section-title">Staffing Ratios</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">Nurse to Patient (ICU)</h2>
            <div className="metric-number status-green">1:2</div>
            <p className="sub-label">Compliant</p>
          </div>
          <div className="card">
            <h2 className="card-title">Nurse to Patient (Gen)</h2>
            <div className="metric-number status-amber">1:7</div>
            <p className="sub-label status-amber">Target: 1:6</p>
          </div>
          <div className="card">
            <h2 className="card-title">Staff Utilization Rate</h2>
            <div className="metric-number">84%</div>
            <p className="sub-label">Billable vs idle time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="top-header">
          <h2 className="header-title">
            {activeTab === 'dashboard' && 'Business Command Center'}
            {activeTab === 'kpi' && 'Operational KPI Overview'}
            {activeTab === 'rcm' && 'Revenue Cycle Management'}
            {activeTab === 'partners' && 'Third-Party Partners'}
            {activeTab === 'reports' && 'Reports & Analytics'}
          </h2>
        </header>

        {activeTab === 'dashboard' && <CommandCenter />}
        {activeTab === 'kpi' && <KPIOverview />}
        
        {/* Placeholder for other tabs */}
        {['rcm', 'partners', 'reports'].includes(activeTab) && (
          <div className="content-wrapper">
            <div className="card">
              <p style={{ color: 'var(--text-secondary)' }}>This module is currently under development.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
