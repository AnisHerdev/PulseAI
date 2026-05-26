import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { arAgingData } from '../../data/rcmMockData';
import { AlertCircle } from 'lucide-react';

const fmt = (v) => `$${(v / 1000000).toFixed(2)}M`;

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
};

export default function ARAgingChart() {
  const total = arAgingData.reduce((s, d) => s + d.amount, 0);
  const over60 = arAgingData.filter(d => ['61–90 Days', '90+ Days'].includes(d.bucket))
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="rcm-ar-grid">
      {/* Bar chart */}
      <div className="card" style={{ flex: 2 }}>
        <h2 className="card-title">Accounts Receivable Aging</h2>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={arAgingData} barSize={48} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="bucket" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={fmt} style={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
                formatter={(v) => [fmt(v), 'AR Amount']}
              />
              <Bar dataKey="amount" shape={<CustomBar />}>
                {arAgingData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary cards */}
      <div className="rcm-ar-summary">
        <div className="card rcm-ar-total-card">
          <h2 className="card-title">Total AR</h2>
          <div className="metric-number">{fmt(total)}</div>
          <p className="sub-label">Across all aging buckets</p>
        </div>
        <div className="card" style={{ borderColor: '#ef4444' }}>
          <h2 className="card-title">At-Risk AR (&gt;60 Days)</h2>
          <div className="metric-number status-red">{fmt(over60)}</div>
          <p className="sub-label status-red">
            <AlertCircle size={13} />
            {((over60 / total) * 100).toFixed(1)}% of total AR
          </p>
        </div>
        <div className="card">
          <h2 className="card-title">Aging Breakdown</h2>
          {arAgingData.map((d) => (
            <div key={d.bucket} className="rcm-aging-row">
              <span className="rcm-aging-dot" style={{ background: d.color }} />
              <span className="rcm-aging-bucket">{d.bucket}</span>
              <span className="rcm-aging-amount" style={{ color: d.color }}>{d.label}</span>
              <span className="rcm-aging-pct">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
