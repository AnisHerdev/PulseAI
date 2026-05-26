import React from 'react';
import { RefreshCcw } from 'lucide-react';

const RevenueCycle = () => {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
          <RefreshCcw size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px', animation: 'spin 10s linear infinite' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Revenue Cycle Management</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
            This module is currently under active development. Future updates will include automated claims processing, denial logs, and billing insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export const config = {
  id: 'rcm',
  label: 'Revenue Cycle',
  title: 'Revenue Cycle Management',
  icon: RefreshCcw,
  order: 3
};

export default RevenueCycle;
