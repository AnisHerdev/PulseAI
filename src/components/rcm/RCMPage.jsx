import RCMKPICards from './RCMKPICards';
import RevenuePipeline from './RevenuePipeline';
import ClaimsAnalytics from './ClaimsAnalytics';
import DenialInsights from './DenialInsights';
import ARAgingChart from './ARAgingChart';
import FinancialAlerts from './FinancialAlerts';
import AIFinancialSummary from './AIFinancialSummary';

const SectionDivider = ({ label, sub }) => (
  <div className="rcm-section-divider">
    <span className="rcm-section-divider-label">{label}</span>
    {sub && <span className="rcm-section-divider-sub">{sub}</span>}
  </div>
);

export default function RCMPage() {
  return (
    <div className="content-wrapper rcm-page">

      {/* 1. Claims Overview — Executive Strip */}
      <SectionDivider label="Claims Overview" sub="Month-to-date performance" />
      <RCMKPICards />

      {/* 2. Revenue Cycle Pipeline */}
      <SectionDivider label="Revenue Cycle Pipeline" sub="End-to-end claim flow" />
      <RevenuePipeline />

      {/* 3. Claims Analytics — distilled 3-col */}
      <SectionDivider label="Insurance Claims Analytics" sub="Approval rates & payer performance" />
      <ClaimsAnalytics />

      {/* 4. Denial Insights — distilled 3-col */}
      <SectionDivider label="Claim Denial Insights" sub="Root cause & department analysis" />
      <DenialInsights />

      {/* 5. AR Aging — distilled 2-col */}
      <SectionDivider label="Accounts Receivable Aging" sub="Outstanding receivables by age bucket" />
      <ARAgingChart />

      {/* 6. Financial Alerts + AI Summary */}
      <SectionDivider label="Financial Alerts & AI Summary" sub="Live risk signals and executive intelligence" />
      <div className="rcm-bottom-grid">
        <FinancialAlerts />
        <AIFinancialSummary />
      </div>

    </div>
  );
}
