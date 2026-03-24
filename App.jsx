import React, { useState } from 'react';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import ThreatPanel from './components/ThreatPanel';
import Desktop from './components/Desktop';
import BlockedScreen from './components/BlockedScreen';
import { initialWebsites, analyzeUrl } from './utils/mockEngine';
import './App.css';

function App() {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      url: 'bruhwser://home',
      inputValue: '',
      securityReport: analyzeUrl('bruhwser://home'),
      bypassed: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [isThreatPanelOpen, setIsThreatPanelOpen] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleNavigate = (url) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    const report = analyzeUrl(cleanUrl);
    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url: cleanUrl, inputValue: cleanUrl, securityReport: report, bypassed: false }
        : t
    ));

    if (report.score < 50) {
      setIsThreatPanelOpen(true);
    } else {
      setIsThreatPanelOpen(false);
    }
  };

  const handleCreateTab = () => {
    const newId = Date.now();
    const defaultUrl = 'bruhwser://home';
    const newTab = {
      id: newId,
      url: defaultUrl,
      inputValue: '',
      securityReport: analyzeUrl(defaultUrl),
      bypassed: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setIsThreatPanelOpen(false);
  };

  const handleCloseTab = (id) => {
    if (tabs.length === 1) return; // Prevent closing the last tab
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const setInputValue = (val) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, inputValue: val } : t));
  };

  const currentWebsiteMock = initialWebsites.find(site => site.url === activeTab.url);

  return (
    <Desktop>
      <div className="browser-window glass-panel">
        
        {/* Window controls and Tabs */}
        <TabBar 
          tabs={tabs} 
          activeTabId={activeTabId} 
          setActiveTabId={setActiveTabId} 
          handleCreateTab={handleCreateTab} 
          handleCloseTab={handleCloseTab} 
        />

        {/* Address Bar Area */}
        <AddressBar 
          inputValue={activeTab.inputValue} 
          setInputValue={setInputValue} 
          handleNavigate={handleNavigate}
          report={activeTab.securityReport}
          toggleThreatPanel={() => setIsThreatPanelOpen(!isThreatPanelOpen)}
        />

        {/* Main Viewport */}
        <div className="browser-viewport-container">
          {/* Threat Panel overlay/drawer */}
          <ThreatPanel 
            isOpen={isThreatPanelOpen} 
            report={activeTab.securityReport} 
            onClose={() => setIsThreatPanelOpen(false)} 
          />
          
          <div className="browser-viewport">
            {activeTab.securityReport && activeTab.securityReport.score <= 40 && !activeTab.bypassed ? (
              <BlockedScreen 
                url={activeTab.url}
                report={activeTab.securityReport}
                onGoBack={() => handleCloseTab(activeTab.id) || handleNavigate('bruhwser://home')}
                onProceed={() => setTabs(tabs.map(t => t.id === activeTabId ? { ...t, bypassed: true } : t))}
              />
            ) : currentWebsiteMock ? (
              <div dangerouslySetInnerHTML={{ __html: currentWebsiteMock.content }} className="mock-site-content" />
            ) : (
              <div className="error-page">
                <h2>Site Not Found</h2>
                <p>The mock engine does not have content for {activeTab.url}.</p>
                <div style={{marginTop: '2rem'}}>
                  Try: 
                  <button onClick={() => handleNavigate('https://app.paypal.com/login')} className="demo-btn">Safe Site (paypal.com)</button>
                  <button onClick={() => handleNavigate('https://app.palpal.com/login')} className="demo-btn danger">Phishing Site (palpal.com)</button>
                  <button onClick={() => handleNavigate('https://crypto-win-now.net')} className="demo-btn warning">Scam Site (crypto-win-now.net)</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </Desktop>
  );
}

export default App;
