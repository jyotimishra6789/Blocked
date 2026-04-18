import React, { useState, useEffect, useRef } from 'react';

/**
 * Feature 4: Attack Map — Live global threat heatmap
 * Shows where detected threats originate (mock GeoIP).
 * Renders as an SVG world map with animated pulses.
 */

// Mock GeoIP database — domain keywords → lat/lng
const GEO_IP_MAP = [
  { keywords: ['ru', 'mail', 'vk'], lat: 55.75, lng: 37.62, country: 'Russia' },
  { keywords: ['cn', 'baidu', 'weibo', 'alibaba'], lat: 39.9, lng: 116.4, country: 'China' },
  { keywords: ['ng', 'naira', 'nigeria'], lat: 6.5, lng: 3.4, country: 'Nigeria' },
  { keywords: ['ro', 'romania'], lat: 44.4, lng: 26.1, country: 'Romania' },
  { keywords: ['br', 'brazil', 'brasil'], lat: -15.8, lng: -47.9, country: 'Brazil' },
  { keywords: ['in', 'india'], lat: 28.6, lng: 77.2, country: 'India' },
  { keywords: ['us', 'america', 'paypal', 'apple', 'google'], lat: 37.8, lng: -96, country: 'USA' },
  { keywords: ['uk', 'london', 'british'], lat: 51.5, lng: -0.1, country: 'UK' },
  { keywords: ['de', 'germany', 'deutsch'], lat: 52.5, lng: 13.4, country: 'Germany' },
  { keywords: ['pk', 'pakistan'], lat: 33.7, lng: 73.0, country: 'Pakistan' },
];

// World map path — simplified Mercator-projected SVG paths
// Using a minimal but recognizable world outline
const WORLD_PATH = "M45,120 L55,115 L70,112 L90,108 L110,105 L130,103 L150,102 L170,103 L190,105 L210,108 L230,110 L250,108 L270,106 L290,108 L310,110 L330,112 L350,115 L360,120 L355,130 L340,135 L320,138 L300,140 L280,145 L260,148 L240,145 L220,140 L200,138 L180,140 L160,145 L140,148 L120,145 L100,140 L80,135 L60,130 L45,125 Z";

function latLngToSvg(lat, lng, width = 720, height = 360) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

function guessOrigin(url) {
  const lower = url.toLowerCase();
  for (const entry of GEO_IP_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) return entry;
  }
  // Default to random "suspicious" location
  const defaults = GEO_IP_MAP.filter(e => ['Russia', 'China', 'Nigeria', 'Romania'].includes(e.country));
  return defaults[Math.floor(Math.random() * defaults.length)];
}

const AttackMap = ({ threats = [] }) => {
  const [pulses, setPulses] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!threats.length) return;
    const latest = threats[threats.length - 1];
    if (!latest || latest.score > 60) return;

    const origin = guessOrigin(latest.url || '');
    const pos = latLngToSvg(origin.lat, origin.lng);

    const newPulse = { id: idRef.current++, ...pos, country: origin.country, url: latest.url, score: latest.score, ts: Date.now() };
    setPulses(prev => [...prev.slice(-19), newPulse]); // keep last 20
  }, [threats]);

  const sessionBlocked = threats.filter(t => t.score < 50).length;
  const sessionWarnings = threats.filter(t => t.score >= 50 && t.score <= 80).length;

  return (
    <div style={{
      background: 'rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 12,
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Global Threat Map
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-danger)' }}>{sessionBlocked} blocked</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-warning)' }}>{sessionWarnings} warnings</span>
        </div>
      </div>

      {/* Map SVG */}
      <svg viewBox="0 0 720 360" style={{ width: '100%', display: 'block', background: '#050810' }}>
        {/* Grid lines */}
        {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720].map(x => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={360} stroke="rgba(59,130,246,0.04)" strokeWidth={0.5} />
        ))}
        {[0, 60, 120, 180, 240, 300, 360].map(y => (
          <line key={`h${y}`} x1={0} y1={y} x2={720} y2={y} stroke="rgba(59,130,246,0.04)" strokeWidth={0.5} />
        ))}

        {/* Simplified continent blobs */}
        {[
          // North America
          "M60,80 L130,75 L145,100 L155,140 L140,170 L120,185 L90,180 L70,160 L55,130 L50,100 Z",
          // South America
          "M130,195 L160,190 L175,210 L170,250 L155,285 L135,290 L115,270 L110,240 L115,210 Z",
          // Europe
          "M310,65 L360,60 L375,75 L370,100 L355,110 L330,115 L310,105 L300,85 Z",
          // Africa
          "M320,125 L370,118 L390,140 L395,180 L385,220 L360,250 L330,255 L305,230 L295,190 L300,155 L310,135 Z",
          // Asia
          "M390,60 L520,55 L560,70 L580,90 L570,120 L540,140 L500,150 L460,145 L420,130 L390,110 L380,85 Z",
          // Australia
          "M530,220 L590,215 L610,235 L605,265 L580,278 L550,272 L530,250 L525,230 Z",
        ].map((d, i) => (
          <path key={i} d={d} fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.15)" strokeWidth={0.5} />
        ))}

        {/* Attack pulses */}
        {pulses.map(p => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r={3} fill={p.score < 40 ? '#ef4444' : '#f59e0b'} opacity={0.9}>
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            {[1, 2, 3].map(ring => (
              <circle key={ring} cx={p.x} cy={p.y} r={0} fill="none"
                stroke={p.score < 40 ? '#ef4444' : '#f59e0b'}
                strokeWidth={1} opacity={0}>
                <animate attributeName="r" values={`0;${ring * 12}`} dur="2s" begin={`${ring * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" begin={`${ring * 0.5}s`} repeatCount="indefinite" />
              </circle>
            ))}
            <text x={p.x + 8} y={p.y - 4} fontSize={7} fill="#a3a3a3">{p.country}</text>
          </g>
        ))}

        {/* Legend */}
        <circle cx={16} cy={340} r={4} fill="#ef4444" />
        <text x={24} y={344} fontSize={9} fill="#a3a3a3">Threat blocked</text>
        <circle cx={100} cy={340} r={4} fill="#f59e0b" />
        <text x={108} y={344} fontSize={9} fill="#a3a3a3">Warning</text>
      </svg>

      {/* Recent threat feed */}
      {pulses.length > 0 && (
        <div style={{ maxHeight: 80, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[...pulses].reverse().slice(0, 5).map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 14px', fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: p.score < 40 ? 'var(--accent-danger)' : 'var(--accent-warning)' }}>{p.country}</span>
              <span style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.url}</span>
              <span style={{ color: 'var(--text-muted)' }}>Score: {p.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttackMap;
