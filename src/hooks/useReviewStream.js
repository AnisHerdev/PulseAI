/**
 * useReviewStream.js
 *
 * Custom React hook that drives the simulated patient review pipeline.
 *
 * Intervals:
 *   - 1 review every 12 s
 *   - Burst of 2-3 reviews every 60 s
 *   - Staff mention report: recalculated after each batch
 *   - LLM review summary: when ≥5 new low/mid reviews or every 90 s
 *
 * Cleans up all intervals on unmount.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateReview,
  generateBurst,
  addToWindow,
  splitReviews,
  computeAggregates,
} from '../lib/simulation/reviewSimulator.js';
import { sanitizeReviews, truncateFeedback } from '../lib/simulation/reviewSanitizer.js';
import { buildStaffMentionReport } from '../lib/simulation/staffMatcher.js';
import { buildReviewSnapshot } from '../lib/simulation/snapshotBuilder.js';

// ── Intervals (ms) ──────────────────────────────────────────────────────────
const SINGLE_REVIEW_INTERVAL = 12_000;
const BURST_INTERVAL = 60_000;
const SUMMARY_INTERVAL = 90_000;   // DEMO_REVIEW_SUMMARY_INTERVAL_SECONDS
const REFRESH_DEBOUNCE = 30_000;
const MIN_LOW_MID_FOR_SUMMARY = 5;

// ── Fallback ─────────────────────────────────────────────────────────────────
const REVIEW_FALLBACK_SUMMARY =
  'Recent low and mid-rated reviews indicate recurring operational pain points. Review wait time, billing, communication, and department-level complaint patterns. Check the feedback mentions table for repeated doctor or staff references.';

export function useReviewStream() {
  const [reviews, setReviews] = useState([]);
  const [staffReports, setStaffReports] = useState([]);
  const [aggregates, setAggregates] = useState({ totalReviews: 0, averageRating: 0, ratingCounts: {}, departmentCounts: {} });
  const [reviewSummary, setReviewSummary] = useState({
    summary: '',
    model: '',
    timestamp: null,
    loading: false,
    fallback: false,
  });

  const reviewsRef = useRef([]);
  const lowMidSinceLastSummaryRef = useRef(0);
  const lastSummaryTimeRef = useRef(0);
  const lastManualRefreshRef = useRef(0);
  const summaryInFlightRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  // ── Process reviews ───────────────────────────────────────────────────────
  const processNewReviews = useCallback((newReviews) => {
    setReviews((prev) => {
      const updated = addToWindow(prev, newReviews);
      
      // Compute aggregates
      const aggs = computeAggregates(updated);
      setAggregates(aggs);

      // Build staff mention report from all reviews in window
      const report = buildStaffMentionReport(updated);
      setStaffReports(report);

      // Track low/mid count for summary trigger
      const newLowMid = newReviews.filter((r) => r.rating <= 3).length;
      lowMidSinceLastSummaryRef.current += newLowMid;

      return updated;
    });
  }, []);

  // ── LLM review summary ───────────────────────────────────────────────────
  const fetchReviewSummary = useCallback(async (force = false) => {
    // Debounce manual refreshes
    if (force) {
      const now = Date.now();
      if (now - lastManualRefreshRef.current < REFRESH_DEBOUNCE) return;
      lastManualRefreshRef.current = now;
    }

    // Don't call if no low/mid reviews exist
    const { lowMid } = splitReviews(reviewsRef.current);
    if (lowMid.length === 0) return;

    if (summaryInFlightRef.current) return;
    summaryInFlightRef.current = true;
    setReviewSummary((prev) => ({ ...prev, loading: true }));

    try {
      // Sanitise and truncate
      const sanitised = sanitizeReviews(lowMid.slice(0, 20));
      const truncated = sanitised.map((r) => ({
        ...r,
        feedback_text: truncateFeedback(r.feedback_text, 300),
      }));

      const aggs = computeAggregates(reviewsRef.current);
      const snapshot = buildReviewSnapshot(truncated, aggs);

      const res = await fetch('/api/summary/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewSummary({
          summary: data.summary,
          model: data.model,
          timestamp: data.timestamp,
          loading: false,
          fallback: !!data.fallback,
        });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Review summary fetch failed:', err.message);
      setReviewSummary((prev) => ({
        ...prev,
        summary: prev.summary || REVIEW_FALLBACK_SUMMARY,
        loading: false,
        fallback: true,
        timestamp: prev.timestamp || new Date().toISOString(),
      }));
    } finally {
      lastSummaryTimeRef.current = Date.now();
      lowMidSinceLastSummaryRef.current = 0;
      summaryInFlightRef.current = false;
    }
  }, []);

  // ── Intervals ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Single review every 12 s
    const singleId = setInterval(() => {
      const review = generateReview();
      processNewReviews([review]);
    }, SINGLE_REVIEW_INTERVAL);

    // Burst every 60 s
    const burstId = setInterval(() => {
      const burst = generateBurst();
      processNewReviews(burst);
    }, BURST_INTERVAL);

    // Summary check every 15 s
    const summaryCheckId = setInterval(() => {
      const timeSinceLastSummary = Date.now() - lastSummaryTimeRef.current;
      const shouldSummarise =
        lowMidSinceLastSummaryRef.current >= MIN_LOW_MID_FOR_SUMMARY ||
        timeSinceLastSummary >= SUMMARY_INTERVAL;

      if (shouldSummarise) {
        fetchReviewSummary();
      }
    }, 15_000);

    // Seed initial batch (3-5 reviews) for immediate demo content
    const initialBatch = [
      ...generateBurst(),
      generateReview(),
      generateReview(),
    ];
    processNewReviews(initialBatch);

    return () => {
      clearInterval(singleId);
      clearInterval(burstId);
      clearInterval(summaryCheckId);
    };
  }, [processNewReviews, fetchReviewSummary]);

  return {
    reviews,
    reviewSummary,
    staffReports,
    aggregates,
    lastReviewTime: reviews[0]?.timestamp || null,
    refreshReviewSummary: () => fetchReviewSummary(true),
  };
}
