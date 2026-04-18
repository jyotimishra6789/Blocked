/**
 * Feature 3: Scam Replay Mode
 * useReplayRecorder — hook that records navigation events.
 * ReplayPlayer — component that renders the timeline and replays events.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, Circle } from 'lucide-react';

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useReplayRecorder() {
  const [events, setEvents] = useState([]);
  const [recording, setRecording] = useState(false);
  const startTimeRef = useRef(null);

  const startRecording = useCallback(() => {
    setEvents([]);
    setRecording(true);
    startTimeRef.current = Date.now();
  }, []);

  const stopRecording = useCallback(() => setRecording(false), []);

  const recordEvent = useCallback((url, report) => {
    if (!recording) return;
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    setEvents(prev => [...prev, {
      id: Date.now(),
      t: elapsed,
      url,
      score: report?.score ?? 100,
      flags: report?.flags ?? [],
      typosquatting: report?.typosquatting ?? false,
      targetDomain: report?.targetDomain ?? null,
      aiClassification: report?.aiAnalysis?.classification ?? null,
      aiExplanation: report?.aiAnalysis?.explanation ?? null,
      behavioralFlags: report?.behavioralFlags ?? [],
    }]);
  }, [recording]);

  return { events, recording, startRecording, stopRecording, recordEvent };
}

// ── Score color helper ─────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s < 40) return 'var(--accent-danger)';
  if (s > 80) return 'var(--accent-success)';
  return 'var(--accent-warning)';
}

// ── Player Component ───────────────────────────────────────────────────────────

const ReplayPlayer = ({ events, onClose }) => {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const current = events[idx] ?? null;

  const play = () => {
    setPlaying(true);
    const advance = () => {
      setIdx(prev => {
        if (prev >= events.length - 1) { setPlaying(false); return prev; }
        const next = prev + 1;
        const delay = events[next].t - events[prev].t;
        timerRef.current = setTimeout(advance, Math.min(delay, 1500));
        return next;
      });
    };
    timerRef.current = setTimeout(advance, 800);
  };

  const pause = () => {
    setPlaying(false);
    clearTimeout(timerRef.current);
  };

  const reset = () => { pause(); setIdx(0); };

  if (!events.length) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,12,0.97)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px 12px 0 0',
      padding: '1.25rem',
      zIndex: 200,
      boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Scam Replay — {events.length} navigation events
        </span>
        <button onClick={onClose} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
      </div>

      {/* Timeline scrubber */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {events.map((ev, i) => (
          <div key={ev.id} onClick={() => setIdx(i)} style={{
            flexShrink: 0,
            width: 40, height: 40,
            borderRadius: 6,
            border: `2px solid ${i === idx ? scoreColor(ev.score) : 'rgba(255,255,255,0.08)'}`,
            background: `rgba(${ev.score < 40 ? '239,68,68' : ev.score > 80 ? '16,185,129' : '245,158,11'},0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 10, fontWeight: 700,
            color: scoreColor(ev.score),
            transition: 'all 0.15s',
          }}>
            {ev.score}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <button onClick={reset} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <SkipBack size={14} />
        </button>
        <button onClick={playing ? pause : play} style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: 6, width: 36, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <div style={{ height: '100%', borderRadius: 2, background: 'var(--accent-primary)', width: `${((idx + 1) / events.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{idx + 1} / {events.length}</span>
      </div>

      {/* Current event detail */}
      {current && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.875rem', border: `1px solid ${scoreColor(current.score)}33` }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Step {idx + 1}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, wordBreak: 'break-all' }}>{current.url}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: `${scoreColor(current.score)}22`, color: scoreColor(current.score), border: `1px solid ${scoreColor(current.score)}44`, fontWeight: 600 }}>
              Score: {current.score}
            </span>
            {current.typosquatting && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', color: 'var(--accent-danger)', border: '1px solid rgba(239,68,68,0.3)' }}>Typosquatting → {current.targetDomain}</span>}
            {current.aiClassification && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}>AI: {current.aiClassification}</span>}
          </div>
          {current.aiExplanation && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>{current.aiExplanation}</p>}
          {current.behavioralFlags.length > 0 && (
            <ul style={{ marginTop: 6, paddingLeft: 14, fontSize: '0.75rem', color: 'var(--accent-warning)' }}>
              {current.behavioralFlags.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplayPlayer;
