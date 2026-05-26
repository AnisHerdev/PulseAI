import React, { useState } from 'react';
import { Users, ChevronDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Partners = ({ setActiveTab }) => {
  const [expandedPartner, setExpandedPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Auto-expand Insurance/TPA when navigating from CommandCenter
  React.useEffect(() => {
    setExpandedPartner(1);
  }, []);

  const partnersData = [
    {
      id: 1,
      type: 'Insurance / TPA',
      status: 'active',
      count: 12,
      integrationHealth: 98,
      uptime: '99.9%',
      lastSync: '2 mins ago',
      partners: [
        { name: 'Star Health', approvals: 2450, denials: 52, approvalRate: 97.9 },
        { name: 'MediAssist', approvals: 1800, denials: 37, approvalRate: 97.9 }
      ]
    },
    {
      id: 2,
      type: 'Labs',
      status: 'active',
      count: 8,
      integrationHealth: 95,
      uptime: '99.8%',
      lastSync: '5 mins ago',
      partners: [
        { name: 'Thyrocare', approvals: 1045, denials: 12, approvalRate: 98.9 },
        { name: 'Metropolis', approvals: 800, denials: 11, approvalRate: 98.6 }
      ]
    },
    {
      id: 3,
      type: 'Pharmacy Suppliers',
      status: 'active',
      count: 5,
      integrationHealth: 96,
      uptime: '99.9%',
      lastSync: '1 min ago',
      partners: [
        { name: 'Apollo Pharma', approvals: 892, denials: 12, approvalRate: 98.7 }
      ]
    },
    {
      id: 4,
      type: 'Ambulance Services',
      status: 'active',
      count: 6,
      integrationHealth: 92,
      uptime: '99.7%',
      lastSync: '10 mins ago',
      partners: [
        { name: 'Emergency Vendor A', approvals: 256, denials: 18, approvalRate: 93.4 },
        { name: 'Emergency Vendor B', approvals: 200, denials: 16, approvalRate: 92.6 }
      ]
    },
    {
      id: 5,
      type: 'Diagnostic Centers',
      status: 'active',
      count: 9,
      integrationHealth: 97,
      uptime: '99.9%',
      lastSync: '3 mins ago',
      partners: [
        { name: 'MRI/CT Scan Center 1', approvals: 1200, denials: 25, approvalRate: 97.9 },
        { name: 'MRI/CT Scan Center 2', approvals: 934, denials: 20, approvalRate: 97.9 }
      ]
    },
    {
      id: 6,
      type: 'Equipment Vendors',
      status: 'active',
      count: 7,
      integrationHealth: 94,
      uptime: '99.6%',
      lastSync: '15 mins ago',
      partners: [
        { name: 'Siemens', approvals: 345, denials: 38, approvalRate: 90.1 },
        { name: 'GE Healthcare', approvals: 222, denials: 18, approvalRate: 92.5 }
      ]
    },
    {
      id: 7,
      type: 'Blood Banks',
      status: 'active',
      count: 4,
      integrationHealth: 99,
      uptime: '100%',
      lastSync: '1 min ago',
      partners: [
        { name: 'Central Blood Bank', approvals: 789, denials: 5, approvalRate: 99.4 }
      ]
    },
    {
      id: 8,
      type: 'Telemedicine Providers',
      status: 'active',
      count: 3,
      integrationHealth: 93,
      uptime: '99.5%',
      lastSync: '8 mins ago',
      partners: [
        { name: 'Online Consult Partner 1', approvals: 389, denials: 15, approvalRate: 96.3 },
        { name: 'Online Consult Partner 2', approvals: 234, denials: 13, approvalRate: 94.7 }
      ]
    }
  ];

  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch = partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.partners.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || partner.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    if (status === 'active') return <CheckCircle size={18} style={{ color: '#10b981' }} />;
    if (status === 'warning') return <AlertCircle size={18} style={{ color: '#f59e0b' }} />;
    return <Clock size={18} style={{ color: '#6b7280' }} />;
  };

  const getHealthColor = (health) => {
    if (health >= 95) return '#10b981';
    if (health >= 90) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="content-wrapper">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Partner Network Management
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Partners</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {partnersData.reduce((sum, p) => sum + p.count, 0)}
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Categories</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {filteredPartners.length}/8
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Avg Health</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                {Math.round(partnersData.reduce((sum, p) => sum + p.integrationHealth, 0) / partnersData.length)}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>All Active</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredPartners.map(partner => (
              <div
                key={partner.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
              >
                <div
                  style={{
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getStatusIcon(partner.status)}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {partner.type}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {partner.count} partners
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Health Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${partner.integrationHealth}%`,
                            background: getHealthColor(partner.integrationHealth),
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', minWidth: '30px' }}>
                        {partner.integrationHealth}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Uptime
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {partner.uptime}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Last Sync
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {partner.lastSync}
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    style={{
                      color: 'var(--text-secondary)',
                      transform: expandedPartner === partner.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>

                {expandedPartner === partner.id && (
                  <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Individual Partner Performance
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ textAlign: 'left', padding: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Partner Name</th>
                            <th style={{ textAlign: 'right', padding: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Approvals</th>
                            <th style={{ textAlign: 'right', padding: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Denials</th>
                            <th style={{ textAlign: 'right', padding: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Approval Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partner.partners.map((p, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ textAlign: 'left', padding: '12px 10px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                {p.name}
                              </td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', color: '#10b981', fontWeight: 600 }}>
                                {p.approvals.toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', color: '#ef4444', fontWeight: 600 }}>
                                {p.denials}
                              </td>
                              <td style={{ textAlign: 'right', padding: '12px 10px', color: '#2563eb', fontWeight: 700 }}>
                                {p.approvalRate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <Users size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '16px', display: 'block' }} />
              <p>No partners found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Partners.config = {
  id: 'partners',
  label: 'Third-Party Partners',
  title: 'Third-Party Partners',
  icon: Users,
  order: 4
};

export default Partners;
