import React from 'react';
import { pipelineStages } from '../../data/rcmMockData';
import { ChevronRight } from 'lucide-react';

export default function RevenuePipeline() {
  return (
    <div className="card rcm-pipeline-card">
      <h2 className="card-title">Revenue Cycle Pipeline</h2>
      <div className="rcm-pipeline-row">
        {pipelineStages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <div className="rcm-pipeline-stage">
              {/* Progress ring */}
              <div className="rcm-pipeline-ring-wrap">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border-color)" strokeWidth="5" />
                  <circle
                    cx="36" cy="36" r="30"
                    fill="none"
                    stroke={stage.color}
                    strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - stage.pct / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                  <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={stage.color}>
                    {stage.pct}%
                  </text>
                </svg>
              </div>
              <div className="rcm-pipeline-label">{stage.label}</div>
              <div className="rcm-pipeline-count" style={{ color: stage.color }}>
                {stage.count.toLocaleString()}
              </div>
              <div className="rcm-pipeline-amount">{stage.amount}</div>
            </div>
            {i < pipelineStages.length - 1 && (
              <ChevronRight size={20} className="rcm-pipeline-arrow" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
