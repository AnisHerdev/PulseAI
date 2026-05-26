import React from 'react';
import { Wallet } from 'lucide-react';

const FinancialDetails = () => {
  return (
    <div className="content-wrapper">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">Financial Details Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          This page will contain deep-dive financial details, interactive charts, and payment breakdowns as requested.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {/* Scaffolding for the reference image UI */}
        <div className="card" style={{ minHeight: '300px' }}>
           <h3 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Analytics Placeholder</h3>
           <div style={{ height: '100%', background: 'var(--surface-hover)', borderRadius: '8px' }}></div>
        </div>
        <div className="card" style={{ minHeight: '300px' }}>
           <h3 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Statistics Placeholder</h3>
           <div style={{ height: '100%', background: 'var(--surface-hover)', borderRadius: '8px' }}></div>
        </div>
        <div className="card" style={{ minHeight: '300px', background: 'var(--primary-color)', color: 'white' }}>
           <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: 'rgba(255,255,255,0.8)' }}>Debit Card View</h3>
           <div style={{ height: '100%', borderRadius: '8px' }}></div>
        </div>
      </div>
    </div>
  );
};

export const config = {
  id: 'financial-details',
  label: 'Financial Details',
  title: 'Financial Details',
  icon: Wallet,
  order: 2
};

export default FinancialDetails;
