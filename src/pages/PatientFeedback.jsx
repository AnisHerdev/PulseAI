import React, { useState } from 'react';
import {
  RefreshCw,
  Star,
  MessageSquare,
  Users,
  Bot,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useReviewStream } from '../hooks/useReviewStream.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(timestamp) {
  if (!timestamp) return '—';
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function getSignalClass(signal) {
  switch (signal) {
    case 'Review Needed': return 'signal-red';
    case 'Strong Positive Signal': return 'signal-green';
    default: return 'signal-neutral';
  }
}

function getStarColor(rating) {
  if (rating >= 4) return 'var(--color-green)';
  if (rating === 3) return 'var(--color-amber)';
  return 'var(--color-red)';
}

// ── Component ────────────────────────────────────────────────────────────────

const PatientFeedback = () => {
  const { reviews, reviewSummary, staffReports, aggregates, lastReviewTime, refreshReviewSummary } = useReviewStream();

  // Force re-render of timeAgo labels
  const [, setTick] = useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const lowMidCount = (aggregates.ratingCounts[1] || 0) + (aggregates.ratingCounts[2] || 0) + (aggregates.ratingCounts[3] || 0);
  const highCount = (aggregates.ratingCounts[4] || 0) + (aggregates.ratingCounts[5] || 0);

  return (
    <div className="content-wrapper">
      {/* Live indicator */}
      <div className="live-indicator">
        <span className="pulse-dot" />
        <span className="live-label">Live Review Stream</span>
        <span className="live-timestamp">Last review: {timeAgo(lastReviewTime)}</span>
      </div>

      {/* ROW 1: Summary Stats */}
      <div className="fb-stats-row">
        <div className="card fb-stat-card">
          <div className="fb-stat-icon-wrap fb-stat-blue">
            <MessageSquare size={20} />
          </div>
          <div className="fb-stat-content">
            <span className="fb-stat-value">{aggregates.totalReviews}</span>
            <span className="fb-stat-label">Total Reviews</span>
          </div>
        </div>
        <div className="card fb-stat-card">
          <div className="fb-stat-icon-wrap fb-stat-amber">
            <Star size={20} />
          </div>
          <div className="fb-stat-content">
            <span className="fb-stat-value">{aggregates.averageRating.toFixed(1)}</span>
            <span className="fb-stat-label">Avg Rating</span>
          </div>
        </div>
        <div className="card fb-stat-card">
          <div className="fb-stat-icon-wrap fb-stat-green">
            <ThumbsUp size={20} />
          </div>
          <div className="fb-stat-content">
            <span className="fb-stat-value status-green">{highCount}</span>
            <span className="fb-stat-label">Positive (4-5★)</span>
          </div>
        </div>
        <div className="card fb-stat-card">
          <div className="fb-stat-icon-wrap fb-stat-red">
            <ThumbsDown size={20} />
          </div>
          <div className="fb-stat-content">
            <span className="fb-stat-value status-red">{lowMidCount}</span>
            <span className="fb-stat-label">Low / Mid (1-3★)</span>
          </div>
        </div>
      </div>

      {/* ROW 2: AI Pain-Point Summary + Rating Distribution */}
      <div className="fb-row-2">
        {/* AI Review Summary */}
        <div className="card review-summary-card">
          <div className="card-header-row">
            <h2 className="card-title">
              <Bot size={16} className="card-title-icon" /> AI Pain-Point Summary
            </h2>
            <button
              className="refresh-btn"
              onClick={refreshReviewSummary}
              disabled={reviewSummary.loading}
              title="Refresh Feedback Summary"
            >
              <RefreshCw size={14} className={reviewSummary.loading ? 'spin' : ''} />
            </button>
          </div>
          <p className="ai-summary-text">
            {reviewSummary.loading && !reviewSummary.summary
              ? 'Analyzing patient feedback...'
              : reviewSummary.summary || 'Collecting reviews — summary will appear after enough feedback is gathered...'}
          </p>
          <div className="summary-footer">
            <span className="timestamp-label">
              {reviewSummary.timestamp ? `Generated ${timeAgo(reviewSummary.timestamp)}` : 'Pending'}
            </span>
            {reviewSummary.model && (
              <span className={`model-badge ${reviewSummary.fallback ? 'badge-fallback' : ''}`}>
                {reviewSummary.fallback ? 'Fallback' : reviewSummary.model}
              </span>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="card">
          <h2 className="card-title">
            <Star size={16} className="card-title-icon" /> Rating Distribution
          </h2>
          <div className="rating-bar-container" style={{ marginTop: '4px' }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = aggregates.ratingCounts[star] || 0;
              const pct = aggregates.totalReviews > 0 ? (count / aggregates.totalReviews) * 100 : 0;
              return (
                <div key={star} className="rating-bar-row" style={{ padding: '4px 0' }}>
                  <span className="rating-bar-label">{star}★</span>
                  <div className="rating-bar-track" style={{ height: '12px' }}>
                    <div
                      className={`rating-bar-fill-inner ${star >= 4 ? 'bar-green' : star === 3 ? 'bar-amber' : 'bar-red'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="rating-bar-count" style={{ width: '48px' }}>
                    {count} ({pct.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Department Breakdown */}
          <h3 className="fb-subsection-title">By Department</h3>
          <div className="fb-dept-chips">
            {Object.entries(aggregates.departmentCounts || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([dept, count]) => (
                <span key={dept} className="fb-dept-chip">
                  {dept} <strong>{count}</strong>
                </span>
              ))}
            {Object.keys(aggregates.departmentCounts || {}).length === 0 && (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>No data yet</span>
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Staff Feedback Mentions Table */}
      <div className="section-divider">
        <Users size={18} />
        <span>Patient Feedback Mentions</span>
      </div>

      <div className="card mentions-card fb-mentions-full">
        <div className="card-header-row" style={{ marginBottom: '4px' }}>
          <p className="fb-mentions-subtitle">
            Staff referenced in patient reviews — labeled as mentions, not performance evaluations.
          </p>
        </div>
        {staffReports.length > 0 ? (
          <div className="mentions-table-wrapper">
            <table className="mentions-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th style={{ textAlign: 'center' }}>
                    <ThumbsUp size={12} style={{ verticalAlign: 'middle' }} /> Positive
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    <ThumbsDown size={12} style={{ verticalAlign: 'middle' }} /> Negative
                  </th>
                  <th style={{ textAlign: 'center' }}>Avg ★</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {staffReports.map((s) => (
                  <tr key={s.staff_id}>
                    <td className="cell-name">{s.name}</td>
                    <td>{s.role}</td>
                    <td>{s.department}</td>
                    <td className="cell-count status-green">{s.positive_mentions}</td>
                    <td className="cell-count status-red">{s.negative_mentions}</td>
                    <td className="cell-count">{s.average_rating_when_mentioned.toFixed(1)}</td>
                    <td>
                      <span className={`signal-badge ${getSignalClass(s.signal)}`}>
                        {s.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="fb-empty-state">
            <Clock size={32} style={{ color: 'var(--text-tertiary)' }} />
            <p>Collecting review data for mention analysis...</p>
          </div>
        )}
      </div>

      {/* ROW 4: Recent Reviews Feed */}
      <div className="section-divider">
        <MessageSquare size={18} />
        <span>Recent Reviews</span>
      </div>

      <div className="fb-reviews-feed">
        {reviews.slice(0, 15).map((r) => (
          <div key={r.id} className="card fb-review-card">
            <div className="fb-review-header">
              <div className="fb-review-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= r.rating ? getStarColor(r.rating) : 'transparent'}
                    stroke={s <= r.rating ? getStarColor(r.rating) : 'var(--text-tertiary)'}
                  />
                ))}
              </div>
              <span className="fb-review-meta">{r.department} · {r.visit_type}</span>
              <span className="fb-review-time">{timeAgo(r.timestamp)}</span>
            </div>
            <p className="fb-review-text">{r.feedback_text}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="card">
            <div className="fb-empty-state">
              <MessageSquare size={32} style={{ color: 'var(--text-tertiary)' }} />
              <p>Waiting for first review...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const config = {
  id: 'feedback',
  label: 'Patient Feedback',
  title: 'Patient Feedback Intelligence',
  icon: MessageSquare,
  order: 2,
};

export default PatientFeedback;
