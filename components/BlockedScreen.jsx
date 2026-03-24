import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import './BlockedScreen.css';

const BlockedScreen = ({ url, report, onGoBack, onProceed }) => {
  return (
    <div className="blocked-screen">
      <div className="blocked-content">
        <div className="warning-header">
          <ShieldAlert size={80} className="danger-icon pulse-animation" />
          <h1>Active Threat Blocked</h1>
        </div>
        
        <div className="blocked-info">
          <p className="blocked-url">{url}</p>
          <p className="blocked-desc">
            Bruhwser's Active Protection prevented this page from loading. This site poses a severe security risk and interacting with it could compromise your personal data, credentials, or device.
          </p>

          <div className="threat-reasons">
            <h3>Why was this site blocked?</h3>
            <ul>
              {report?.flags?.map((flag, i) => (
                <li key={i}>
                  <ShieldAlert size={14} className="inline-icon" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="blocked-actions">
          <button className="safe-btn" onClick={onGoBack}>
            <ArrowLeft size={18} /> Take Me Back to Safety
          </button>
          <button className="proceed-btn" onClick={onProceed}>
            Proceed Anyway (Not Recommended)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedScreen;
