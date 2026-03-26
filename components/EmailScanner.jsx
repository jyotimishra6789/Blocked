import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Mail, AlertTriangle, ScanSearch } from 'lucide-react';
import { analyzeContentWithAI } from '../utils/aiEngine';
import './EmailScanner.css';

const EmailScanner = () => {
  const [sender, setSender] = useState('');
  const [body, setBody] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const suspiciousKeywords = ['urgent', 'verify', 'otp', 'password', 'suspended', 'claim', 'won', 'crypto'];

  const highlightText = (text) => {
    // Simple escaping to prevent XSS issues from user input
    let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    suspiciousKeywords.forEach(kw => {
      const regex = new RegExp(`(${kw})`, 'gi');
      safeText = safeText.replace(regex, '<span class="highlight-danger">$1</span>');
    });
    return { __html: safeText };
  };

  const calculateStaticScore = (senderDomain, text) => {
    let score = 100;
    const lowerText = text.toLowerCase();
    
    if (senderDomain.includes('palpal') || senderDomain.includes('paypai') || senderDomain.includes('update-')) {
      score -= 40;
    }

    suspiciousKeywords.forEach(kw => {
      if (lowerText.includes(kw)) {
        score -= 10;
      }
    });

    return Math.max(0, score);
  };

  const handleScan = async () => {
    if (!sender && !body) return;
    setScanning(true);
    setResult(null);

    const senderDomain = sender.split('@')[1] || sender;
    const staticScore = calculateStaticScore(senderDomain, body);

    const fullContent = `Sender: ${sender}\nBody: ${body}`;
    const aiResult = await analyzeContentWithAI('Email Scan', fullContent);

    let finalScore = staticScore;
    if (aiResult.classification === 'Scam') {
      finalScore = Math.min(finalScore, Math.max(0, 100 - aiResult.confidenceScore));
    } else if (aiResult.classification === 'Suspicious') {
      finalScore = Math.min(finalScore, 60);
    }

    setResult({
      score: finalScore,
      ai: aiResult,
    });
    setScanning(false);
  };

  return (
    <div className="email-scanner-container">
      <div className="scanner-header">
        <Mail size={32} color="var(--accent-primary)" />
        <h2>Email Scam Scanner</h2>
        <p>Analyze suspicious emails before they compromise your data.</p>
      </div>

      <div className="scanner-layout">
        <div className="scanner-input-section glass-panel">
          <div className="input-group">
            <label>Sender Address / Domain</label>
            <input 
              type="text" 
              placeholder="e.g., support@palpal.com" 
              value={sender} 
              onChange={e => setSender(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Email Content</label>
            <textarea 
              rows="8" 
              placeholder="Paste the suspicious email text here..."
              value={body}
              onChange={e => setBody(e.target.value)}
            ></textarea>
          </div>
          <button className="scan-btn" onClick={handleScan} disabled={scanning || (!sender && !body)}>
            {scanning ? <span className="pumping-text">Analyzing with AI...</span> : <><ScanSearch size={18}/> Scan Email</>}
          </button>
        </div>

        <div className="scanner-result-section glass-panel">
          {!result && !scanning ? (
            <div className="empty-state">
              <ShieldCheck size={48} color="rgba(255,255,255,0.1)" />
              <p>Enter an email to see the safety analysis.</p>
            </div>
          ) : scanning ? (
            <div className="scanning-state">
              <div className="radar-spinner"></div>
              <p>Scanning payload for threats...</p>
            </div>
          ) : (
            <div className="result-content animate-slide-up">
              <div className="result-score-header">
                <div className={`large-score ${result.score < 40 ? 'danger-bg' : result.score > 80 ? 'safe-bg' : 'warning-bg'}`}>
                  {result.score}
                </div>
                <div>
                  <h3>Safety Score</h3>
                  {result.score < 50 ? (
                    <p className="bruh-message animate-shake danger-text">Bruh... this email looks suspicious 💀</p>
                  ) : result.score > 80 ? (
                    <p className="bruh-message safe-text">Looks safe enough.</p>
                  ) : (
                    <p className="bruh-message warning-text">Be somewhat careful here.</p>
                  )}
                </div>
              </div>

              {result.ai && (
                <div className="ai-insight-box">
                  <h4>AI Classification: <span className={result.ai.classification === 'Scam' ? 'danger-text' : result.ai.classification === 'Suspicious' ? 'warning-text' : 'safe-text'}>{result.ai.classification}</span></h4>
                  <p className="ai-explanation">{result.ai.explanation}</p>
                  <div className="flag-tags">
                    {result.ai.urgency && <span className="flag-tag danger">Urgency</span>}
                    {result.ai.fear && <span className="flag-tag danger">Fear Tactics</span>}
                    {result.ai.rewards && <span className="flag-tag warning">Suspicious Rewards</span>}
                  </div>
                </div>
              )}

              {body && result.score < 80 && (
                <div className="highlight-box">
                  <h4>Flagged Content</h4>
                  <div className="highlighted-text" dangerouslySetInnerHTML={highlightText(body)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailScanner;
