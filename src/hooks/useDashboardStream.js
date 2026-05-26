/**
 * useDashboardStream.js
 *
 * Custom React hook that drives the simulated real-time data pipeline
 * for the CommandCenter dashboard.
 *
 * Intervals:
 *   - General state update: every 5 s
 *   - Chart/table update: every 10 s
 *   - Staffing/operational: every 20 s
 *   - LLM dashboard summary: on material change OR every 90 s
 *   - Alerts: recalculated after every update
 *
 * Cleans up all intervals on unmount.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createInitialDashboardState } from '../lib/simulation/dashboardState.js';
import { applyGeneralTick, applyChartTick, applyStaffingTick } from '../lib/simulation/dashboardSimulator.js';
import { recalculateAlerts } from '../lib/simulation/alertEngine.js';
import { buildDashboardSnapshot } from '../lib/simulation/snapshotBuilder.js';
import { detectMaterialChange } from '../lib/simulation/materialChangeDetector.js';

// ── Intervals (ms) ──────────────────────────────────────────────────────────
const GENERAL_INTERVAL = 5_000;
const CHART_INTERVAL = 10_000;
const STAFFING_INTERVAL = 20_000;
const SUMMARY_MAX_INTERVAL = 90_000;  // force a summary every 90 s
const REFRESH_DEBOUNCE = 30_000;      // manual refresh debounce

// ── Fallback ─────────────────────────────────────────────────────────────────
const DASHBOARD_FALLBACK_SUMMARY =
  'Current status requires review. The dashboard shows active operational signals and alerts that should be checked immediately. Focus on sections marked Warning or Critical and review staffing, patient flow, and feedback indicators.';

export function useDashboardStream() {
  const [dashboardData, setDashboardData] = useState(() => createInitialDashboardState());
  const [alerts, setAlerts] = useState(() => recalculateAlerts(createInitialDashboardState()));
  const [aiSummary, setAiSummary] = useState({
    summary: '',
    model: '',
    timestamp: null,
    loading: false,
    fallback: false,
  });

  // Refs for mutable state accessible inside intervals
  const stateRef = useRef(dashboardData);
  const alertsRef = useRef(alerts);
  const prevStateRef = useRef(dashboardData);
  const prevAlertsRef = useRef(alerts);
  const lastSummaryTimeRef = useRef(0);
  const lastManualRefreshRef = useRef(0);
  const summaryInFlightRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    stateRef.current = dashboardData;
    alertsRef.current = alerts;
  }, [dashboardData, alerts]);

  // ── LLM summary call ─────────────────────────────────────────────────────
  const fetchDashboardSummary = useCallback(async (force = false) => {
    // Debounce manual refreshes
    if (force) {
      const now = Date.now();
      if (now - lastManualRefreshRef.current < REFRESH_DEBOUNCE) return;
      lastManualRefreshRef.current = now;
    }

    if (summaryInFlightRef.current) return;
    summaryInFlightRef.current = true;
    setAiSummary((prev) => ({ ...prev, loading: true }));

    try {
      const snapshot = buildDashboardSnapshot(stateRef.current, alertsRef.current);
      const res = await fetch('/api/summary/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiSummary({
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
      console.warn('Dashboard summary fetch failed:', err.message);
      setAiSummary((prev) => ({
        ...prev,
        summary: prev.summary || DASHBOARD_FALLBACK_SUMMARY,
        loading: false,
        fallback: true,
        timestamp: prev.timestamp || new Date().toISOString(),
      }));
    } finally {
      lastSummaryTimeRef.current = Date.now();
      summaryInFlightRef.current = false;
    }
  }, []);

  // ── Update + alert + material-change pipeline ─────────────────────────────
  const applyUpdate = useCallback((updater) => {
    setDashboardData((prev) => {
      const next = updater(prev);
      const nextAlerts = recalculateAlerts(next);
      setAlerts(nextAlerts);

      // Save previous for material-change detection
      prevStateRef.current = prev;
      prevAlertsRef.current = alertsRef.current;

      return next;
    });
  }, []);

  // ── Intervals ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // General tick (every 5 s)
    const generalId = setInterval(() => {
      applyUpdate(applyGeneralTick);
    }, GENERAL_INTERVAL);

    // Chart tick (every 10 s)
    const chartId = setInterval(() => {
      applyUpdate(applyChartTick);
    }, CHART_INTERVAL);

    // Staffing tick (every 20 s)
    const staffingId = setInterval(() => {
      applyUpdate(applyStaffingTick);
    }, STAFFING_INTERVAL);

    // Summary check (every 5 s — piggyback on general tick timing)
    const summaryCheckId = setInterval(() => {
      const timeSinceLastSummary = Date.now() - lastSummaryTimeRef.current;

      // Check material change
      const { isMaterial } = detectMaterialChange(
        prevStateRef.current,
        stateRef.current,
        prevAlertsRef.current,
        alertsRef.current,
      );

      if (isMaterial || timeSinceLastSummary >= SUMMARY_MAX_INTERVAL) {
        fetchDashboardSummary();
      }
    }, GENERAL_INTERVAL);

    // Initial summary after first data load (slight delay)
    const initialId = setTimeout(() => {
      fetchDashboardSummary();
    }, 2000);

    return () => {
      clearInterval(generalId);
      clearInterval(chartId);
      clearInterval(staffingId);
      clearInterval(summaryCheckId);
      clearTimeout(initialId);
    };
  }, [applyUpdate, fetchDashboardSummary]);

  return {
    dashboardData,
    alerts,
    aiSummary,
    lastUpdate: dashboardData._lastUpdate,
    refreshSummary: () => fetchDashboardSummary(true),
  };
}
