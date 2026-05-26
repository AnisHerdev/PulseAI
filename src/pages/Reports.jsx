import { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Bed,
  Scissors
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const weeklyData = [
  { name: 'Mon', revenue: 140, expense: 90 },
  { name: 'Tue', revenue: 155, expense: 95 },
  { name: 'Wed', revenue: 150, expense: 92 },
  { name: 'Thu', revenue: 165, expense: 98 },
  { name: 'Fri', revenue: 180, expense: 105 },
  { name: 'Sat', revenue: 170, expense: 100 },
  { name: 'Sun', revenue: 160, expense: 95 },
];

const monthlyData = [
  { name: 'Week 1', revenue: 1100, expense: 700 },
  { name: 'Week 2', revenue: 1150, expense: 720 },
  { name: 'Week 3', revenue: 1200, expense: 750 },
  { name: 'Week 4', revenue: 1350, expense: 800 },
];

const Reports = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const chartData = timeframe === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="content-wrapper">
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Executive Analysis
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
            AI-driven financial insights and recommended actions.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-color)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setTimeframe('weekly')}
            style={{ 
              padding: '8px 16px', borderRadius: '6px', border: 'none', 
              background: timeframe === 'weekly' ? 'var(--primary-color)' : 'transparent',
              color: timeframe === 'weekly' ? 'white' : 'var(--text-secondary)',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeframe('monthly')}
            style={{ 
              padding: '8px 16px', borderRadius: '6px', border: 'none', 
              background: timeframe === 'monthly' ? 'var(--primary-color)' : 'transparent',
              color: timeframe === 'monthly' ? 'white' : 'var(--text-secondary)',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: Analysis & Decisions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* AI Summary */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FileText size={20} color="var(--primary-color)" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {timeframe === 'weekly' ? 'Weekly Performance Brief' : 'Monthly Performance Brief'}
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
              {timeframe === 'weekly' 
                ? "This week showed a strong 5.2% revenue growth driven by high surgical volumes. However, operating expenses trended slightly above target due to increased overtime staffing in the ER."
                : "Monthly revenue exceeded the $25M target by 4%, closing at $26.1M. The primary growth driver was a 12% increase in elective orthopedics. Conversely, claim denial rates spiked to 6.2%, necessitating a review of the billing department's pre-authorization workflow."}
            </p>
          </div>

          {/* Strategic Decisions Engine */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Recommended Decisions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Decision 1: Cost Reduction */}
              <div className="card" style={{ padding: '24px', borderColor: 'var(--color-amber)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'var(--color-amber-bg)', borderRadius: '8px', color: 'var(--color-amber)' }}>
                      <Scissors size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Reduce Consumable Costs</h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Impact: Medium • Effort: Low</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-green)', fontSize: '16px' }}>
                    +$18k / mo
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  Surgical consumable expenses have drifted 14% above benchmark over the last 30 days. Recommend immediate audit of primary supplier pricing tiers and switching to bulk-purchasing for basic IV supplies.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Approve Audit</button>
                  <button style={{ padding: '8px 16px', background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Dismiss</button>
                </div>
              </div>

              {/* Decision 2: Expansion */}
              <div className="card" style={{ padding: '24px', borderColor: 'var(--color-green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'var(--color-green-bg)', borderRadius: '8px', color: 'var(--color-green)' }}>
                      <Bed size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Increase ICU Bed Capacity</h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Impact: High • Effort: High</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-green)', fontSize: '16px' }}>
                    +$145k / mo
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  ICU bed occupancy has averaged 96% over the last 60 days, resulting in 12 high-value patient turn-aways. Recommend converting 4 general ward beds into step-down ICU beds.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ padding: '8px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Initiate Conversion Plan</button>
                  <button style={{ padding: '8px 16px', background: 'var(--surface-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>Review Later</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Charts & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>
              Trend vs Projection
            </h3>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(val) => `$${val}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--primary-color)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="var(--color-amber)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary-color)' }}></div> Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-amber)' }}></div> Expenses
              </span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
              Action Item Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="var(--color-green)" />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Approved Q3 Marketing Budget</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Completed 2 days ago</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle size={18} color="var(--color-amber)" />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Review Overdue BlueCross Claims</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Pending CFO Review</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} color="var(--text-secondary)" />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Board Meeting Prep</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Scheduled for Friday</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Reports.config = {
  id: 'reports',
  label: 'Executive Reports',
  title: 'Executive Analysis & Decisions',
  icon: FileText,
  order: 5
};

export default Reports;
