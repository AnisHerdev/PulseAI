import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { claimStatusDonut, claimsApprovalTrend } from '../../data/rcmMockData';
import { Timer } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rcm-tooltip">
      <span>{payload[0].name}: <strong>{payload[0].value}%</strong></span>
    </div>
  );
};

const DONUT_COLORS = {
  'Approved': 'var(--color-green)',
  'Pending': 'var(--color-amber)',
  'Rejected': 'var(--color-red)',
};

export default function ClaimsAnalytics() {
  return (
    <div className="rcm-claims-distilled-grid">
      {/* Donut Column */}
      <div className="rcm-claims-col-donut">
        <h2 className="card-title">Claim Status Distribution</h2>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={claimStatusDonut}
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {claimStatusDonut.map((entry, i) => (
                  <Cell key={i} fill={DONUT_COLORS[entry.name] || entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rcm-donut-legend">
          {claimStatusDonut.map((d) => {
            const col = DONUT_COLORS[d.name] || d.color;
            return (
              <div key={d.name} className="rcm-legend-item">
                <span className="rcm-legend-dot" style={{ background: col }} />
                <span>{d.name}</span>
                <strong style={{ color: col }}>{d.value}%</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar Chart Column */}
      <div className="rcm-claims-col-trend">
        <h2 className="card-title">Approval vs Rejection Trend (7M)</h2>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={claimsApprovalTrend} barSize={14} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
                formatter={(v) => `${v}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              <Bar dataKey="approved" name="Approved %" fill="var(--color-green)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected %" fill="var(--color-red)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Avg Approval Time Column */}
      <div className="rcm-claims-col-time">
        <h2 className="card-title">Avg Approval Time</h2>
        <div className="rcm-approval-time-body">
          <div className="rcm-approval-icon-wrap">
            <Timer size={28} style={{ color: 'var(--color-amber)' }} />
          </div>
          <div className="rcm-approval-value">7.8 <span>days</span></div>
          <p className="sub-label" style={{ color: 'var(--color-amber)' }}>Target: ≤ 7 days</p>
        </div>
        <div className="rcm-payer-list">
          {[
            { name: 'BlueCross', days: 9.4, status: 'red' },
            { name: 'Aetna', days: 6.8, status: 'green' },
            { name: 'UnitedHealth', days: 7.2, status: 'amber' },
            { name: 'Cigna', days: 5.9, status: 'green' },
          ].map((p) => (
            <div key={p.name} className="rcm-payer-row">
              <span>{p.name}</span>
              <strong className={`status-${p.status}`}>{p.days}d</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
