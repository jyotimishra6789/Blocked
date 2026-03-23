import React from 'react';
import { Plus, X, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import './TabBar.css';

const TabBar = ({ url, report }) => {
  // Determine tab style based on report score
  let tabClass = 'tab-item active';
  let Icon = Shield;
  let iconColor = 'var(--text-muted)';
  
  if (report) {
    if (report.score < 40) {
      tabClass += ' danger';
      Icon = ShieldAlert;
      iconColor = 'var(--accent-danger)';
    } else if (report.score > 80) {
      tabClass += ' safe';
      Icon = ShieldCheck;
      iconColor = 'var(--accent-success)';
    } else {
      tabClass += ' warning';
      Icon = ShieldAlert;
      iconColor = 'var(--accent-warning)';
    }
  }

  // Extract domain for tab title
  const domain = url ? new URL(url).hostname : 'New Tab';

  return (
    <div className="tab-bar">
      {/* Mac-style Window Controls */}
      <div className="window-controls">
        <div className="control close"></div>
        <div className="control minimize"></div>
        <div className="control maximize"></div>
      </div>
      
      {/* Tabs list */}
      <div className="tabs-container">
        <div className={tabClass}>
          <Icon size={16} color={iconColor} className="tab-icon" />
          <span className="tab-title">{domain}</span>
          <X size={14} className="close-tab" />
        </div>
        
        <button className="new-tab-btn">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TabBar;
