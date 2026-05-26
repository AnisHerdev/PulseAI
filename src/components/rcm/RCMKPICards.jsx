import React from 'react';
import {
  FileText, CheckCircle, Clock, XCircle, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { rcmKPIs } from '../../data/rcmMockData';

const ICONS = { FileText, CheckCircle, Clock, XCircle, TrendingUp, DollarSign };

const COLOR_MAP = {
  blue:  { border: '#2563eb', bg: 'rgba(37,99,235,0.08)',  icon: '#2563eb' },
  green: { border: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: '#10b981' },
  amber: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '#f59e0b' },
  red:   { border: '#ef4444', bg: 'rgba(239,68,68,0.08)',  icon: '#ef4444' },
};

export default function RCMKPICards() {
  return (
    <div className="rcm-kpi-grid">
      {rcmKPIs.map((kpi) => {
        const Icon = ICONS[kpi.icon];
        const c = COLOR_MAP[kpi.color];
        const TrendIcon = kpi.trendUp ? ArrowUpRight : ArrowDownRight;
        const trendColor = kpi.trendUp ? 'var(--color-green)' : 'var(--color-red)';
        return (
          <div
            key={kpi.id}
            className="rcm-kpi-card"
            style={{ borderColor: c.border }}
          >
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
