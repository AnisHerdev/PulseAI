import { financialAlerts } from '../../data/rcmMockData';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const SEV_CONFIG = {
  critical: { icon: AlertCircle,   color: 'var(--color-red)', bg: 'var(--color-red-bg)',   label: 'Critical', dot: true },
  warning:  { icon: AlertTriangle, color: 'var(--color-amber)', bg: 'var(--color-amber-bg)',  label: 'Warning',  dot: true },
  stable:   { icon: CheckCircle,   color: 'var(--color-green)', bg: 'var(--color-green-bg)',  label: 'Stable',   dot: false },
};

export default function FinancialAlerts() {
  return (
    <div className="card rcm-alerts-card">
      <div className="rcm-alerts-header">
        <h2 className="card-title" style={{ margin: 0 }}>Financial Alerts</h2>
        <div className="rcm-alerts-counts">
          <span className="rcm-alert-badge" style={{ background: 'var(--color-red-bg)', color: 'var(--color-red)', border: '1px solid var(--color-red)' }}>
            {financialAlerts.filter(a => a.severity === 'critical').length} Critical
          </span>
          <span className="rcm-alert-badge" style={{ background: 'var(--color-amber-bg)', color: 'var(--color-amber)', border: '1px solid var(--color-amber)' }}>
            {financialAlerts.filter(a => a.severity === 'warning').length} Warning
          </span>
        </div>
      </div>
      <div className="rcm-alerts-list">
        {financialAlerts.map((alert) => {
          const cfg = SEV_CONFIG[alert.severity];
          const Icon = cfg.icon;
          return (
            <div 
              key={alert.id} 
              className="rcm-alert-item" 
              style={{ borderColor: cfg.color, background: cfg.bg }}
            >
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
