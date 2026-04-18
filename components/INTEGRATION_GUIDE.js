/**
 * ============================================================
 *  BRUHWSER — 10 HACKATHON FEATURES: INTEGRATION GUIDE
 * ============================================================
 *
 * This file explains exactly where to add each feature.
 * All new files are in src/utils/ and src/features/.
 * The existing files (App.jsx, ThreatPanel.jsx, etc.) need
 * small additions — shown below as diff-style comments.
 * ============================================================
 */


// ──────────────────────────────────────────────────────────────
// 0. index.html — add CDN scripts before </body>
// ──────────────────────────────────────────────────────────────
/*
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
*/


// ──────────────────────────────────────────────────────────────
// 1. LIVE THREAT NARRATION  →  AddressBar.jsx
// ──────────────────────────────────────────────────────────────
/*
  // In AddressBar.jsx, add this import:
  import NarratorControls from './NarratorControls';

  // Inside the JSX, add NarratorControls next to the privacy toggle:
  <div className="extensions-area">
    {privacyMode && <div className="deception-label">Active Deception Enabled</div>}
    
    // ← ADD THIS:
    <NarratorControls report={report} url={inputValue} autoNarrate={true} />
    
    <button className={`nav-btn privacy-toggle ...`}>...</button>
    <button className="nav-btn" onClick={toggleThreatPanel}>...</button>
  </div>
*/


// ──────────────────────────────────────────────────────────────
// 2. THREAT DNA VISUALIZER  →  ThreatPanel.jsx
// ──────────────────────────────────────────────────────────────
/*
  // In ThreatPanel.jsx, add import:
  import ThreatDNA from './ThreatDNA';

  // Add inside panel-content div, after the breakdown-section:
  <ThreatDNA url={report?.url} report={report} />

  // Also pass url into ThreatPanel from App.jsx:
  // In App.jsx: <ThreatPanel ... url={activeTab.url} />
  // In ThreatPanel props: const ThreatPanel = ({ isOpen, report, onClose, privacyMode, url }) => ...
*/


// ──────────────────────────────────────────────────────────────
// 3. SCAM REPLAY MODE  →  App.jsx
// ──────────────────────────────────────────────────────────────
/*
  // In App.jsx, add imports:
  import ReplayPlayer, { useReplayRecorder } from './features/ReplayMode';
  import { Circle, StopCircle } from 'lucide-react';

  // Inside App(), after existing state:
  const { events, recording, startRecording, stopRecording, recordEvent } = useReplayRecorder();
  const [showReplay, setShowReplay] = useState(false);

  // In handleNavigate(), after report is set, add:
  recordEvent(cleanUrl, report);

  // In the browser-viewport, after the caution-banner:
  {showReplay && events.length > 0 && (
    <ReplayPlayer events={events} onClose={() => setShowReplay(false)} />
  )}

  // Add a record/replay button in the taskbar or address bar:
  <button onClick={recording ? stopRecording : startRecording}>
    {recording ? <StopCircle size={16} /> : <Circle size={16} />}
  </button>
  <button onClick={() => setShowReplay(true)} disabled={events.length === 0}>
    Replay
  </button>
*/


// ──────────────────────────────────────────────────────────────
// 4. ATTACK MAP  →  ThreatPanel.jsx or a new fullscreen view
// ──────────────────────────────────────────────────────────────
/*
  // In App.jsx, track all visited pages with scores:
  const [threatHistory, setThreatHistory] = useState([]);

  // In handleNavigate(), after report is set:
  setThreatHistory(prev => [...prev, { url: cleanUrl, score: report.score }]);

  // Pass to ThreatPanel:
  <ThreatPanel ... threatHistory={threatHistory} />

  // In ThreatPanel.jsx:
  import AttackMap from '../features/AttackMap';
  // Add inside panel-content:
  <AttackMap threats={threatHistory} />
*/


// ──────────────────────────────────────────────────────────────
// 5. SOCIAL ENGINEERING CHAT  →  App.jsx browser viewport
// ──────────────────────────────────────────────────────────────
/*
  // In App.jsx, import:
  import SocialEngineeringChat from './features/SocialEngineeringChat';

  // Inside the browser-viewport, in the iframe block, after the iframe:
  {currentWebsiteMock && (
    <SocialEngineeringChat
      report={activeTab.securityReport}
      targetBrand={activeTab.securityReport?.targetDomain ?? 'PayPal'}
    />
  )}

  // The chat auto-opens when score < 40.
*/


