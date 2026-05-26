import { financialAlerts } from '../../data/rcmMockData';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const SEV_CONFIG = {
  critical: { icon: AlertCircle,   color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   label: 'Critical', dot: true },
  warning:  { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  label: 'Warning',  dot: true },
  stable:   { icon: CheckCircle,   color: '#10b981', bg: 'rgba(16,185,129,0.08)',  label: 'Stable',   dot: false },
};

export default function FinancialAlerts() {
  return (
    <div className="card rcm-alerts-card">
      <div className="rcm-alerts-header">
        <h2 className="card-title" style={{ margin: 0 }}>Financial Alerts</h2>
        <div className="rcm-alerts-counts">
          <span className="rcm-alert-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            {financialAlerts.filter(a => a.severity === 'critical').length} Critical
          </span>
          <span className="rcm-alert-badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            {financialAlerts.filter(a => a.severity === 'warning').length} Warning
          </span>
        </div>
      </div>
      <div className="rcm-alerts-list">
        {financialAlerts.map((alert) => {
          const cfg = SEV_CONFIG[alert.severity];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className="rcm-alert-item" style={{ borderLeftColor: cfg.color, background: cfg.bg }}>
              <div className="rcm-alert-icon-wrap">
                <Icon size={16} style={{ color: cfg.color }} />
                {cfg.dot && <span className="rcm-alert-blink" style={{ background: cfg.color }} />}
              </div>
              <div className="rcm-alert-body">
                <div className="rcm-alert-title-row">
                  <span className="rcm-alert-title">{alert.title}</span>
                  <span className="rcm-alert-time">{alert.time}</span>
                </div>
                <p className="rcm-alert-detail">{alert.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
