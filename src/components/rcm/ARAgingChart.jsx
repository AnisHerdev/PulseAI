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

const BUCKET_COLORS = {
  '0–30 Days': 'var(--color-green)',
  '31–60 Days': 'var(--color-amber)',
  '61–90 Days': 'oklch(0.65 0.17 45)',
  '90+ Days': 'var(--color-red)',
};

export default function ARAgingChart() {
  const total = arAgingData.reduce((s, d) => s + d.amount, 0);
  const over60 = arAgingData.filter(d => ['61–90 Days', '90+ Days'].includes(d.bucket))
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="rcm-ar-distilled-grid">
      {/* Bar chart Column */}
      <div className="rcm-ar-col-chart">
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
                  <Cell key={i} fill={BUCKET_COLORS[entry.bucket] || entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Column */}
      <div className="rcm-ar-col-summary">
        <div className="rcm-ar-stat-block">
          <span className="rcm-ar-stat-label">Total AR</span>
          <div className="metric-number">{fmt(total)}</div>
          <p className="sub-label">Across all aging buckets</p>
        </div>
        
        <div className="rcm-ar-stat-block">
          <span className="rcm-ar-stat-label">At-Risk AR (&gt;60 Days)</span>
          <div className="metric-number status-red">{fmt(over60)}</div>
          <p className="sub-label status-red">
            <AlertCircle size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {((over60 / total) * 100).toFixed(1)}% of total AR
          </p>
        </div>

        <div className="rcm-ar-breakdown-block">
          <span className="rcm-ar-stat-label">Aging Breakdown</span>
          <div style={{ marginTop: '8px' }}>
            {arAgingData.map((d) => {
              const col = BUCKET_COLORS[d.bucket] || d.color;
              return (
                <div key={d.bucket} className="rcm-aging-row">
                  <span className="rcm-aging-dot" style={{ background: col }} />
                  <span className="rcm-aging-bucket">{d.bucket}</span>
                  <span className="rcm-aging-amount" style={{ color: col }}>{d.label}</span>
                  <span className="rcm-aging-pct">{d.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
