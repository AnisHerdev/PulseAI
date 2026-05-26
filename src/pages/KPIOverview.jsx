import React from 'react';
import { 
  ArrowDownRight, 
  AlertCircle, 
  Activity 
} from 'lucide-react';

const KPIOverview = () => {
  return (
    <div className="content-wrapper">
      <div className="kpi-section">
        <h3 className="kpi-section-title">Bed Utilization</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">Bed Occupancy Rate</h2>
            <div className="metric-number status-green">82%</div>
            <p className="sub-label">Target: 80-85%</p>
          </div>
          <div className="card">
            <h2 className="card-title">Average Length of Stay</h2>
            <div className="metric-number">4.2 <span style={{fontSize: '16px'}}>days</span></div>
            <p className="sub-label status-green"><ArrowDownRight size={14}/> 0.3 days vs last month</p>
          </div>
          <div className="card">
            <h2 className="card-title">Room Turnaround Time</h2>
            <div className="metric-number status-amber">48 <span style={{fontSize: '16px'}}>mins</span></div>
            <p className="sub-label status-amber">Target: &lt;45 mins</p>
          </div>
          <div className="card">
            <h2 className="card-title">Bed Turnover Rate</h2>
            <div className="metric-number">6.8</div>
            <p className="sub-label">Patients per bed per month</p>
          </div>
        </div>
      </div>

      <div className="kpi-section">
        <h3 className="kpi-section-title">Operational & Flow Metrics</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">OR Utilization</h2>
            <div className="metric-number status-green">76%</div>
            <p className="sub-label">Target: &gt;75%</p>
          </div>
          <div className="card">
            <h2 className="card-title">ER Wait Time</h2>
            <div className="metric-number status-red">34 <span style={{fontSize: '16px'}}>mins</span></div>
            <p className="sub-label status-red"><AlertCircle size={14}/> Target: &lt;30 mins</p>
          </div>
          <div className="card">
            <h2 className="card-title">Discharge Efficiency</h2>
            <div className="metric-number">2.5 <span style={{fontSize: '16px'}}>hrs</span></div>
            <p className="sub-label">Approval to exit</p>
          </div>
          <div className="card">
            <h2 className="card-title">Equipment Utilization (MRI)</h2>
            <div className="metric-number status-green">88%</div>
            <p className="sub-label">Healthy volume</p>
          </div>
        </div>
      </div>

      <div className="kpi-section">
        <h3 className="kpi-section-title">Staffing Ratios</h3>
        <div className="kpi-grid">
          <div className="card">
            <h2 className="card-title">Nurse to Patient (ICU)</h2>
            <div className="metric-number status-green">1:2</div>
            <p className="sub-label">Compliant</p>
          </div>
          <div className="card">
            <h2 className="card-title">Nurse to Patient (Gen)</h2>
            <div className="metric-number status-amber">1:7</div>
            <p className="sub-label status-amber">Target: 1:6</p>
          </div>
          <div className="card">
            <h2 className="card-title">Staff Utilization Rate</h2>
            <div className="metric-number">84%</div>
            <p className="sub-label">Billable vs idle time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const config = {
  id: 'kpi',
  label: 'KPI Overview',
  title: 'Operational KPI Overview',
  icon: Activity,
  order: 2
};

export default KPIOverview;
