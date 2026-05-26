import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { denialReasons, denialTrend, deptDenials } from '../../data/rcmMockData';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';



export default function DenialInsights() {
  return (
    <div className="rcm-denial-distilled-grid">
      {/* Top Denial Reasons Column */}
      <div className="rcm-denial-col-reasons">
        <h2 className="card-title">Top Denial Reasons</h2>
        <div className="rcm-denial-reasons">
          {denialReasons.map((r, i) => (
            <div key={i} className="rcm-denial-reason-row">
              <div className="rcm-denial-reason-top">
                <span className="rcm-denial-reason-label">{r.reason}</span>
                <span className="rcm-denial-reason-count">{r.count} claims</span>
              </div>
              <div className="rcm-denial-bar-bg">
                <div
                  className="rcm-denial-bar-fill"
                  style={{ width: `${r.pct}%`, background: i < 2 ? 'var(--color-red)' : i < 4 ? 'var(--color-amber)' : 'var(--text-tertiary)' }}
                />
              </div>
              <span className="rcm-denial-pct">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Denial Trend Column */}
      <div className="rcm-denial-col-trend">
        <h2 className="card-title">Denial Trend (8 Weeks)</h2>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={denialTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="denialGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-red)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--color-red)' }}
              />
              <Area type="monotone" dataKey="denials" stroke="var(--color-red)" strokeWidth={2} fill="url(#denialGrad)" name="Denials" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="sub-label status-red" style={{ marginTop: 8 }}>
          <AlertTriangle size={13} /> Upward trend — 8-week high of 38 denials
        </p>
      </div>

      {/* Dept-wise Denial Column */}
      <div className="rcm-denial-col-table">
        <h2 className="card-title">Dept-wise Denial Analysis</h2>
        <table className="rcm-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Denials</th>
              <th>WoW Change</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deptDenials.map((d) => {
              const isUp = d.change.startsWith('+');
              const isFlat = d.change === '0%';
              const TIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
              const tColor = isFlat ? 'var(--text-secondary)' : isUp ? 'var(--color-red)' : 'var(--color-green)';
              const badgeClass = d.status === 'critical' ? 'badge-critical' : d.status === 'warning' ? 'badge-warning' : 'badge-normal';
              return (
                <tr key={d.dept}>
                  <td>{d.dept}</td>
                  <td><strong>{d.denials}</strong></td>
                  <td>
                    <span style={{ color: tColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TIcon size={13} />{d.change}
                    </span>
                  </td>
                  <td>
                    <span className={`rcm-status-badge ${badgeClass}`}>
                      {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
