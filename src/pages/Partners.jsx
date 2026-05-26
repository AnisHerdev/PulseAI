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
      examples: ['Star Health', 'MediAssist'],
      status: 'active',
      count: 12,
      integrationHealth: 98,
      uptime: '99.9%',
      lastSync: '2 mins ago',
      description: 'Third-party administrators and insurance providers for claims and coverage management'
    },
    {
      id: 2,
      type: 'Labs',
      examples: ['Thyrocare', 'Metropolis'],
      status: 'active',
      count: 8,
      integrationHealth: 95,
      uptime: '99.8%',
      lastSync: '5 mins ago',
      description: 'Laboratory networks for test processing and results management'
    },
    {
      id: 3,
      type: 'Pharmacy Suppliers',
      examples: ['Apollo Pharma'],
      status: 'active',
      count: 5,
      integrationHealth: 96,
      uptime: '99.9%',
      lastSync: '1 min ago',
      description: 'Pharmaceutical suppliers for medication ordering and inventory management'
    },
    {
      id: 4,
      type: 'Ambulance Services',
      examples: ['Emergency vendors'],
      status: 'active',
      count: 6,
      integrationHealth: 92,
      uptime: '99.7%',
      lastSync: '10 mins ago',
      description: 'Emergency transport and ambulance service providers'
    },
    {
      id: 5,
      type: 'Diagnostic Centers',
      examples: ['MRI/CT scan vendors'],
      status: 'active',
      count: 9,
      integrationHealth: 97,
      uptime: '99.9%',
      lastSync: '3 mins ago',
      description: 'Advanced diagnostic imaging centers and facilities'
    },
    {
      id: 6,
      type: 'Equipment Vendors',
      examples: ['Siemens', 'GE Healthcare'],
      status: 'active',
      count: 7,
      integrationHealth: 94,
      uptime: '99.6%',
      lastSync: '15 mins ago',
      description: 'Medical equipment manufacturers and suppliers'
    },
    {
      id: 7,
      type: 'Blood Banks',
      examples: ['External blood suppliers'],
      status: 'active',
      count: 4,
      integrationHealth: 99,
      uptime: '100%',
      lastSync: '1 min ago',
      description: 'Blood storage and transfusion service providers'
    },
    {
      id: 8,
      type: 'Telemedicine Providers',
      examples: ['Online consultation partners'],
      status: 'active',
      count: 3,
      integrationHealth: 93,
      uptime: '99.5%',
      lastSync: '8 mins ago',
      description: 'Remote consultation and telehealth service platforms'
    }
  ];

  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch = partner.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.examples.some(ex => ex.toLowerCase().includes(searchTerm.toLowerCase()));
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
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Description
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {partner.description}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Partner Examples
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {partner.examples.map((example, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-block',
                              background: 'var(--bg-secondary)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {example}
                          </span>
                        ))}
                      </div>
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

export const config = {
  id: 'partners',
  label: 'Third-Party Partners',
  title: 'Third-Party Partners',
  icon: Users,
  order: 4
};

export default Partners;
