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
  const [privacyMode, setPrivacyMode] = useState(false);

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
          privacyMode={privacyMode}
          setPrivacyMode={setPrivacyMode}
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
                onGoBack={() => handleNavigate('bruhwser://home')}
                onProceed={() => setTabs(tabs.map(t => t.id === activeTabId ? { ...t, bypassed: true } : t))}
              />
            ) : currentWebsiteMock ? (
              <iframe 
                srcDoc={
                  privacyMode 
                    ? `
                      <script>
                        (function() {
                          const r = Math.floor(Math.random() * 10000);
                          const spoofedUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BruhwserPrivacy/' + r;
                          const spoofedPlatform = 'Win32-' + r;
                          const spoofedLanguage = 'en-US-' + r;
                          
                          // Basic Overrides
                          Object.defineProperty(navigator, 'userAgent', { get: () => spoofedUserAgent });
                          Object.defineProperty(navigator, 'platform', { get: () => spoofedPlatform });
                          Object.defineProperty(navigator, 'language', { get: () => spoofedLanguage });
                          
                          // Active Deception: Memory & Screen
                          const spoofedMemory = [2, 4, 8, 16][Math.floor(Math.random() * 4)];
                          Object.defineProperty(navigator, 'deviceMemory', { get: () => spoofedMemory });
                          
                          const screenWidth = [1366, 1440, 1920, 2560][Math.floor(Math.random() * 4)];
                          const screenHeight = [768, 900, 1080, 1440][Math.floor(Math.random() * 4)];
                          Object.defineProperty(window.screen, 'width', { get: () => screenWidth });
                          Object.defineProperty(window.screen, 'height', { get: () => screenHeight });
                          Object.defineProperty(window.screen, 'colorDepth', { get: () => 24 });
                          Object.defineProperty(window.screen, 'pixelDepth', { get: () => 24 });

                          // Active Deception: Canvas Noise Injection
                          const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
                          HTMLCanvasElement.prototype.toDataURL = function() {
                            const ctx = this.getContext('2d');
                            if (ctx) {
                              ctx.fillStyle = \`rgba(\${Math.floor(Math.random() * 255)}, \${Math.floor(Math.random() * 255)}, \${Math.floor(Math.random() * 255)}, 0.01)\`;
                              ctx.fillRect(0, 0, 1, 1);
                            }
                            return originalToDataURL.apply(this, arguments);
                          };

                          const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
                          CanvasRenderingContext2D.prototype.getImageData = function() {
                            const imageData = originalGetImageData.apply(this, arguments);
                            if (imageData && imageData.data && imageData.data.length > 0) {
                              imageData.data[0] = (imageData.data[0] + Math.floor(Math.random() * 3)) % 255;
                            }
                            return imageData;
                          };

                          // Active Deception: AudioContext Variation
                          const AudioContext = window.AudioContext || window.webkitAudioContext;
                          if (AudioContext) {
                            const originalCreateOscillator = AudioContext.prototype.createOscillator;
                            AudioContext.prototype.createOscillator = function() {
                              const oscillator = originalCreateOscillator.apply(this, arguments);
                              const originalStart = oscillator.start;
                              oscillator.start = function() {
                                this.frequency.value = this.frequency.value + (Math.random() * 0.001);
                                return originalStart.apply(this, arguments);
                              };
                              return oscillator;
                            };
                          }

                          console.log('[Privacy Mode] Active Deception Engine Enabled:', {
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            deviceMemory: navigator.deviceMemory,
                            screenResolution: \`\${window.screen.width}x\${window.screen.height}\`,
                            canvasSpoofed: true,
                            audioSpoofed: true
                          });
                        })();
                      </script>
                      ${currentWebsiteMock.content}
                    `
                    : currentWebsiteMock.content
                } 
                className="mock-site-iframe" 
                title="Mock Site Content"
                sandbox="allow-scripts allow-same-origin"
              />
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
