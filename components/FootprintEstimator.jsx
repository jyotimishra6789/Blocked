import React, { useState, useEffect } from 'react';
import { Fingerprint, Shield, RefreshCw } from 'lucide-react';

/**
 * Feature 6: Digital Footprint Estimator
 * Enumerates real browser fingerprint vectors and computes a uniqueness score.
 * Shows before/after comparison when privacy mode is toggled.
 */

async function collectFingerprint(spoofed = false) {
  const fp = {};

  if (spoofed) {
    // Simulated spoofed values
    const screenChoices = [[1366, 768], [1440, 900], [1920, 1080]];
    const [sw, sh] = screenChoices[Math.floor(Math.random() * screenChoices.length)];
    fp.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/122.0';
    fp.platform = 'Win32';
    fp.language = 'en-US';
    fp.screenResolution = `${sw}x${sh}`;
    fp.colorDepth = 24;
    fp.timezone = 'America/New_York';
    fp.cookiesEnabled = true;
    fp.doNotTrack = '1';
    fp.hardwareConcurrency = [2, 4, 8][Math.floor(Math.random() * 3)];
    fp.deviceMemory = [2, 4, 8][Math.floor(Math.random() * 3)];
    fp.touchPoints = 0;
    fp.canvas = `spoofed_${Math.random().toString(36).slice(2, 10)}`;
    fp.webGL = 'ANGLE (Intel, Mesa Intel HD Graphics, OpenGL 4.6)';
    fp.fonts = 12;
    fp.plugins = 0;
    fp.adBlock = true;
  } else {
    fp.userAgent = navigator.userAgent;
    fp.platform = navigator.platform;
    fp.language = navigator.language;
    fp.screenResolution = `${window.screen.width}x${window.screen.height}`;
    fp.colorDepth = window.screen.colorDepth;
    fp.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fp.cookiesEnabled = navigator.cookieEnabled;
    fp.doNotTrack = navigator.doNotTrack;
    fp.hardwareConcurrency = navigator.hardwareConcurrency;
    fp.deviceMemory = navigator.deviceMemory || 'unknown';
    fp.touchPoints = navigator.maxTouchPoints;

    // Canvas fingerprint
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#a52a2a'; ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = '#0000ff'; ctx.font = '14px Arial'; ctx.fillText('Bruhwser', 10, 30);
      fp.canvas = c.toDataURL().slice(-20);
    } catch { fp.canvas = 'blocked'; }

    // WebGL renderer
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      fp.webGL = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch { fp.webGL = 'unavailable'; }

    fp.fonts = 'detected';
    fp.plugins = navigator.plugins?.length ?? 0;
    fp.adBlock = false;
  }

  return fp;
}

function computeUniqueness(fp) {
  // Rough statistical model — each vector reduces the pool
  let pool = 3_000_000_000;
  if (fp.screenResolution) pool /= { '1920x1080': 4, '1366x768': 3, '1440x900': 6, '2560x1440': 12 }[fp.screenResolution] ?? 8;
  if (fp.timezone) pool /= 20;
  if (fp.language && fp.language !== 'en-US') pool /= 4;
  if (fp.canvas && fp.canvas !== 'spoofed') pool /= 200;
  if (fp.webGL && fp.webGL !== 'unknown') pool /= 50;
  if (fp.hardwareConcurrency) pool /= 4;
  if (fp.deviceMemory && fp.deviceMemory !== 'unknown') pool /= 4;
  if (fp.plugins > 0) pool /= (fp.plugins + 1);
  return Math.max(1, Math.round(pool));
}

const VECTOR_LABELS = {
  userAgent: 'User agent',
  platform: 'OS / Platform',
  language: 'Language',
  screenResolution: 'Screen resolution',
  colorDepth: 'Color depth',
  timezone: 'Timezone',
  hardwareConcurrency: 'CPU threads',
  deviceMemory: 'Device memory',
  touchPoints: 'Touch points',
  canvas: 'Canvas hash',
  webGL: 'GPU renderer',
  fonts: 'Font detection',
  plugins: 'Browser plugins',
  doNotTrack: 'Do Not Track',
  adBlock: 'Ad blocker',
};

const VECTOR_RISK = {
  canvas: 'high', webGL: 'high', userAgent: 'med', screenResolution: 'med',
  timezone: 'med', hardwareConcurrency: 'low', deviceMemory: 'low',
  platform: 'low', language: 'low', plugins: 'low', fonts: 'med',
};

const FootprintEstimator = ({ privacyMode }) => {
  const [realFP, setRealFP] = useState(null);
  const [spoofedFP, setSpoofedFP] = useState(null);
  const [loading, setLoading] = useState(false);

  const collect = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([collectFingerprint(false), collectFingerprint(true)]);
    setRealFP(r);
    setSpoofedFP(s);
    setLoading(false);
  };

  useEffect(() => { collect(); }, []);

  const fp = privacyMode ? spoofedFP : realFP;
  const uniqueness = fp ? computeUniqueness(fp) : null;

  const riskColor = { high: '#ef4444', med: '#f59e0b', low: '#10b981' };

  return (
    <div style={{ padding: '1.5rem 2rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', minHeight: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Fingerprint size={28} color={privacyMode ? 'var(--accent-success)' : 'var(--accent-danger)'} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Digital Footprint Estimator</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>What trackers see when you visit a site</p>
        </div>
        <button onClick={collect} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Collecting fingerprint data...</div>}

      {uniqueness && (
        <>
          {/* Uniqueness score hero */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${privacyMode ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 12, padding: '1.5rem', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {privacyMode ? 'Spoofed fingerprint uniqueness' : 'Your real fingerprint uniqueness'}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: privacyMode ? 'var(--accent-success)' : 'var(--accent-danger)', lineHeight: 1 }}>
              1 in {uniqueness.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
              {privacyMode
                ? 'Privacy mode is obfuscating your identity. Trackers see a randomized profile.'
                : 'Your browser is highly identifiable. Trackers can track you without cookies.'}
            </div>
            {!privacyMode && spoofedFP && (
              <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--accent-success)' }}>
                With privacy mode: 1 in {computeUniqueness(spoofedFP).toLocaleString()} — {Math.round((1 - computeUniqueness(spoofedFP) / uniqueness) * -100)}% more anonymous
              </div>
            )}
          </div>

          {/* Vector breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {Object.entries(fp).map(([key, value]) => {
              const risk = VECTOR_RISK[key] || 'low';
              const col = riskColor[risk];
              return (
                <div key={key} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{VECTOR_LABELS[key] ?? key}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: 180 }}>{String(value).slice(0, 40)}{String(value).length > 40 ? '…' : ''}</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 8, background: `${col}22`, color: col, border: `1px solid ${col}33`, flexShrink: 0 }}>
                    {risk === 'high' ? 'High risk' : risk === 'med' ? 'Medium' : 'Low'}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FootprintEstimator;
