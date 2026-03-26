export const initialWebsites = [
  {
    url: 'https://amazon.com',
    content: `
      <div style="font-family: 'Amazon Ember', Arial, sans-serif; background-color: #e3e6e6; color: #0f1111; min-height: 100vh;">
        <!-- Header -->
        <header style="background-color: #131921; color: white; padding: 10px 20px; display: flex; align-items: center; gap: 20px;">
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: bold; color: white;">amazon</h2>
          <div style="flex: 1; display: flex;">
            <input type="text" placeholder="Search Amazon" style="flex: 1; padding: 10px; border: none; border-radius: 4px 0 0 4px; outline: none; font-size: 1rem;" />
            <button style="background-color: #febd69; border: none; padding: 10px 20px; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 1rem;">🔍</button>
          </div>
          <div style="display: flex; gap: 15px; font-size: 0.9rem;">
            <div>Hello, sign in<br/><b>Account & Lists</b></div>
            <div>Returns<br/><b>& Orders</b></div>
            <div style="font-size: 1.2rem; display: flex; align-items: center;">🛒 <b style="font-size: 1rem; margin-left: 4px;">0</b></div>
          </div>
        </header>
        
        <!-- Sub Header -->
        <div style="background-color: #232f3e; color: white; padding: 5px 20px; font-size: 0.9rem; display: flex; gap: 15px;">
          <span style="display: flex; align-items: center; gap: 5px; cursor: pointer; font-weight: bold;">☰ All</span>
          <span style="cursor: pointer;">Today's Deals</span>
          <span style="cursor: pointer;">Customer Service</span>
          <span style="cursor: pointer;">Registry</span>
          <span style="cursor: pointer;">Gift Cards</span>
          <span style="cursor: pointer;">Sell</span>
        </div>

        <!-- Main Content -->
        <div style="padding: 20px; max-width: 1400px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap;">
          <div style="background: white; padding: 20px; flex: 1; min-width: 280px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Keep shopping for</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div style="background: #f8f8f8; height: 120px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #555;">⌚</div>
              <div style="background: #f8f8f8; height: 120px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #555;">💻</div>
              <div style="background: #f8f8f8; height: 120px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #555;">🎧</div>
              <div style="background: #f8f8f8; height: 120px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #555;">📱</div>
            </div>
            <a href="#" style="color: #007185; display: block; margin-top: 15px; text-decoration: none;">View your browsing history</a>
          </div>

          <div style="background: white; padding: 20px; flex: 1; min-width: 280px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Gaming accessories</h3>
            <div style="background: #f8f8f8; height: 250px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #555;">🎮</div>
            <a href="#" style="color: #007185; display: block; margin-top: 15px; text-decoration: none;">See more</a>
          </div>

          <div style="background: white; padding: 20px; flex: 1; min-width: 280px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;">Top Deal</h3>
            <div style="background: #f8f8f8; height: 180px; border-radius: 4px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #555;">📺</div>
            <span style="background: #cc0c39; color: white; padding: 4px 8px; border-radius: 2px; font-size: 0.8rem; font-weight: bold;">Up to 40% off</span>
            <span style="color: #cc0c39; font-weight: bold; font-size: 0.8rem; margin-left: 10px;">Top deal</span>
            <div style="margin-top: 8px; font-size: 0.9rem;">Electronics & Gadgets</div>
            <a href="#" style="color: #007185; display: block; margin-top: 15px; text-decoration: none;">See all deals</a>
          </div>
        </div>
      </div>
    `,
  },
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
  },
  {
    url: 'bruhwser://home',
    content: `
      <div style="font-family: 'Inter', sans-serif; background: radial-gradient(circle at 50% -20%, #312e81 0%, #0f172a 100%); color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="text-align: center; margin-bottom: 3rem; animation: fadeDown 0.5s ease-out;">
          <img src="/logo.png" alt="Bruhwser Logo" style="height: 140px; width: auto; margin-bottom: 1rem; filter: drop-shadow(0 0 20px rgba(192,132,252,0.3));" />
          <p style="font-size: 1.2rem; color: #94a3b8; margin-top: 0.5rem;">Browse securely. We've got your back.</p>
        </div>
        
        <div style="width: 100%; max-width: 600px; padding: 0 2rem;">
          <div style="position: relative; width: 100%;">
            <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search the web or type a URL..." style="width: 100%; padding: 1.2rem 1.2rem 1.2rem 3rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; font-size: 1.1rem; outline: none; box-shadow: 0 10px 30px rgba(0,0,0,0.2); backdrop-filter: blur(10px); box-sizing: border-box;" readonly />
          </div>
        </div>

        <div style="display: flex; gap: 2rem; margin-top: 4rem;">
          <div style="text-align: center; cursor: pointer;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; transition: background 0.2s;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span style="font-size: 0.85rem; color: #94a3b8;">Dashboard</span>
          </div>
          <div style="text-align: center; cursor: pointer;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; transition: background 0.2s;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <span style="font-size: 0.85rem; color: #94a3b8;">History</span>
          </div>
          <div style="text-align: center; cursor: pointer;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; transition: background 0.2s;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <span style="font-size: 0.85rem; color: #94a3b8;">Bookmarks</span>
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
const blacklistDomains = ['evil-scam.biz', 'crypto-win-now.net', 'steal-your-crypto.com']; // Explicit blacklist

// Mock Analysis Engine
export const analyzeUrl = (urlStr) => {
  if (urlStr === 'bruhwser://home' || urlStr === 'bruhwser://email-scanner' || urlStr === '') {
    return { score: 100, typosquatting: false, newDomain: false, age: 'N/A', phishingContent: false, flags: [] };
  }

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

  // 1.5 Blacklist Check
  let isOnBlacklist = false;
  if (blacklistDomains.includes(hostname)) {
    isOnBlacklist = true;
    typosquatPenalty += 75; // Heavy explicit penalty
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
  if (isOnBlacklist) flags.push(`Explicitly matched known malicious blacklist.`);
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
