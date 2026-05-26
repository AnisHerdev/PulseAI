import { useState } from 'react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FINANCIAL_DATA_7D, FINANCIAL_DATA_30D, CASH_FLOW_PROJECTION } from '../utils/constants';

const COLORS = {
  revenue: '#84cc16',
  expenses: '#fb923c',
  inactive: 'var(--border-color)'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--surface-color)',
        padding: '16px',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        minWidth: '220px',
        zIndex: 200
      }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginBottom: '12px', fontWeight: 500 }}>
          {data.fullDate}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.revenue }}></span>
              Revenue
            </span>
            <span style={{ fontWeight: 600 }}>${(data.revenue * 100).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.expenses }}></span>
              Expenses
            </span>
            <span style={{ fontWeight: 600 }}>${Math.abs(data.expenses * 100).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialDetails = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [activeIndex, setActiveIndex] = useState(-1);

  const activeData = timeframe === '7d' ? FINANCIAL_DATA_7D : FINANCIAL_DATA_30D;

  // Dynamic summary calculations
  const totalRevenue = activeData.reduce((sum, d) => sum + d.revenue, 0) * 100;
  const totalExpenses = activeData.reduce((sum, d) => sum + Math.abs(d.expenses), 0) * 100;
  const savedBalance = totalRevenue - totalExpenses;

  // Performance ratios vs previous period
  const revenueDiff = timeframe === '7d' ? '+5.1% vs prev 7 days' : '+4.8% vs prev 30 days';
  const expensesDiff = timeframe === '7d' ? '+15.5% vs prev 7 days' : '+12.2% vs prev 30 days';
  const netDiff = timeframe === '7d' ? '+20.7% vs prev 7 days' : '+18.5% vs prev 30 days';

  return (
    <div className="content-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
        
        {/* Main Chart Card */}
        <div className="card" style={{ padding: '32px' }}>
          
          {/* Chart Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                ${savedBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Net Balance ({timeframe === '7d' ? '7 Days' : '30 Days'})
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                
                {/* Timeframe selector dropdown */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      padding: '6px 12px', borderRadius: '6px', 
                      border: '1px solid var(--border-color)', background: 'var(--surface-color)',
                      color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer',
                      fontWeight: 500, transition: 'all 0.2s ease'
                    }}
                  >
                    {timeframe === '7d' ? '7 Days' : '30 Days'} <ChevronDown size={14} />
                  </button>
                  
                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 100,
                      minWidth: '100px',
                      overflow: 'hidden'
                    }}>
                      <button 
                        onClick={() => {
                          setTimeframe('7d');
                          setShowDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: timeframe === '7d' ? 'var(--surface-hover)' : 'transparent',
                          color: timeframe === '7d' ? 'var(--primary-color)' : 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        7 Days
                      </button>
                      <button 
                        onClick={() => {
                          setTimeframe('30d');
                          setShowDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: timeframe === '30d' ? 'var(--surface-hover)' : 'transparent',
                          color: timeframe === '30d' ? 'var(--primary-color)' : 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500
                        }}
                      >
                        30 Days
                      </button>
                    </div>
                  )}
                </div>

                {/* Chart Toggle button group */}
                <div style={{ 
                  display: 'flex', 
                  border: '1px solid var(--border-color)', borderRadius: '6px', 
                  padding: '2px', background: 'var(--surface-color)'
                }}>
                  <button 
                    onClick={() => setChartType('bar')}
                    style={{ 
                      padding: '4px 8px', borderRadius: '4px', border: 'none', 
                      background: chartType === 'bar' ? 'var(--surface-hover)' : 'transparent', 
                      color: chartType === 'bar' ? 'var(--primary-color)' : 'var(--text-tertiary)', 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                    }}
                    title="Bar Chart"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button 
                    onClick={() => setChartType('line')}
                    style={{ 
                      padding: '4px 8px', borderRadius: '4px', border: 'none', 
                      background: chartType === 'line' ? 'var(--surface-hover)' : 'transparent', 
                      color: chartType === 'line' ? 'var(--primary-color)' : 'var(--text-tertiary)', 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                    }}
                    title="Line Chart"
                  >
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>

              {/* Legends */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: COLORS.revenue, borderRadius: '2px' }}></span>
                  Revenue
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: COLORS.expenses, borderRadius: '2px' }}></span>
                  Expenses
                </span>
              </div>
            </div>
          </div>

          {/* Rendering the Chart based on selected Type */}
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              {chartType === 'bar' ? (
                <BarChart 
                  data={activeData} 
                  margin={{ top: 20, right: 0, left: -10, bottom: 0 }}
                  barSize={timeframe === '7d' ? 48 : 16}
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
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                    tickFormatter={(val) => '$' + (val * 100 / 1000).toFixed(0) + 'k'}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <ReferenceLine y={0} stroke="var(--border-color)" />
                  
                  <Bar dataKey="revenue" stackId="a" radius={[4, 4, 0, 0]}>
                    {activeData.map((entry, index) => (
                      <Cell 
                        key={`cell-revenue-${index}`} 
                        fill={activeIndex === -1 || activeIndex === index ? COLORS.revenue : COLORS.inactive} 
                        style={{ transition: 'fill 0.2s ease' }}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="expenses" stackId="b" radius={[0, 0, 4, 4]}>
                    {activeData.map((entry, index) => (
                      <Cell 
                        key={`cell-expenses-${index}`} 
                        fill={activeIndex === -1 || activeIndex === index ? COLORS.expenses : COLORS.inactive}
                        style={{ transition: 'fill 0.2s ease' }} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart 
                  data={activeData} 
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
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
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} 
                    tickFormatter={(val) => '$' + (val * 100 / 1000).toFixed(0) + 'k'}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="var(--border-color)" />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke={COLORS.revenue} 
                    strokeWidth={3} 
                    dot={timeframe === '7d'} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses" 
                    stroke={COLORS.expenses} 
                    strokeWidth={3} 
                    dot={timeframe === '7d'} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar Stats - Linked dynamically to computed timeframe summaries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              ${totalRevenue.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-green)' }}>
              <ArrowUpRight size={14} /> {revenueDiff}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Total Expenses
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              ${totalExpenses.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-amber)' }}>
              <ArrowUpRight size={14} /> {expensesDiff}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
              Net Profit
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
              ${savedBalance.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-green)' }}>
              <ArrowUpRight size={14} /> {netDiff}
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '32px' }}>
        
        {/* Cash Flow Projection */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '24px' }}>Cash Flow Projection (30 Days)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={CASH_FLOW_PROJECTION} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border-color)" strokeDasharray="3 3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickFormatter={(val) => "$" + (val/1000000).toFixed(1) + "M"} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => ["$" + value.toLocaleString(), 'Projected Reserves']}
                  labelFormatter={(value, items) => items[0]?.payload.fullDate || value}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Line type="monotone" dataKey="amount" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface-color)' }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary-hover)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Payments Status */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Vendor Payments</h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { vendor: 'McKesson Medical', amount: '$42,500', status: 'Pending', statusColor: 'var(--color-amber)', date: 'Due in 2 days' },
              { vendor: 'GE Healthcare', amount: '$18,200', status: 'Overdue', statusColor: 'var(--color-red)', date: '3 days overdue' },
              { vendor: 'Cerner Systems', amount: '$12,400', status: 'Scheduled', statusColor: 'var(--text-secondary)', date: 'Due in 5 days' },
              { vendor: 'Local Linen Supply', amount: '$3,800', status: 'Pending', statusColor: 'var(--color-amber)', date: 'Due tomorrow' }
            ].map((payment, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i === 3 ? 'none' : '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>{payment.vendor}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{payment.date}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{payment.amount}</div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: payment.statusColor,
                    backgroundColor: payment.status === 'Overdue' ? 'var(--color-red-bg)' : payment.status === 'Pending' ? 'var(--color-amber-bg)' : 'var(--surface-hover)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialDetails.config = {
  id: 'financial-details',
  label: 'Financial Details',
  title: 'Financial Details',
  icon: Wallet,
  order: 2
};

export default FinancialDetails;
