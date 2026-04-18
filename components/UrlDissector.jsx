import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * Feature 7: Phishing Anatomy Breakdown
 * Dissects any URL into labeled, color-coded segments with explanations.
 */

const KNOWN_SAFE_TLDS = ['.com', '.org', '.gov', '.edu', '.net', '.io', '.co'];
const SUSPICIOUS_WORDS = ['secure', 'login', 'verify', 'update', 'account', 'confirm', 'banking', 'support', 'auth', 'signin'];
const TRUSTED_BRANDS = ['google', 'apple', 'microsoft', 'amazon', 'paypal', 'facebook', 'netflix', 'twitter'];
const KNOWN_PHISH_PATTERNS = ['palpal', 'gooogle', 'amaz0n', 'micros0ft', 'paypa1', 'g00gle', 'appl3'];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function analyzeUrl(raw) {
  let url;
  try {
    url = new URL(raw.startsWith('http') ? raw : 'https://' + raw);
  } catch {
    return null;
  }

  const hostname = url.hostname;
  const parts = hostname.split('.');
  const tld = '.' + parts.slice(-1)[0];
  const domain = parts.slice(-2).join('.');
  const domainRoot = parts.slice(-2, -1)[0];
  const subdomain = parts.length > 2 ? parts.slice(0, -2).join('.') : null;
  const path = url.pathname;
  const params = url.search;
  const protocol = url.protocol;

  const segments = [];

  // Protocol
  const isHttps = protocol === 'https:';
  segments.push({
    label: 'Protocol',
    text: protocol + '//',
    status: isHttps ? 'safe' : 'danger',
    explanation: isHttps ? 'HTTPS — connection is encrypted.' : 'HTTP — no encryption. Credentials sent in plain text.',
  });

  // Subdomain
  if (subdomain) {
    const hasKeyword = SUSPICIOUS_WORDS.some(w => subdomain.toLowerCase().includes(w));
    const isBrand = TRUSTED_BRANDS.some(b => subdomain.toLowerCase().includes(b));
    let status = 'neutral';
    let explanation = `Subdomain: "${subdomain}". Used to route traffic to specific services.`;
    if (hasKeyword && isBrand) {
      status = 'danger';
      explanation = `The subdomain "${subdomain}" impersonates an official service and uses trust-triggering keywords. Classic phishing pattern.`;
    } else if (hasKeyword) {
      status = 'warning';
      explanation = `"${subdomain}" uses words like "secure" or "login" to appear trustworthy. Commonly seen in phishing URLs.`;
    } else if (isBrand) {
      status = 'danger';
      explanation = `A legitimate brand name in the subdomain (${subdomain}) is a deceptive tactic — the real domain is what follows.`;
    }
    segments.push({ label: 'Subdomain', text: subdomain + '.', status, explanation });
  }

  // Domain root
  const closestBrand = TRUSTED_BRANDS.reduce((best, b) => {
    const d = levenshtein(domainRoot.toLowerCase(), b);
    return d < best.dist ? { brand: b, dist: d } : best;
  }, { brand: null, dist: 99 });

  let domainStatus = 'safe';
  let domainExplanation = `Domain: "${domain}". This is the registered domain — the true identity of the site.`;

  if (KNOWN_PHISH_PATTERNS.some(p => domainRoot.toLowerCase().includes(p))) {
    domainStatus = 'danger';
    domainExplanation = `"${domainRoot}" is a known typosquatting pattern. It replaces characters to mimic a legitimate brand.`;
  } else if (closestBrand.dist > 0 && closestBrand.dist <= 2) {
    domainStatus = 'danger';
    domainExplanation = `"${domainRoot}" has a Levenshtein distance of ${closestBrand.dist} from "${closestBrand.brand}". This is almost certainly typosquatting.`;
  } else if (closestBrand.dist === 0) {
    domainStatus = 'safe';
    domainExplanation = `Exact match to known brand "${closestBrand.brand}". Domain appears legitimate.`;
  }

  segments.push({ label: 'Domain', text: domain, status: domainStatus, explanation: domainExplanation });

  // TLD
  const isSafeTld = KNOWN_SAFE_TLDS.includes(tld);
  segments.push({
    label: 'TLD',
    text: tld,
    status: isSafeTld ? 'neutral' : 'warning',
    explanation: isSafeTld ? `".${tld.slice(1)}" is a standard top-level domain.` : `"${tld}" is an unusual TLD — phishing sites sometimes use obscure TLDs to avoid detection.`,
  });

  // Path
  if (path && path !== '/') {
    const pathKeywords = SUSPICIOUS_WORDS.filter(w => path.toLowerCase().includes(w));
    const status = pathKeywords.length > 0 ? 'warning' : 'neutral';
    segments.push({
      label: 'Path',
      text: path,
      status,
      explanation: pathKeywords.length > 0
        ? `Path contains "${pathKeywords.join('", "')}" — commonly used in phishing paths to look like legitimate pages.`
        : `URL path: "${path}". Routes to a specific page on the server.`,
    });
  }

  // Query params
  if (params) {
    const hasToken = /token|session|redirect|url|next|return/i.test(params);
    segments.push({
      label: 'Query params',
      text: params,
      status: hasToken ? 'warning' : 'neutral',
      explanation: hasToken ? 'Query parameters contain redirect or session tokens — may be used to hijack sessions or redirect after login.' : `URL parameters: ${params}`,
    });
  }

  const overallRisk = segments.some(s => s.status === 'danger') ? 'danger'
    : segments.some(s => s.status === 'warning') ? 'warning' : 'safe';

  return { segments, overallRisk, hostname };
}

