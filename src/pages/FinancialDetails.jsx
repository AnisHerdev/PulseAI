import React, { useState } from 'react';
import { Wallet, ChevronDown, BarChart2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

const mockData = [
  { day: 'Sun', income: 10, savings: 2, expenses: -5, fullDate: 'Sunday, 4 Jan 2025' },
  { day: 'Mon', income: 9, savings: 2, expenses: -3, fullDate: 'Monday, 5 Jan 2025' },
  { day: 'Tue', income: 14, savings: 1, expenses: -4, fullDate: 'Tuesday, 6 Jan 2025' },
  { day: 'Wed', income: 15, savings: 4.5, expenses: -4.6, fullDate: 'Wednesday, 7 Jan 2025' },
  { day: 'Thu', income: 11, savings: 1, expenses: -2, fullDate: 'Thursday, 8 Jan 2025' },
  { day: 'Fri', income: 18, savings: 3, expenses: -6, fullDate: 'Friday, 9 Jan 2025' },
  { day: 'Sat', income: 21, savings: 2, expenses: -4, fullDate: 'Saturday, 10 Jan 2025' },
];

const COLORS = {
  savings: '#fbbf24', // Amber/Yellow
  income: '#84cc16',  // Lime Green
  expenses: '#fb923c', // Orange
  inactive: 'var(--border-color)'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--surface-color)',
        padding: '16px',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        minWidth: '220px'
      }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '12px', fontWeight: 500 }}>
          {data.fullDate}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.savings }}></span>
              Savings
            </span>
            <span style={{ fontWeight: 600 }}>${(data.savings * 100).toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.income }}></span>
              Income
            </span>
            <span style={{ fontWeight: 600 }}>${(data.income * 100).toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.expenses }}></span>
              Expenses
            </span>
            <span style={{ fontWeight: 600 }}>${Math.abs(data.expenses * 100).toFixed(0)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialDetails = () => {
  const [activeIndex, setActiveIndex] = useState(3); // Default to Wednesday for the highlighted effect

  return (
    <div className="content-wrapper">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
        
        {/* Main Chart Area */}
        <div className="card" style={{ padding: '32px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                $12,450
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Balance overview
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', 
                  padding: '6px 12px', borderRadius: '6px', 
                  border: '1px solid var(--border-color)', background: 'transparent',
                  color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer'
                }}>
                  7d <ChevronDown size={14} />
                </button>
                <div style={{ 
                  display: 'flex', 
                  border: '1px solid var(--border-color)', borderRadius: '6px', 
                  padding: '2px', background: 'transparent'
                }}>
                  <button style={{ 
                    padding: '4px 8px', borderRadius: '4px', border: 'none', 
                    background: 'var(--surface-hover)', color: 'var(--text-primary)', cursor: 'pointer' 
                  }}>
                    <BarChart2 size={16} />
                  </button>
                  <button style={{ 
                    padding: '4px 8px', borderRadius: '4px', border: 'none', 
                    background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' 
                  }}>
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: COLORS.savings, borderRadius: '2px' }}></span>
                  Savings
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: COLORS.income, borderRadius: '2px' }}></span>
                  Income
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: COLORS.expenses, borderRadius: '2px' }}></span>
                  Expenses
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart 
                data={mockData} 
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                barSize={48}
                onMouseMove={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setActiveIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 13 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 13 }} 
                  ticks={[-10, 0, 10, 20, 30]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <ReferenceLine y={0} stroke="var(--border-color)" />
                
                <Bar dataKey="income" stackId="a" radius={[0, 0, 0, 0]}>
                  {mockData.map((entry, index) => (
                    <Cell 
                      key={`cell-income-${index}`} 
                      fill={activeIndex === -1 || activeIndex === index ? COLORS.income : COLORS.inactive} 
                      style={{ transition: 'fill 0.2s ease' }}
                    />
                  ))}
                </Bar>
                <Bar dataKey="savings" stackId="a" radius={[4, 4, 0, 0]}>
                  {mockData.map((entry, index) => (
                    <Cell 
                      key={`cell-savings-${index}`} 
                      fill={activeIndex === -1 || activeIndex === index ? COLORS.savings : COLORS.inactive}
                      style={{ transition: 'fill 0.2s ease' }} 
                    />
                  ))}
                </Bar>
                <Bar dataKey="expenses" stackId="b" radius={[0, 0, 4, 4]}>
                  {mockData.map((entry, index) => (
                    <Cell 
                      key={`cell-expenses-${index}`} 
                      fill={activeIndex === -1 || activeIndex === index ? COLORS.expenses : COLORS.inactive}
                      style={{ transition: 'fill 0.2s ease' }} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '16px' }}>
          
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Total income
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              $15,000
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-green)' }}>
              <ArrowUpRight size={14} /> 5.1% from last month
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Total expenses
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              $6,700
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-amber)' }}>
              <ArrowUpRight size={14} /> 15.5% from last month
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Saved balance
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              $8,300
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-green)' }}>
              <ArrowUpRight size={14} /> 20.7% from last month
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export const config = {
  id: 'financial-details',
  label: 'Financial Details',
  title: 'Financial Details',
  icon: Wallet,
  order: 2
};

export default FinancialDetails;
