export const initialWebsites = [
  {
    url: 'https://app.paypal.com/login',
    content: `
      <div class="mock-banking-app">
        <div class="mock-login-box">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal Logo" width="120" style="margin-bottom: 1.5rem;" />
          <h2 style="margin-bottom: 1.5rem;">Log in to your account</h2>
          <input type="text" class="mock-input" placeholder="Email or mobile number" />
          <input type="password" class="mock-input" placeholder="Password" />
          <button class="mock-btn">Log In</button>
        </div>
      </div>
    `,
  },
  {
    url: 'https://app.palpal.com/login',
    content: `
      <div class="mock-banking-app">
        <div class="mock-login-box">
          <div class="mock-urgent-banner">
            <strong>URGENT:</strong> Your account will be permanently suspended in 24 hours. Log in immediately to verify your identity.
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal Logo" width="120" style="margin-bottom: 1.5rem;" />
          <h2 style="margin-bottom: 1.5rem;">Secure Verification Required</h2>
          <input type="text" class="mock-input" placeholder="Email or mobile number" />
          <input type="password" class="mock-input" placeholder="Password" />
          <input type="text" class="mock-input" placeholder="Social Security Number (Required)" />
          <button class="mock-btn" style="background: red;">Verify Identity Now</button>
        </div>
      </div>
    `,
  },
  {
    url: 'https://crypto-win-now.net',
    content: `
      <div class="mock-banking-app" style="background: #1e1b4b; color: white;">
        <div class="mock-login-box" style="background: #312e81; border: 2px solid #fbbf24; color: white;">
          <h1 style="color: #fbbf24; font-size: 2.5rem; text-transform: uppercase;">You've Won 1.5 BTC!</h1>
          <p style="margin: 1rem 0; font-size: 1.2rem;">Claim your massive crypto prize before the timer runs out!</p>
          <div style="font-size: 2rem; font-weight: bold; color: #f87171; margin-bottom: 1rem;">14:59</div>
          <input type="text" class="mock-input" placeholder="Enter your wallet private key to claim" style="background: #4338ca; color: white; border-color: #4f46e5;" />
          <button class="mock-btn" style="background: #fbbf24; color: black; font-size: 1.2rem;">CLAIM NOW</button>
        </div>
      </div>
    `,
  }
];

// Mock Analysis Engine
export const analyzeUrl = (urlStr) => {
  let hostname = '';
  try {
    const url = new URL(urlStr);
    hostname = url.hostname;
  } catch (e) {
    return { score: 100, typosquatting: false, newDomain: false, age: 'Unknown', phishingContent: false };
  }

  // Safe site mock
  if (hostname.includes('paypal.com')) {
    return {
      score: 98,
      typosquatting: false,
      newDomain: false,
      age: 'Created 24 years ago',
      phishingContent: false
    };
  }

  // Typosquatting / Phishing mock
  if (hostname.includes('palpal.com')) {
    return {
      score: 12,
      typosquatting: true,
      newDomain: true,
      age: 'Registered 2 days ago',
      phishingContent: true
    };
  }

  // Scam / High Urgency mock
  if (hostname.includes('crypto')) {
    return {
      score: 25,
      typosquatting: false,
      newDomain: true,
      age: 'Registered 5 hours ago',
      phishingContent: true
    };
  }

  // Generic fallback
  return {
    score: 85,
    typosquatting: false,
    newDomain: false,
    age: 'Registered 5 years ago',
    phishingContent: false
  };
};
