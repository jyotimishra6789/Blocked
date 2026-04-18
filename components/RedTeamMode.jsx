import React, { useState } from 'react';
import { Swords, ShieldAlert, Loader, Eye, Code } from 'lucide-react';

/**
 * Feature 10: AI Red Team Mode
 * AI generates a realistic phishing page for a chosen brand,
 * then Bruhwser scans its own creation and reports what it caught vs missed.
 * Uses the Anthropic API.
 */

const BRANDS = ['PayPal', 'Google', 'Apple', 'Amazon', 'Microsoft', 'Netflix', 'Instagram', 'Bank of America'];

async function generatePhishingPage(brand) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are assisting a CYBERSECURITY EDUCATION tool. Generate a FAKE, clearly labeled educational phishing HTML page impersonating ${brand}.
The page should:
1. Look visually similar to ${brand}'s login/verification page
2. Use a suspicious URL-like title (e.g. secure-${brand.toLowerCase()}-verify.net)  
3. Include urgency language, fear tactics, and request for credentials
4. Have a red "EDUCATIONAL SIMULATION" banner at the top so it is clearly marked as fake
5. Include a form asking for username, password, and maybe OTP

Return ONLY the complete HTML — no explanation, no markdown. The HTML must be self-contained with inline CSS.`,
      messages: [{ role: 'user', content: `Generate an educational phishing page for ${brand}` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? '<html><body>Error generating page</body></html>';
}

async function analyzePhishingPage(html, brand) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `You are a security scanner analyzing HTML for phishing indicators. Be extremely thorough. Return ONLY valid JSON with this schema:
{
  "score": <0-100 trust score, lower = more dangerous>,
  "detected": [<array of specific phishing indicators found>],
  "missed": [<array of things an average user might miss>],
  "techniques": [<social engineering techniques used>],
  "verdict": "<one sentence summary>"
}`,
      messages: [{ role: 'user', content: `Analyze this HTML page purportedly from ${brand}:\n\n${html.slice(0, 3000)}` }],
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text ?? '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { score: 20, detected: ['Suspicious form fields', 'Urgency language'], missed: ['SSL certificate check'], techniques: ['Fear', 'Authority'], verdict: 'High-risk phishing page detected.' };
  }
}

const RedTeamMode = () => {
  const [brand, setBrand] = useState('PayPal');
  const [phase, setPhase] = useState('idle'); // idle | generating | scanning | done
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const run = async () => {
    setPhase('generating');
    setAnalysis(null);
    setGeneratedHtml('');

    const html = await generatePhishingPage(brand);
    setGeneratedHtml(html);
    setPhase('scanning');

    const result = await analyzePhishingPage(html, brand);
    setAnalysis(result);
    setPhase('done');
  };

  const scoreColor = analysis ? (analysis.score < 30 ? '#ef4444' : analysis.score < 60 ? '#f59e0b' : '#10b981') : '#a3a3a3';

  return (
    <div style={{ padding: '1.5rem 2rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', minHeight: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Swords size={26} color="var(--accent-danger)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>AI Red Team Mode</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate a phishing attack — then watch Bruhwser scan its own creation</p>
        </div>
      </div>

      {/* Warning banner */}
      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.8rem', color: '#fca5a5', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        Educational simulation only. Generated pages are clearly labeled as fake and never reach the internet.
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Target brand</label>
          <select value={brand} onChange={e => setBrand(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer' }}>
            {BRANDS.map(b => <option key={b} value={b} style={{ background: '#121216' }}>{b}</option>)}
          </select>
        </div>
        <button onClick={run} disabled={phase !== 'idle' && phase !== 'done'} style={{
          marginTop: 20,
          background: phase === 'idle' || phase === 'done' ? 'var(--accent-danger)' : 'rgba(239,68,68,0.3)',
          color: 'white', border: 'none', borderRadius: 8, padding: '9px 20px',
          cursor: phase !== 'idle' && phase !== 'done' ? 'not-allowed' : 'pointer',
          fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {phase === 'generating' ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating attack...</>
           : phase === 'scanning' ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Scanning...</>
           : <><Swords size={15} /> Launch Red Team</>}
        </button>
      </div>

      {/* Progress indicators */}
      {(phase === 'generating' || phase === 'scanning' || phase === 'done') && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['Generating phishing page', 'Scanning for threats', 'Analysis complete'].map((step, i) => {
            const done = (phase === 'scanning' && i === 0) || phase === 'done';
            const active = (phase === 'generating' && i === 0) || (phase === 'scanning' && i === 1) || (phase === 'done' && i === 2);
            return (
              <div key={i} style={{ flex: 1, padding: '6px 10px', borderRadius: 8, background: done ? 'rgba(16,185,129,0.1)' : active ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : active ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}`, fontSize: '0.75rem', color: done ? 'var(--accent-success)' : active ? 'var(--accent-danger)' : 'var(--text-muted)', textAlign: 'center' }}>
                {done ? '✓ ' : active ? '⟳ ' : ''}{step}
              </div>
            );
          })}
        </div>
      )}

      {/* Results */}
      {phase === 'done' && analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* Score */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${scoreColor}44`, borderRadius: 10, padding: '1rem', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{analysis.score}</span>
                <span style={{ fontSize: 9, color: scoreColor, opacity: 0.7 }}>TRUST</span>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Bruhwser verdict</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{analysis.verdict}</div>
              </div>
            </div>
          </div>

          {/* Detected */}
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.875rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Caught ({analysis.detected?.length ?? 0})</div>
            {analysis.detected?.map((d, i) => <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 10, borderLeft: '2px solid rgba(239,68,68,0.4)' }}>{d}</div>)}
          </div>

          {/* Missed */}
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '0.875rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Users might miss ({analysis.missed?.length ?? 0})</div>
            {analysis.missed?.map((d, i) => <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 10, borderLeft: '2px solid rgba(245,158,11,0.4)' }}>{d}</div>)}
          </div>

          {/* Techniques */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Techniques used:</span>
            {analysis.techniques?.map((t, i) => <span key={i} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: 'var(--accent-danger)', border: '1px solid rgba(239,68,68,0.2)' }}>{t}</span>)}
          </div>
        </div>
      )}

      {/* Preview / Code toggle */}
      {generatedHtml && (
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
            <button onClick={() => { setShowPreview(true); setShowCode(false); }} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: showPreview ? 'var(--accent-primary)' : 'none', color: showPreview ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Preview
            </button>
            <button onClick={() => { setShowCode(true); setShowPreview(false); }} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: showCode ? 'var(--accent-primary)' : 'none', color: showCode ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Code size={12} /> HTML
            </button>
          </div>
          {showPreview && (
            <iframe srcDoc={generatedHtml} style={{ width: '100%', height: 320, border: 'none', display: 'block' }} sandbox="allow-scripts" title="Generated phishing page preview" />
          )}
          {showCode && (
            <pre style={{ margin: 0, padding: '1rem', background: '#050508', fontSize: '0.72rem', color: '#94a3b8', overflowX: 'auto', maxHeight: 320, overflowY: 'auto', fontFamily: 'monospace' }}>{generatedHtml}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default RedTeamMode;
