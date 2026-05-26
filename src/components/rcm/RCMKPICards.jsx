import {
  FileText, CheckCircle, Clock, XCircle, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { rcmKPIs } from '../../data/rcmMockData';

const ICONS = { FileText, CheckCircle, Clock, XCircle, TrendingUp, DollarSign };

const COLOR_MAP = {
  blue:  { bg: 'var(--primary-color-bg)',  icon: 'var(--primary-color)' },
  green: { bg: 'var(--color-green-bg)', icon: 'var(--color-green)' },
  amber: { bg: 'var(--color-amber-bg)', icon: 'var(--color-amber)' },
  red:   { bg: 'var(--color-red-bg)',  icon: 'var(--color-red)' },
};

export default function RCMKPICards() {
  return (
    <div className="rcm-executive-strip">
      {rcmKPIs.map((kpi) => {
        const Icon = ICONS[kpi.icon];
        const c = COLOR_MAP[kpi.color];
        const TrendIcon = kpi.trendUp ? ArrowUpRight : ArrowDownRight;
        const trendColor = kpi.trendUp ? 'var(--color-green)' : 'var(--color-red)';
        return (
          <div key={kpi.id} className="rcm-strip-item">
            <div className="rcm-kpi-top">
              <span className="rcm-kpi-label">{kpi.label}</span>
              <span className="rcm-kpi-icon-wrap" style={{ background: c.bg }}>
                <Icon size={16} style={{ color: c.icon }} />
              </span>
            </div>
            <div className="rcm-kpi-value">{kpi.value}</div>
            <div className="rcm-kpi-footer">
              <span className="rcm-kpi-trend" style={{ color: trendColor }}>
                <TrendIcon size={13} />
                {kpi.trend}
              </span>
              <span className="rcm-kpi-sub">{kpi.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