// ──────────────────────────────────────────────────────────────
// 6. DIGITAL FOOTPRINT ESTIMATOR  →  New tab type
// ──────────────────────────────────────────────────────────────
/*
  // In App.jsx, add to handleCreateTab variants or add a new button:
  const handleCreateFootprintTab = () => {
    const newId = Date.now();
    setTabs([...tabs, {
      id: newId,
      url: 'bruhwser://footprint',
      inputValue: 'bruhwser://footprint',
      securityReport: { score: 100 },
      bypassed: false
    }]);
    setActiveTabId(newId);
  };

  // In TabBar.jsx, add a Fingerprint icon button next to the Mail button.
  // import { Fingerprint } from 'lucide-react';
  // <button className="new-tab-btn" onClick={handleCreateFootprintTab}>
  //   <Fingerprint size={16} />
  // </button>

  // In App.jsx render, add this case in the viewport conditionals:
  import FootprintEstimator from './features/FootprintEstimator';
  // } else if (activeTab.url === 'bruhwser://footprint') ? (
  //   <FootprintEstimator privacyMode={privacyMode} />
  // ) : currentWebsiteMock ? ...
*/


// ──────────────────────────────────────────────────────────────
// 7. URL DISSECTOR  →  New tab type
// ──────────────────────────────────────────────────────────────
/*
  // Same pattern as footprint — add bruhwser://dissector route.
  import UrlDissector from './features/UrlDissector';

  // When a user presses Enter with a URL, also pre-populate the dissector:
  // } else if (activeTab.url === 'bruhwser://dissector') ? (
  //   <UrlDissector initialUrl={activeTab.inputValue} />
  // )

  // Also add a "Dissect URL" button in AddressBar.jsx next to the score pill:
  // <button onClick={() => { /* navigate to dissector tab with current URL */ }}>
  //   <Scissors size={14} />
  // </button>
*/


// ──────────────────────────────────────────────────────────────
// 8. SHARE REPORT  →  ThreatPanel.jsx
// ──────────────────────────────────────────────────────────────
/*
  // In ThreatPanel.jsx, add import:
  import ShareReportButton from '../features/ShareReportButton';

  // Add at the bottom of panel-content, before the closing div:
  <ShareReportButton report={report} url={url} />

  // Make sure url prop is passed to ThreatPanel (see Feature 2 note above).
*/


// ──────────────────────────────────────────────────────────────
// 9. TRACKER INSPECTOR  →  ThreatPanel.jsx
// ──────────────────────────────────────────────────────────────
/*
  // In ThreatPanel.jsx, add import:
  import TrackerInspector from '../features/TrackerInspector';

  // Add inside panel-content after breakdown-section:
  <TrackerInspector url={url} />

  // url prop passed same as Feature 2 above.
*/


// ──────────────────────────────────────────────────────────────
// 10. RED TEAM MODE  →  New tab type
// ──────────────────────────────────────────────────────────────
/*
  // Add bruhwser://redteam route.
  import RedTeamMode from './features/RedTeamMode';

  // In TabBar.jsx add a Swords icon button:
  // import { Swords } from 'lucide-react';
  // <button className="new-tab-btn" onClick={handleCreateRedTeamTab} title="Red Team Mode"
  //         style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
  //   <Swords size={16} color="var(--accent-danger)" />
  // </button>

  // In App.jsx render:
  // } else if (activeTab.url === 'bruhwser://redteam') ? (
  //   <RedTeamMode />
  // )
*/


// ──────────────────────────────────────────────────────────────
// QUICK PRIORITY ORDER FOR HACKATHON DEMO
// ──────────────────────────────────────────────────────────────
/*
  Recommended build order (most impact, lowest risk):
  
  1. Feature 7 — URL Dissector      (2 hrs, standalone, no API needed)
  2. Feature 6 — Footprint          (2 hrs, standalone, no API needed)
  3. Feature 1 — Voice narration    (1 hr, just add NarratorControls to AddressBar)
  4. Feature 9 — Tracker Inspector  (1 hr, drop into ThreatPanel)
  5. Feature 8 — Share Report       (2 hrs, needs html2canvas CDN)
  6. Feature 3 — Replay Mode        (2 hrs, hook + player)
  7. Feature 5 — SE Chat            (3 hrs, needs API key)
  8. Feature 10 — Red Team          (3 hrs, needs API key)
  9. Feature 4 — Attack Map         (3 hrs, SVG world map)
  10. Feature 2 — Threat DNA        (4 hrs, needs D3 CDN)
*/
