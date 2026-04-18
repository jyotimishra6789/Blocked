import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { narrateThreat, stopNarration, isNarrating } from '../utils/threatNarrator';

/**
 * NarratorControls — drop this next to the privacy toggle in AddressBar.
 * Props: report, url, autoNarrate (bool)
 */
const NarratorControls = ({ report, url, autoNarrate = true }) => {
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(autoNarrate);

  // Auto-narrate when report changes and score is concerning
  useEffect(() => {
    if (!enabled || !report || !url) return;
    if (report.score <= 80 || report.score < 40) {
      narrateThreat(report, url);
      setSpeaking(true);

      const interval = setInterval(() => {
        if (!isNarrating()) {
          setSpeaking(false);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [report, url, enabled]);

  const handleToggle = () => {
    if (speaking) {
      stopNarration();
      setSpeaking(false);
    } else {
      if (report) {
        narrateThreat(report, url);
        setSpeaking(true);
      }
    }
  };

  const handleEnableToggle = () => {
    if (enabled) {
      stopNarration();
      setSpeaking(false);
    }
    setEnabled(!enabled);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {/* Main speak/stop button */}
      <button
        onClick={handleToggle}
        title={speaking ? 'Stop narration' : 'Narrate threat report'}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: speaking ? 'rgba(239, 68, 68, 0.15)' : 'none',
          border: speaking ? '1px solid rgba(239,68,68,0.4)' : 'none',
          color: speaking ? 'var(--accent-danger)' : 'var(--text-muted)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s',
        }}
      >
        {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {speaking && (
          <span style={{
            position: 'absolute',
            top: 4, right: 4,
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--accent-danger)',
            animation: 'pulse-danger 1s infinite',
          }} />
        )}
      </button>

      {/* Auto-narrate toggle label */}
      <span
        onClick={handleEnableToggle}
        title={enabled ? 'Disable auto-narration' : 'Enable auto-narration'}
        style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          color: enabled ? 'var(--accent-success)' : 'var(--text-muted)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          padding: '2px 6px',
          borderRadius: 10,
          border: `1px solid ${enabled ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
          background: enabled ? 'rgba(16,185,129,0.1)' : 'transparent',
          transition: 'all 0.2s',
        }}
      >
        {enabled ? 'AI Voice ON' : 'AI Voice OFF'}
      </span>
    </div>
  );
};

export default NarratorControls;
