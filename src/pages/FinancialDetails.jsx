import { useState } from 'react';
import { Wallet, ChevronDown, BarChart2, TrendingUp, ArrowUpRight, Calendar } from 'lucide-react';
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
    const netProfit = data.revenue * 100 - Math.abs(data.expenses * 100);
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            fontSize: '14px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '8px',
            marginTop: '4px'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {netProfit >= 0 ? 'Profit' : 'Loss'}
            </span>
            <span style={{ 
              fontWeight: 700, 
              color: netProfit >= 0 ? 'var(--color-green)' : 'var(--color-red)' 
            }}>
              {netProfit >= 0 ? `+$${netProfit.toLocaleString()}` : `-$${Math.abs(netProfit).toLocaleString()}`}
            </span>
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(-1);

  const activeData = timeframe === '7d' ? FINANCIAL_DATA_7D : FINANCIAL_DATA_30D;

  const handleTimeframeChange = (val) => {
    setTimeframe(val);
    setSelectedDayIndex(-1);
    setShowDropdown(false);
  };

  const isDaySelected = selectedDayIndex !== -1 && selectedDayIndex < activeData.length;

  // Dynamic summary calculations based on timeframe total or selected day
  const totalRevenue = isDaySelected 
    ? activeData[selectedDayIndex].revenue * 100 
    : activeData.reduce((sum, d) => sum + d.revenue, 0) * 100;

  const totalExpenses = isDaySelected 
    ? Math.abs(activeData[selectedDayIndex].expenses) * 100 
    : activeData.reduce((sum, d) => sum + Math.abs(d.expenses), 0) * 100;

  const savedBalance = totalRevenue - totalExpenses;

  // Performance ratios vs previous period, or selected date label
  const revenueLabel = isDaySelected ? "Day Revenue" : "Total Revenue";
  const expensesLabel = isDaySelected ? "Day Expenses" : "Total Expenses";
  const netLabel = isDaySelected ? "Day Net Profit" : "Net Profit";

  const revenueDiff = timeframe === '7d' ? '+5.1% vs prev 7 days' : '+4.8% vs prev 30 days';
  const expensesDiff = timeframe === '7d' ? '+15.5% vs prev 7 days' : '+12.2% vs prev 30 days';
  const netDiff = timeframe === '7d' ? '+20.7% vs prev 7 days' : '+18.5% vs prev 30 days';

  const revenueDiffText = isDaySelected ? activeData[selectedDayIndex].fullDate : revenueDiff;
  const expensesDiffText = isDaySelected ? activeData[selectedDayIndex].fullDate : expensesDiff;
  const netDiffText = isDaySelected ? activeData[selectedDayIndex].fullDate : netDiff;

  // Visual highlight: prioritize hover activeIndex, fallback to selectedDayIndex
  const highlightIndex = activeIndex !== -1 ? activeIndex : selectedDayIndex;

  return (
    <div className="content-wrapper">
      <div className="fd-top-grid">
        
        {/* Main Chart Section */}
        <div className="fd-chart-section">
          
          {/* Chart Header Row */}
          <div className="fd-chart-header">
            <div>
              <div className="fd-chart-balance">
                ${savedBalance.toLocaleString()}
              </div>
              <div className="fd-chart-sub">
                {isDaySelected 
                  ? `Selected Day Net Profit (${activeData[selectedDayIndex].day})` 
                  : `Net Balance (${timeframe === '7d' ? '7 Days' : '30 Days'})`}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div className="fd-controls-row">
                
                {/* Timeframe selector dropdown */}
                <div className="fd-dropdown-container">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="fd-dropdown-btn"
                  >
                    {timeframe === '7d' ? '7 Days' : '30 Days'} <ChevronDown size={14} />
                  </button>
                  
                  {showDropdown && (
                    <div className="fd-dropdown-menu">
                      <button 
                        onClick={() => handleTimeframeChange('7d')}
                        className={`fd-dropdown-item ${timeframe === '7d' ? 'active' : ''}`}
                      >
                        7 Days
                      </button>
                      <button 
                        onClick={() => handleTimeframeChange('30d')}
                        className={`fd-dropdown-item ${timeframe === '30d' ? 'active' : ''}`}
                      >
                        30 Days
                      </button>
                    </div>
                  )}
                </div>

                {/* Chart Toggle button group */}
                <div className="fd-toggle-group">
                  <button 
                    onClick={() => setChartType('bar')}
                    className={`fd-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                    title="Bar Chart"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button 
                    onClick={() => setChartType('line')}
                    className={`fd-toggle-btn ${chartType === 'line' ? 'active' : ''}`}
                    title="Line Chart"
                  >
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>

              {/* Legends */}
              <div className="fd-legend-row">
                <span className="fd-legend-item">
                  <span className="fd-legend-dot revenue"></span>
                  Revenue
                </span>
                <span className="fd-legend-item">
                  <span className="fd-legend-dot expenses"></span>
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
                  onClick={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setSelectedDayIndex(selectedDayIndex === state.activeTooltipIndex ? -1 : state.activeTooltipIndex);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
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
                        fill={COLORS.revenue} 
                        opacity={highlightIndex === -1 || highlightIndex === index ? 1 : 0.35}
                        style={{ transition: 'opacity 0.2s ease' }}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(-1)}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="expenses" stackId="b" radius={[0, 0, 4, 4]}>
                    {activeData.map((entry, index) => (
                      <Cell 
                        key={`cell-expenses-${index}`} 
                        fill={COLORS.expenses}
                        opacity={highlightIndex === -1 || highlightIndex === index ? 1 : 0.35}
                        style={{ transition: 'opacity 0.2s ease' }} 
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(-1)}
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
                    } else {
                      setActiveIndex(-1);
                    }
                  }}
                  onMouseLeave={() => setActiveIndex(-1)}
                  onClick={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setSelectedDayIndex(selectedDayIndex === state.activeTooltipIndex ? -1 : state.activeTooltipIndex);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
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

        {/* Right Sidebar Stats - Linked dynamically to computed timeframe summaries or selected day */}
        <div className="fd-sidebar">
          {isDaySelected && (
            <button 
              onClick={() => setSelectedDayIndex(-1)}
              className="fd-sidebar-reset-btn"
            >
              ← Reset to totals
            </button>
          )}

          <div className="fd-sidebar-item">
            <div className="fd-sidebar-label">
              {revenueLabel}
            </div>
            <div className="fd-sidebar-value">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="fd-sidebar-trend" style={{ color: isDaySelected ? 'var(--text-secondary)' : 'var(--color-green)' }}>
              {isDaySelected ? <Calendar size={14} /> : <ArrowUpRight size={14} />} {revenueDiffText}
            </div>
          </div>

          <div className="fd-sidebar-item">
            <div className="fd-sidebar-label">
              {expensesLabel}
            </div>
            <div className="fd-sidebar-value">
              ${totalExpenses.toLocaleString()}
            </div>
            <div className="fd-sidebar-trend" style={{ color: isDaySelected ? 'var(--text-secondary)' : 'var(--color-amber)' }}>
              {isDaySelected ? <Calendar size={14} /> : <ArrowUpRight size={14} />} {expensesDiffText}
            </div>
          </div>

          <div className="fd-sidebar-item">
            <div className="fd-sidebar-label">
              {netLabel}
            </div>
            <div className="fd-sidebar-value">
              ${savedBalance.toLocaleString()}
            </div>
            <div className="fd-sidebar-trend" style={{ color: isDaySelected ? 'var(--text-secondary)' : 'var(--color-green)' }}>
              {isDaySelected ? <Calendar size={14} /> : <ArrowUpRight size={14} />} {netDiffText}
            </div>
          </div>
        </div>

      </div>

      <div className="fd-bottom-grid">
        
        {/* Cash Flow Projection */}
        <div className="fd-cash-flow-section">
          <h2 className="fd-section-title">Cash Flow Projection (30 Days)</h2>
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
        <div className="fd-vendor-section">
          <div className="fd-vendor-header-row">
            <h2 className="fd-section-title" style={{ margin: 0 }}>Vendor Payments</h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>View All</button>
          </div>
          
          <div className="fd-vendor-list">
            {[
              { vendor: 'McKesson Medical', amount: '$42,500', status: 'Pending', statusColor: 'var(--color-amber)', date: 'Due in 2 days' },
              { vendor: 'GE Healthcare', amount: '$18,200', status: 'Overdue', statusColor: 'var(--color-red)', date: '3 days overdue' },
              { vendor: 'Cerner Systems', amount: '$12,400', status: 'Scheduled', statusColor: 'var(--text-secondary)', date: 'Due in 5 days' },
              { vendor: 'Local Linen Supply', amount: '$3,800', status: 'Pending', statusColor: 'var(--color-amber)', date: 'Due tomorrow' }
            ].map((payment, i) => (
              <div key={i} className="fd-vendor-item">
                <div>
                  <div className="fd-vendor-name">{payment.vendor}</div>
                  <div className="fd-vendor-date">{payment.date}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div className="fd-vendor-amount">{payment.amount}</div>
                  <div className="fd-vendor-status" style={{ 
                    color: payment.statusColor,
                    backgroundColor: payment.status === 'Overdue' ? 'var(--color-red-bg)' : payment.status === 'Pending' ? 'var(--color-amber-bg)' : 'var(--surface-hover)',
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

