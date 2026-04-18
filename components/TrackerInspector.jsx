import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldX, Activity } from 'lucide-react';

/**
 * Feature 9: Real-Time Cookie & Tracker Inspector
 * Intercepts mock tracker scripts injected into site mocks.
 * Shows a live scrolling feed and session counters.
 *
 * Usage: Post window.postMessage({ type: 'TRACKER_DETECTED', tracker }) from
 * the behavioralAnalysis script or iframe, OR call addTracker() directly.
 */

const MOCK_TRACKERS = [
  { name: 'Google Analytics', domain: 'google-analytics.com', category: 'analytics', risk: 'low' },
  { name: 'Facebook Pixel', domain: 'connect.facebook.net', category: 'social', risk: 'med' },
  { name: 'DoubleClick', domain: 'doubleclick.net', category: 'advertising', risk: 'high' },
  { name: 'Hotjar Session Recorder', domain: 'static.hotjar.com', category: 'behavioral', risk: 'high' },
  { name: 'Segment Analytics', domain: 'cdn.segment.com', category: 'analytics', risk: 'low' },
  { name: 'Criteo Ads', domain: 'static.criteo.net', category: 'advertising', risk: 'high' },
  { name: 'Twitter/X Pixel', domain: 'static.ads-twitter.com', category: 'social', risk: 'med' },
  { name: 'Mouseflow Recorder', domain: 'cdn.mouseflow.com', category: 'behavioral', risk: 'high' },
  { name: 'Amazon Ads', domain: 'aax.amazon-adsystem.com', category: 'advertising', risk: 'high' },
  { name: 'Intercom Chat', domain: 'widget.intercom.io', category: 'support', risk: 'med' },
];

const CATEGORY_COLORS = {
  analytics: '#3b82f6',
  social: '#8b5cf6',
  advertising: '#ef4444',
  behavioral: '#dc2626',
  support: '#10b981',
};

const RISK_LABELS = { low: 'Low risk', med: 'Medium risk', high: 'High risk' };
const RISK_COLORS = { low: '#10b981', med: '#f59e0b', high: '#ef4444' };

export function useTrackerInspector(url) {
  const [events, setEvents] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const intervalRef = useRef(null);

  // Simulate trackers loading when a new URL is visited
  useEffect(() => {
    if (!url || url.startsWith('bruhwser://')) return;
    setEvents([]);
    setBlocked([]);

    let count = 0;
    const max = 3 + Math.floor(Math.random() * 5);

    intervalRef.current = setInterval(() => {
      if (count >= max) { clearInterval(intervalRef.current); return; }
      const tracker = MOCK_TRACKERS[Math.floor(Math.random() * MOCK_TRACKERS.length)];
      const isBlocked = tracker.risk === 'high' || tracker.category === 'behavioral';
      const event = { ...tracker, id: Date.now() + count, ts: new Date().toLocaleTimeString(), blocked: isBlocked };
      setEvents(prev => [event, ...prev].slice(0, 50));
      if (isBlocked) setBlocked(prev => [...prev, event]);
      count++;
    }, 600 + Math.random() * 800);

    return () => clearInterval(intervalRef.current);
  }, [url]);

  return { events, blocked };
}

const TrackerInspector = ({ url }) => {
  const { events, blocked } = useTrackerInspector(url);
  const totalBlocked = blocked.length;
  const totalAllowed = events.length - totalBlocked;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      marginTop: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracker Inspector</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-danger)' }}>
            <ShieldX size={12} style={{ display: 'inline', marginRight: 3 }} />{totalBlocked} blocked
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-success)' }}>
            <ShieldCheck size={12} style={{ display: 'inline', marginRight: 3 }} />{totalAllowed} allowed
          </span>
        </div>
      </div>

      {/* Live feed */}
      <div style={{ maxHeight: 180, overflowY: 'auto', padding: '4px 0' }}>
        {events.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Navigate to a site to see tracker activity...
          </div>
        )}
        {events.map(ev => (
          <div key={ev.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            animation: 'slideDown 0.2s ease',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ev.blocked ? '#ef4444' : '#10b981', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>{ev.name}</span>
                <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: 4, background: `${CATEGORY_COLORS[ev.category]}22`, color: CATEGORY_COLORS[ev.category] }}>{ev.category}</span>
                {ev.blocked && <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600 }}>BLOCKED</span>}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ev.domain}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.65rem', color: RISK_COLORS[ev.risk] }}>{RISK_LABELS[ev.risk]}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{ev.ts}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerInspector;
