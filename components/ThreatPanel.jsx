import React from 'react';
import { ShieldAlert, ShieldCheck, X, AlertOctagon, Activity, Search, AlertTriangle, Shield, CheckCircle, Smartphone, Fingerprint, EyeOff, Info } from 'lucide-react';
import './ThreatPanel.css';

const ThreatPanel = ({ isOpen, report, onClose }) => {
  if (!isOpen || !report) return null;

  const getScoreColor = (score) => {
    if (score < 40) return 'var(--accent-danger)';
    if (score > 80) return 'var(--accent-success)';
    return 'var(--accent-warning)';
  };

  const scoreColor = getScoreColor(report.score);

  return (
    <div className={`threat-panel glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <div className="header-title">
          {report.score < 40 ? <ShieldAlert color={scoreColor} size={20} /> : <ShieldCheck color={scoreColor} size={20} />}
          <h3>Security Report</h3>
        </div>
        <button onClick={onClose} className="close-btn"><X size={18} /></button>
      </div>

      <div className="panel-content">
        {/* Main Score Area */}
        <div className="score-section">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${report.score}, 100`}
              style={{ stroke: scoreColor }}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{report.score}</text>
          </svg>
          <div className="score-text">
            <h4>Bruh Score</h4>
            <p style={{ color: scoreColor }}>
              {report.score < 40 ? 'Bruh... this site looks suspicious.' : report.score > 80 ? 'Looks safe to browse.' : 'Proceed with caution.'}
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* Detailed Breakdown */}
        <div className="breakdown-section">
          <h4>Analysis Breakdown</h4>

          <div className="metric-item">
            <div className="metric-icon"><Search size={16} /></div>
            <div className="metric-info">
              <span className="metric-title">Domain Similarity</span>
              <span className={`metric-status ${report.typosquatting ? 'danger-text' : 'safe-text'}`}>
                {report.typosquatting ? `Typosquatting (Target: ${report.targetDomain})` : 'No issues found'}
              </span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><Activity size={16} /></div>
            <div className="metric-info">
              <span className="metric-title">WHOIS Domain Age</span>
              <span className={`metric-status ${report.newDomain ? 'danger-text' : 'safe-text'}`}>
                {report.age}
              </span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><AlertOctagon size={16} /></div>
            <div className="metric-info">
              <span className="metric-title">AI Content Analysis</span>
              {report.aiStatus === 'scanning' ? (
                <span className="metric-status" style={{ color: 'var(--accent-warning)', animation: 'pulse-glow 2s infinite' }}>
                  Scanning with AI...
                </span>
              ) : report.aiAnalysis ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className={`metric-status ${report.aiAnalysis.classification === 'Scam' ? 'danger-text' : report.aiAnalysis.classification === 'Suspicious' ? 'warning-text' : 'safe-text'}`} style={{ color: report.aiAnalysis.classification === 'Suspicious' ? 'var(--accent-warning)' : undefined }}>
                    {report.aiAnalysis.classification} ({report.aiAnalysis.confidenceScore}% confidence)
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{report.aiAnalysis.explanation}</p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {report.aiAnalysis.urgency && <span className="score-pill score-pill-danger" style={{ fontSize: '0.65rem', padding: '2px 6px', margin: 0 }}>Urgency Detected</span>}
                    {report.aiAnalysis.fear && <span className="score-pill score-pill-danger" style={{ fontSize: '0.65rem', padding: '2px 6px', margin: 0 }}>Fear Tactics</span>}
                    {report.aiAnalysis.rewards && <span className="score-pill score-pill-warning" style={{ fontSize: '0.65rem', padding: '2px 6px', margin: 0 }}>Suspicious Rewards</span>}
                  </div>
                </div>
              ) : (
                <span className={`metric-status ${report.phishingContent ? 'danger-text' : 'safe-text'}`}>
                  {report.phishingContent ? `Suspicious keywords: ${report.flaggedKeywords?.join(', ')}` : 'Content looks normal'}
                </span>
              )}
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><Activity size={16} /></div>
            <div className="metric-info">
              <span className="metric-title">Behavioral Analysis</span>
              {report.behavioralFlags && report.behavioralFlags.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="metric-status danger-text" style={{ animation: 'pulse-danger 2s infinite' }}>
                    Suspicious behavior detected
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {report.behavioralFlags.map((flag, idx) => (
                      <li key={idx} style={{ color: 'var(--accent-warning)', paddingTop: '2px' }}>{flag}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="metric-status safe-text">No anomalous scripts detected</span>
              )}
            </div>
          </div>
        </div>

        {report.score < 50 && (
          <div className="warning-box animate-slide-down">
            <AlertTriangle size={24} color="var(--accent-danger)" />
            <p><strong>Warning:</strong> The requested URL resembles a known service but leads to a highly suspicious domain. Do not enter credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatPanel;
