import React from 'react';
import { FileBarChart } from 'lucide-react';

const Reports = () => {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
          <FileBarChart size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Reports & Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
            This module is currently under active development. Future updates will include automated PDF generation, scheduled email reports, and custom analytics builders.
          </p>
        </div>
      </div>
    </div>
  );
};

export const config = {
  id: 'reports',
  label: 'Reports',
  title: 'Reports & Analytics',
  icon: FileBarChart,
  order: 5
};

export default Reports;
