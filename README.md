# 🛡️ Bruhwser: The Active Defense Browser

Bruhwser is an advanced, security-first browser prototype built with React and Vite. It demonstrates next-generation active protection techniques by moving beyond simple blocklists. Bruhwser actively intercepts, analyzes, and neutralizes web threats in real-time.

## ✨ Core Features

### 1. 🥷 Active Deception & Fingerprint Spoofing
Instead of simply blocking trackers, Bruhwser actively misleads them.
- **Hardware Spoofing**: Randomizes `navigator.userAgent`, `deviceMemory`, platform architecture, and screen resolution.
- **Canvas Noise Injection**: Intercepts `HTMLCanvasElement.prototype.toDataURL` to inject invisible, randomized noise into rendered imagery, neutralizing Canvas fingerprinting.
- **Audio Context Variation**: Subtly shifts `AudioContext` frequencies to break audio hardware fingerprinting without affecting perceived sound quality.

### 2. 🧠 AI-Powered Threat Detection
Powered by the Google Gemini API, Bruhwser's Threat Panel performs heavy psychological and content analysis on suspicious pages.
- Detects the tone of the webpage (urgency, panic, FOMO, rewards).
- Returns real-time intelligence on if a site is employing social engineering tactics, resulting in a dynamic **Bruh Score**.

### 3. 🕸️ Simulated Network Interceptor
All navigations are suspended through a protective checkpoint before reaching the renderer.
- Enforces static heuristic checks such as TYPOSQUATTING detection and hardcoded BLACKLIST domain matching (e.g. `palpal.com` vs `paypal.com`).
- Displays an "Engaging Network Interceptor..." visual overlay during payload inspection.

### 4. 🕵️‍♂️ In-Page Behavioral Analysis
Bruhwser injects a resilient analysis payload into the execution context of every loaded tab.
- **Rapid Redirect Detection**: Blocks pages that attempt immediate redirection loops.
- **Excessive Popup Mitigation**: Throttles and blocks `alert()`, `confirm()`, and `window.open` spam.
- **Auto-Submit Neutralization**: Proxies `HTMLFormElement.prototype.submit` to prevent forms from secretly submitting your data without explicit user interaction (e.g. click).

### 5. 📧 Integrated Email Scanner
Accessible directly via the `bruhwser://email-scanner` internal URI, this standalone tool allows users to scan suspicious emails for phishing attempts utilizing the same underlying AI heuristics engine.

## 🚀 Getting Started

1. **Clone and Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   *(Note: If the key is missing, Bruhwser will gracefully fallback to a simulated mock mode).*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing the Capabilities
Bruhwser ships with an internal `mockEngine` that routes requests to local, sandboxed test pages:
- **`https://app.paypal.com/login`**: A safe, baseline banking site.
- **`https://app.palpal.com/login`**: A typosquatted phishing attempt that triggers the AI.
- **`https://crypto-win-now.net`**: A classic "You Won!" crypto scam that triggers urgency and reward heuristics.
- **`https://evil-scam.biz`**: A blacklisted domain demonstrating the instant Network Interceptor.
- **`https://behavior-test.com`**: An actively hostile page that attempts to auto-submit a hidden form and spam popups, triggering the Behavioral Analysis Engine.

---
*Built as a proof-of-concept for the future of active threat mitigation.*
