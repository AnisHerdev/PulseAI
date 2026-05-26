import RCMKPICards from './RCMKPICards';
import RevenuePipeline from './RevenuePipeline';
import ClaimsAnalytics from './ClaimsAnalytics';
import DenialInsights from './DenialInsights';
import ARAgingChart from './ARAgingChart';
import FinancialAlerts from './FinancialAlerts';
import AIFinancialSummary from './AIFinancialSummary';

const SectionTitle = ({ title, subtitle }) => (
  <div className="rcm-section-title-wrap">
    <h3 className="rcm-section-title">{title}</h3>
    {subtitle && <span className="rcm-section-subtitle">{subtitle}</span>}
  </div>
);

export default function RCMPage() {
  return (
    <div className="content-wrapper rcm-page">

      {/* 1. KPI Cards */}
      <SectionTitle title="Claims Overview" subtitle="Month-to-date performance" />
      <RCMKPICards />

      {/* 2. Pipeline */}
      <SectionTitle title="Revenue Cycle Pipeline" subtitle="End-to-end claim flow" />
      <RevenuePipeline />

      {/* 3. Claims Analytics */}
      <SectionTitle title="Insurance Claims Analytics" subtitle="Approval rates & payer performance" />
      <ClaimsAnalytics />

      {/* 4. Denial Insights */}
      <SectionTitle title="Claim Denial Insights" subtitle="Root cause & department analysis" />
      <DenialInsights />

      {/* 5. AR Aging */}
      <SectionTitle title="Accounts Receivable Aging" subtitle="Outstanding receivables by age bucket" />
      <ARAgingChart />

      {/* 6. Alerts + AI Summary side by side */}
      <div className="rcm-bottom-grid">
        <FinancialAlerts />
        <AIFinancialSummary />
      </div>

    </div>
  );
}
