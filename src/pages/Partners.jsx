import React from 'react';
import { Users } from 'lucide-react';

const Partners = () => {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
          <Users size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Third-Party Partners</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
            This module is currently under active development. Future updates will include partner network health, integration metrics, and insurance provider logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export const config = {
  id: 'partners',
  label: 'Third-Party Partners',
  title: 'Third-Party Partners',
  icon: Users,
  order: 4
};

export default Partners;
