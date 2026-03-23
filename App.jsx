import React, { useState } from 'react';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import ThreatPanel from './components/ThreatPanel';
import Desktop from './components/Desktop';
import { initialWebsites, analyzeUrl } from './utils/mockEngine';
import './App.css';

function App() {
  const [currentUrl, setCurrentUrl] = useState('https://app.palpal.com/login');
  const [inputValue, setInputValue] = useState(currentUrl);
  const [securityReport, setSecurityReport] = useState(analyzeUrl(currentUrl));
  const [isThreatPanelOpen, setIsThreatPanelOpen] = useState(false);

  const handleNavigate = (url) => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    setCurrentUrl(cleanUrl);
    setInputValue(cleanUrl);
    const report = analyzeUrl(cleanUrl);
    setSecurityReport(report);
    if (report.score < 50) {
      setIsThreatPanelOpen(true);
    } else {
      setIsThreatPanelOpen(false);
    }
  };

  const currentWebsiteMock = initialWebsites.find(site => site.url === currentUrl);

  return (
    <Desktop>
      <div className="browser-window glass-panel">
        
        {/* Window controls and Tabs */}
        <TabBar url={currentUrl} report={securityReport} />

        {/* Address Bar Area */}
        <AddressBar 
          inputValue={inputValue} 
          setInputValue={setInputValue} 
          handleNavigate={handleNavigate}
          report={securityReport}
          toggleThreatPanel={() => setIsThreatPanelOpen(!isThreatPanelOpen)}
        />

        {/* Main Viewport */}
        <div className="browser-viewport-container">
          {/* Threat Panel overlay/drawer */}
          <ThreatPanel 
            isOpen={isThreatPanelOpen} 
            report={securityReport} 
            onClose={() => setIsThreatPanelOpen(false)} 
          />
          
          <div className="browser-viewport">
            {currentWebsiteMock ? (
              <div dangerouslySetInnerHTML={{ __html: currentWebsiteMock.content }} className="mock-site-content" />
            ) : (
              <div className="error-page">
                <h2>Site Not Found</h2>
                <p>The mock engine does not have content for {currentUrl}.</p>
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
