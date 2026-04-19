import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, X, AlertOctagon, Activity, Search, AlertTriangle, Shield, CheckCircle, Smartphone, Fingerprint, EyeOff, Info, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import ThreatDNA from './ThreatDNA';
import AttackMap from './AttackMap';
import ShareReportButton from './ShareReportButton';
import TrackerInspector from './TrackerInspector';
import './ThreatPanel.css';

const ThreatPanel = ({ isOpen, report, onClose, privacyMode, url, threatHistory }) => {
  const [showSpoofedPreview, setShowSpoofedPreview] = useState(false);

  // Sync preview toggle with privacyMode when it changes
  useEffect(() => {
    setShowSpoofedPreview(privacyMode);
  }, [privacyMode]);
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

        <hr className="divider" />
        <ThreatDNA url={url} report={report} />
        <TrackerInspector url={url} />
        <AttackMap threats={threatHistory || []} />
        <hr className="divider" />

        {/* Anti-Fingerprinting Section */}
        <div className="breakdown-section">
          <h4>Privacy Protection</h4>
          
          <div className="metric-item">
            <div className="metric-icon"><Lock size={16} color={privacyMode ? "var(--accent-success)" : "var(--text-muted)"}/></div>
            <div className="metric-info" style={{width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <span className="metric-title">Fingerprint Spoofing</span>
                <span className={`score-pill ${privacyMode ? 'score-pill-safe' : 'score-pill-danger'}`} style={{fontSize: '0.65rem', margin: 0, padding: '2px 6px'}}>
                  {privacyMode ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                {privacyMode ? 'Device identity randomized. Tracking signals obfuscated.' : 'Real device fingerprint is exposed to trackers.'}
              </p>
              
              {/* Detailed Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                  {privacyMode ? <CheckCircle size={14} color="var(--accent-success)"/> : <AlertTriangle size={14} color="var(--accent-danger)"/>}
                  <span style={{color: privacyMode ? 'var(--text-primary)' : 'var(--text-muted)'}}>Canvas Protection: {privacyMode ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                  {privacyMode ? <CheckCircle size={14} color="var(--accent-success)"/> : <AlertTriangle size={14} color="var(--accent-danger)"/>}
                  <span style={{color: privacyMode ? 'var(--text-primary)' : 'var(--text-muted)'}}>Audio Masking: {privacyMode ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                  {privacyMode ? <CheckCircle size={14} color="var(--accent-success)"/> : <AlertTriangle size={14} color="var(--accent-danger)"/>}
                  <span style={{color: privacyMode ? 'var(--text-primary)' : 'var(--text-muted)'}}>User-Agent Masking: {privacyMode ? 'Active' : 'Exposed'}</span>
                </div>
              </div>

              {/* Before vs After Preview */}
              <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)'}}>
                  <span style={{fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)'}}>Tracker View</span>
                  <div onClick={() => setShowSpoofedPreview(!showSpoofedPreview)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <span style={{fontSize: '0.7rem', color: showSpoofedPreview ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: !showSpoofedPreview ? 600 : 400}}>REAL</span>
                    {showSpoofedPreview ? <ToggleRight size={20} color="var(--accent-primary)"/> : <ToggleLeft size={20} color="var(--text-muted)"/>}
                    <span style={{fontSize: '0.7rem', color: showSpoofedPreview ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: showSpoofedPreview ? 600 : 400}}>SPOOFED</span>
                  </div>
                </div>
                <div style={{fontFamily: 'monospace', fontSize: '0.75rem', color: showSpoofedPreview ? 'var(--accent-warning)' : 'var(--accent-danger)', background: 'rgba(0,0,0,0.4)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  {showSpoofedPreview ? (
                    <>
                      <div><span style={{color: 'var(--text-muted)'}}>OS:</span> MacOS 14.2</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Browser:</span> Firefox 122.0</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Screen:</span> 1366x768</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Canvas Hash:</span> <span style={{color: 'var(--accent-success)'}}>9a3f28b... (Random Noise)</span></div>
                      <div><span style={{color: 'var(--text-muted)'}}>Audio Hash:</span> <span style={{color: 'var(--accent-success)'}}>44b1c9x... (Obfuscated)</span></div>
                    </>
                  ) : (
                    <>
                      <div><span style={{color: 'var(--text-muted)'}}>OS:</span> Windows 11</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Browser:</span> Chrome 120.0</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Screen:</span> 1920x1080</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Canvas Hash:</span> 7ef839a... (True Device)</div>
                      <div><span style={{color: 'var(--text-muted)'}}>Audio Hash:</span> 11a9f0b... (True Device)</div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {report.score < 50 && (
          <div className="warning-box animate-slide-down">
            <AlertTriangle size={24} color="var(--accent-danger)" />
            <p><strong>Warning:</strong> The requested URL resembles a known service but leads to a highly suspicious domain. Do not enter credentials.</p>
          </div>
        )}

        <ShareReportButton report={report} url={url} />
      </div>
    </div>
  );
};

export default ThreatPanel;
