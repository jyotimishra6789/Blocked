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

// Helper to calculate Levenshtein distance
const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

const topDomains = ['paypal.com', 'google.com', 'facebook.com', 'apple.com', 'amazon.com', 'microsoft.com'];
const phishingKeywords = ['urgent', 'suspended', 'verify your identity', 'claim now', 'won', 'password required', 'unauthorized access'];

// Mock Analysis Engine
export const analyzeUrl = (urlStr) => {
  let hostname = '';
  try {
    const url = new URL(urlStr);
    hostname = url.hostname.replace('www.', ''); // normalize a bit
  } catch (e) {
    return { score: 100, typosquatting: false, newDomain: false, age: 'Unknown', phishingContent: false, flags: [] };
  }

  // 1. Domain Similarity Analysis
  let isTyposquat = false;
  let targetSafeDomain = null;
  let typosquatPenalty = 0;

  for (const domain of topDomains) {
    if (hostname === domain || hostname.endsWith('.' + domain)) continue; // It's the actual safe domain
    const distance = levenshtein(hostname, domain);
    // If it's very close but not exact (e.g. palpal vs paypal, distance 1 or 2)
    if (distance > 0 && distance <= 2) {
      isTyposquat = true;
      targetSafeDomain = domain;
      typosquatPenalty = 50; 
      break;
    }
  }

  // 2. Mock Content Analysis
  let hasPhishingContent = false;
  let contentPenalty = 0;
  let flaggedKeywords = [];
  
  // Try to find the content in our mock DB to scan it, otherwise assume safe for now
  const matchedSite = initialWebsites.find(site => site.url === urlStr);
  const siteContent = matchedSite ? matchedSite.content.toLowerCase() : '';

  if (siteContent) {
    for (const kw of phishingKeywords) {
      if (siteContent.includes(kw)) {
        hasPhishingContent = true;
        flaggedKeywords.push(kw);
        contentPenalty += 20; 
      }
    }
  } else {
    // If no mock body, try to guess from URL
    if (hostname.includes('crypto') || hostname.includes('free') || hostname.includes('win')) {
      hasPhishingContent = true;
      flaggedKeywords.push('suspicious URL keywords');
      contentPenalty += 30;
    }
  }

  // 3. Domain Age Simulation
  let isNewDomain = false;
  let ageStr = 'Registered 5 years ago';
  let agePenalty = 0;

  // Let's hardcode a few known ones for the demo flow, randomizing others
  if (topDomains.includes(hostname) || hostname.endsWith('paypal.com')) {
    ageStr = 'Registered 24 years ago';
  } else if (isTyposquat || hasPhishingContent) {
    // High chance of being new if it's shady
    isNewDomain = true;
    ageStr = 'Registered ' + Math.floor(Math.random() * 10 + 1) + ' days ago';
    agePenalty = 30;
  } else {
    // Random safe age
    ageStr = 'Registered ' + Math.floor(Math.random() * 10 + 2) + ' years ago';
  }

  // 4. Calculate Final Bruh Score
  let score = 100 - typosquatPenalty - contentPenalty - agePenalty;
  
  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let flags = [];
  if (isTyposquat) flags.push(`Looks similar to ${targetSafeDomain}`);
  if (hasPhishingContent) flags.push(`Found suspicious keywords: ${flaggedKeywords.join(', ')}`);
  if (isNewDomain) flags.push(`Very new domain (${ageStr})`);

  return {
    score,
    typosquatting: isTyposquat,
    targetDomain: targetSafeDomain,
    newDomain: isNewDomain,
    age: ageStr,
    phishingContent: hasPhishingContent,
    flaggedKeywords,
    flags
  };
};
