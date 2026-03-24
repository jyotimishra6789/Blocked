export const initialWebsites = [
  {
    url: 'https://app.paypal.com/login',
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; color: #333; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal Logo" width="120" style="margin-bottom: 2rem;" />
          <h2 style="font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem;">Log in to your account</h2>
          <input type="text" placeholder="Email or mobile number" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          <button style="width: 100%; padding: 0.9rem; background: #0070ba; color: white; border: none; border-radius: 24px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-bottom: 1rem;">Next</button>
          <div style="display: flex; align-items: center; margin: 1rem 0;">
            <div style="flex: 1; height: 1px; background: #ccc;"></div>
            <span style="padding: 0 10px; color: #666; font-size: 0.9rem;">or</span>
            <div style="flex: 1; height: 1px; background: #ccc;"></div>
          </div>
          <button style="width: 100%; padding: 0.9rem; background: white; color: #0070ba; border: 1px solid #0070ba; border-radius: 24px; font-size: 1rem; font-weight: bold; cursor: pointer;">Sign Up</button>
        </div>
        <footer style="margin-top: 2rem; color: #666; font-size: 0.85rem; display: flex; gap: 1rem;">
          <span>Contact Us</span>
          <span>Privacy</span>
          <span>Legal</span>
          <span>Policy Updates</span>
        </footer>
      </div>
    `,
  },
  {
    url: 'https://app.palpal.com/login',
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; color: #333; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center;">
          <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 4px; font-size: 0.9rem; text-align: left; border-left: 4px solid #ef4444; margin-bottom: 1.5rem;">
            <strong>URGENT:</strong> We noticed unusual activity. Your account will be permanently suspended in 24 hours unless you verify your identity.
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal Logo" width="120" style="margin-bottom: 2rem;" />
          <h2 style="font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem;">Secure Verification Required</h2>
          <input type="text" placeholder="Email or mobile number" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          <input type="password" placeholder="Password required" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          <input type="text" placeholder="Social Security Number" style="width: 100%; padding: 0.8rem; margin-bottom: 1.5rem; border: 1px solid #ef4444; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          <button style="width: 100%; padding: 0.9rem; background: #dc2626; color: white; border: none; border-radius: 24px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-bottom: 1rem;">Verify Identity Now</button>
        </div>
      </div>
    `,
  },
  {
    url: 'https://crypto-win-now.net',
    content: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #000 100%); color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="background: rgba(49, 46, 129, 0.8); padding: 3rem; border-radius: 16px; border: 2px solid #fbbf24; box-shadow: 0 0 40px rgba(251, 191, 36, 0.3); width: 100%; max-width: 500px; text-align: center; backdrop-filter: blur(10px);">
          <div style="display: inline-block; background: #fbbf24; color: black; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px;">Exclusive Giveaway</div>
          <h1 style="color: #fbbf24; font-size: 3rem; margin: 0 0 1rem 0; text-transform: uppercase;">You've Won 1.5 BTC!</h1>
          <p style="margin: 0 0 2rem 0; font-size: 1.2rem; color: #cbd5e1;">Your wallet has been selected for our daily jackpot. Claim your massive crypto prize before the timer runs out!</p>
          
          <div style="background: rgba(0,0,0,0.5); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 0.5rem;">Offer expires in:</div>
            <div style="font-family: monospace; font-size: 3rem; font-weight: bold; color: #f87171; text-shadow: 0 0 10px rgba(248, 113, 113, 0.5);">14:59</div>
          </div>
          
          <input type="text" placeholder="Enter your 12-word recovery phrase to claim" style="width: 100%; padding: 1.2rem; margin-bottom: 1.5rem; background: rgba(0,0,0,0.3); color: white; border: 1px solid #6366f1; border-radius: 8px; box-sizing: border-box; font-size: 1rem; text-align: center;" />
          
          <button style="width: 100%; padding: 1.2rem; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); color: black; border: none; border-radius: 8px; font-size: 1.3rem; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: transform 0.2s; box-shadow: 0 10px 20px rgba(217, 119, 6, 0.4);">CLAIM MY BITCOIN NOW</button>
          
          <div style="margin-top: 1.5rem; font-size: 0.8rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></span>
            1,432 users claiming right now
          </div>
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
