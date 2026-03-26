import React from 'react';
import { Plus, X, ShieldAlert, ShieldCheck, Shield, Mail } from 'lucide-react';
import './TabBar.css';

const TabBar = ({ tabs, activeTabId, setActiveTabId, handleCreateTab, handleCloseTab, handleCreateEmailScannerTab }) => {
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
        {tabs.map((tab) => {
          let tabClass = `tab-item ${tab.id === activeTabId ? 'active' : ''}`;
          let Icon = Shield;
          let iconColor = 'var(--text-muted)';
          
          if (tab.securityReport) {
            if (tab.securityReport.score < 40) {
              tabClass += ' danger';
              Icon = ShieldAlert;
              iconColor = 'var(--accent-danger)';
            } else if (tab.securityReport.score > 80) {
              tabClass += ' safe';
              Icon = ShieldCheck;
              iconColor = 'var(--accent-success)';
            } else {
              tabClass += ' warning';
              Icon = ShieldAlert;
              iconColor = 'var(--accent-warning)';
            }
          }

          const domain = tab.url ? new URL(tab.url).hostname : 'New Tab';

          return (
            <div 
              key={tab.id} 
              className={tabClass}
              onClick={() => setActiveTabId(tab.id)}
            >
              <Icon size={16} color={iconColor} className="tab-icon" />
              <span className="tab-title">{domain}</span>
              <X 
                size={14} 
                className="close-tab" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }} 
              />
            </div>
          );
        })}
        
        <button className="new-tab-btn" onClick={handleCreateTab} title="New Tab">
          <Plus size={18} />
        </button>
        <button className="new-tab-btn" onClick={handleCreateEmailScannerTab} title="Open Email Scanner" style={{ marginLeft: '4px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
          <Mail size={16} color="var(--accent-primary)" />
        </button>
      </div>
    </div>
  );
};

export default TabBar;
