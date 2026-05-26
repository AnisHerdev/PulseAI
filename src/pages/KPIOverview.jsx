
import { 
  ArrowDownRight, 
  AlertCircle, 
  Activity,
  BedDouble,
  Users
} from 'lucide-react';

const KPIOverview = () => {
  return (
    <div className="content-wrapper">
      <div className="kpi-section-distilled">
        <h3 className="kpi-section-title">
          <span className="kpi-section-icon-wrapper theme-primary">
            <BedDouble size={16} />
          </span>
          Bed Utilization
        </h3>
        <div className="kpi-strip">
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Bed Occupancy Rate</span>
            <div className="kpi-strip-number status-green">82%</div>
            <div className="kpi-progress-bar" aria-hidden="true">
              <div className="kpi-progress-fill status-green" style={{ width: '82%' }}></div>
            </div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-green">Target: 80-85%</span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Average Length of Stay</span>
            <div className="kpi-strip-number">4.2 <span className="kpi-strip-unit">days</span></div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-green">
                <ArrowDownRight size={14}/> 0.3 days vs last month
              </span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Room Turnaround Time</span>
            <div className="kpi-strip-number status-amber">48 <span className="kpi-strip-unit">mins</span></div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-amber">Target: &lt;45 mins</span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Bed Turnover Rate</span>
            <div className="kpi-strip-number">6.8</div>
            <p className="kpi-strip-sub">Patients per bed per month</p>
          </div>
        </div>
      </div>

      <div className="kpi-section-distilled">
        <h3 className="kpi-section-title">
          <span className="kpi-section-icon-wrapper theme-green">
            <Activity size={16} />
          </span>
          Operational & Flow Metrics
        </h3>
        <div className="kpi-strip">
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">OR Utilization</span>
            <div className="kpi-strip-number status-green">76%</div>
            <div className="kpi-progress-bar" aria-hidden="true">
              <div className="kpi-progress-fill status-green" style={{ width: '76%' }}></div>
            </div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-green">Target: &gt;75%</span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">ER Wait Time</span>
            <div className="kpi-strip-number status-red">34 <span className="kpi-strip-unit">mins</span></div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-red">
                <AlertCircle size={14}/> Target: &lt;30 mins
              </span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Discharge Efficiency</span>
            <div className="kpi-strip-number">2.5 <span className="kpi-strip-unit">hrs</span></div>
            <p className="kpi-strip-sub">Approval to exit</p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Equipment Utilization (MRI)</span>
            <div className="kpi-strip-number status-green">88%</div>
            <div className="kpi-progress-bar" aria-hidden="true">
              <div className="kpi-progress-fill status-green" style={{ width: '88%' }}></div>
            </div>
            <p className="kpi-strip-sub">Healthy volume</p>
          </div>
        </div>
      </div>

      <div className="kpi-section-distilled" style={{ borderBottom: 'none' }}>
        <h3 className="kpi-section-title">
          <span className="kpi-section-icon-wrapper theme-amber">
            <Users size={16} />
          </span>
          Staffing Ratios
        </h3>
        <div className="kpi-strip">
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Nurse to Patient (ICU)</span>
            <div className="kpi-strip-number status-green">1:2</div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-green">Compliant</span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Nurse to Patient (Gen)</span>
            <div className="kpi-strip-number status-amber">1:7</div>
            <p className="kpi-strip-sub">
              <span className="kpi-badge status-amber">Target: 1:6</span>
            </p>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-label">Staff Utilization Rate</span>
            <div className="kpi-strip-number">84%</div>
            <div className="kpi-progress-bar" aria-hidden="true">
              <div className="kpi-progress-fill status-primary" style={{ width: '84%' }}></div>
            </div>
            <p className="kpi-strip-sub">Billable vs idle time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

KPIOverview.config = {
  id: 'kpi',
  label: 'KPI Overview',
  title: 'Operational KPI Overview',
  icon: Activity,
  order: 2
};

export default KPIOverview;