const STATUS_STYLES = {
  safe: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#10b981', icon: CheckCircle },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#f59e0b', icon: AlertTriangle },
  danger: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#ef4444', icon: AlertTriangle },
  neutral: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', text: '#a3a3a3', icon: Info },
};

const UrlDissector = ({ initialUrl = '' }) => {
  const [input, setInput] = useState(initialUrl);
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);

  const analyze = () => {
    const r = analyzeUrl(input);
    setResult(r);
    setSelected(null);
  };

  return (
    <div style={{ padding: '1.5rem 2rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', minHeight: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Search size={24} color="var(--accent-primary)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Phishing Anatomy Breakdown</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Forensic URL dissection — click any segment to learn more</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter a suspicious URL... e.g. http://secure-login.paypa1.com/verify"
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
        />
        <button onClick={analyze} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Dissect
        </button>
      </div>

      {result && (
        <>
          {/* Visual breakdown bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 20, alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
            {result.segments.map((seg, i) => {
              const s = STATUS_STYLES[seg.status];
              return (
                <div key={i} onClick={() => setSelected(i === selected ? null : i)} style={{
                  background: s.bg, border: `1px solid ${i === selected ? s.text : s.border}`,
                  borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
                  transition: 'all 0.15s', transform: i === selected ? 'translateY(-2px)' : 'none',
                  boxShadow: i === selected ? `0 4px 12px ${s.text}44` : 'none',
                }}>
                  <div style={{ fontSize: '0.65rem', color: s.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{seg.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: 200 }}>{seg.text}</div>
                </div>
              );
            })}
          </div>

          {/* Selected segment explanation */}
          {selected !== null && result.segments[selected] && (() => {
            const seg = result.segments[selected];
            const s = STATUS_STYLES[seg.status];
            const Icon = s.icon;
            return (
              <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '1rem 1.25rem', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon size={18} color={s.text} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: s.text, marginBottom: 4 }}>{seg.label}: <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{seg.text}</code></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{seg.explanation}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Overall verdict */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: STATUS_STYLES[result.overallRisk].bg, border: `1px solid ${STATUS_STYLES[result.overallRisk].border}` }}>
            {React.createElement(STATUS_STYLES[result.overallRisk].icon, { size: 16, color: STATUS_STYLES[result.overallRisk].text })}
            <span style={{ fontSize: '0.85rem', color: STATUS_STYLES[result.overallRisk].text, fontWeight: 600 }}>
              Overall: {result.overallRisk === 'danger' ? 'High threat — do not visit this URL' : result.overallRisk === 'warning' ? 'Suspicious — proceed with extreme caution' : 'Appears legitimate — no major red flags detected'}
            </span>
          </div>
        </>
      )}

      {/* Example URLs */}
      {!result && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Try these examples:</div>
          {[
            'http://secure-login.paypa1.com/verify?token=abc123',
            'https://apple-id-locked.support/unlock',
            'https://google.com/search?q=test',
          ].map(ex => (
            <div key={ex} onClick={() => { setInput(ex); setResult(analyzeUrl(ex)); }} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-primary)', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline', textUnderlineOffset: 3 }}>{ex}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlDissector;
