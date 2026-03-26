export const behavioralAnalysisScript = `
(function() {
  // Configuration
  const POPUP_THRESHOLD = 2;
  const TIME_WINDOW = 3000;
  
  let popupsCount = 0;
  let lastPopupTime = 0;
  
  const alertParent = (behavior, msg) => {
    window.parent.postMessage({ type: 'BEHAVIOR_ALERT', behavior, message: msg }, '*');
  };

  // 1. Detect Excessive Popups
  ['alert', 'prompt', 'confirm', 'open'].forEach(method => {
    const original = window[method];
    if (original) {
      window[method] = function(...args) {
        const now = Date.now();
        if (now - lastPopupTime > TIME_WINDOW) {
          popupsCount = 0;
        }
        popupsCount++;
        lastPopupTime = now;
        
        if (popupsCount >= POPUP_THRESHOLD) {
          alertParent('excessive_popups', 'Page attempted to spam popups or alerts.');
          console.warn("[Bruhwser] Blocked excessive popup.");
          return null; // Block further popups
        }
        return original.apply(this, args);
      };
    }
  });

  // 2. Detect Rapid Redirects
  let loadTime = Date.now();
  window.addEventListener('beforeunload', () => {
    if (Date.now() - loadTime < 1500) {
      alertParent('rapid_redirect', 'Page attempted an immediate rapid redirect.');
    }
  });

  // 3. Detect Auto Form Submit
  const originalSubmit = HTMLFormElement.prototype.submit;
  let lastUserClick = 0;
  window.addEventListener('click', () => { lastUserClick = Date.now(); }, true);
  
  HTMLFormElement.prototype.submit = function(...args) {
    if (Date.now() - lastUserClick > 2000) {
      alertParent('auto_submit', 'Form attempted to auto-submit without user interaction.');
      console.warn("[Bruhwser] Blocked auto-submitting form.");
      return; // Prevent form from redirecting the iframe
    }
    return originalSubmit.apply(this, args);
  };
})();
`;
