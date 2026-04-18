import React, { useRef, useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';

/**
 * Feature 8: Shareable Threat Report Card
 * Generates a styled PNG of the threat report using html2canvas.
 * Add html2canvas to index.html:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
 */

function getScoreColor(score) {
  if (score < 40) return { bg: '#1a0505', border: '#ef4444', text: '#ef4444', label: 'CRITICAL THREAT' };
  if (score > 80) return { bg: '#031a0d', border: '#10b981', text: '#10b981', label: 'SAFE' };
  return { bg: '#1a1005', border: '#f59e0b', text: '#f59e0b', label: 'SUSPICIOUS' };
}

const ReportCard = React.forwardRef(({ report, url }, ref) => {
  if (!report) return null;
  const { bg, border, text, label } = getScoreColor(report.score);
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div ref={ref} style={{
      width: 380,
      background: '#08080c',
      border: `2px solid ${border}`,
      borderRadius: 16,
      fontFamily: "'Courier New', monospace",
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header bar */}
      <div style={{ background: border, padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#000', letterSpacing: '0.1em' }}>BRUHWSER SECURITY REPORT</span>
        <span style={{ fontSize: 10, color: '#000', opacity: 0.7 }}>{now}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 16px' }}>
        {/* Score circle */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: `3px solid ${border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: bg, flexShrink: 0,
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: text, lineHeight: 1 }}>{report.score}</div>
            <div style={{ fontSize: 9, color: text, opacity: 0.7, letterSpacing: '0.05em' }}>SCORE</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 4, wordBreak: 'break-all' }}>{domain}</div>
            {report.targetDomain && (
              <div style={{ fontSize: 10, color: '#ef4444', marginTop: 4 }}>Impersonates: {report.targetDomain}</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${border}44`, margin: '12px 0' }} />

        {/* Flags */}
        {report.flags?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Threat flags</div>
            {report.flags.slice(0, 4).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                <span style={{ color: border, fontSize: 12, lineHeight: 1.4 }}>▸</span>
                <span style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* AI classification */}
        {report.aiAnalysis && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>AI analysis</div>
            <div style={{ fontSize: 11, color: text, fontWeight: 700 }}>{report.aiAnalysis.classification} ({report.aiAnalysis.confidenceScore}% confidence)</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, lineHeight: 1.4 }}>{report.aiAnalysis.explanation?.slice(0, 100)}{report.aiAnalysis.explanation?.length > 100 ? '…' : ''}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 9, color: '#475569' }}>bruhwser.security</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {report.aiAnalysis?.urgency && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>URGENCY</span>}
            {report.aiAnalysis?.fear && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>FEAR</span>}
            {report.typosquatting && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>TYPOSQUAT</span>}
          </div>
        </div>
      </div>
    </div>
  );
});
ReportCard.displayName = 'ReportCard';

const ShareReportButton = ({ report, url }) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const exportPng = async () => {
    if (!window.html2canvas || !cardRef.current) {
      alert('html2canvas not loaded. Add the CDN script to index.html.');
      return;
    }
    setExporting(true);
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        backgroundColor: null, scale: 2, useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `bruhwser-report-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`Bruhwser detected a ${report?.score < 40 ? 'CRITICAL THREAT' : 'suspicious site'}: ${url} — Score: ${report?.score}/100`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!report) return null;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setShowCard(!showCard)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          <Share2 size={13} /> {showCard ? 'Hide' : 'Share Report'}
        </button>
        {copied && <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> Copied!</span>}
      </div>

      {showCard && (
        <div style={{ marginTop: 12, padding: 16, background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={copyLink} style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer' }}>
              Copy text
            </button>
            <button onClick={exportPng} disabled={exporting} style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'var(--accent-primary)', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Download size={12} /> {exporting ? 'Exporting…' : 'Download PNG'}
            </button>
          </div>
          <ReportCard ref={cardRef} report={report} url={url} />
        </div>
      )}
    </div>
  );
};

export { ReportCard, ShareReportButton };
export default ShareReportButton;
