# 🌐 Bruhwser

Bruhwser is an advanced, privacy-first cybersecurity browser simulator designed to actively hunt threats and protect user footprint in real-time. Built for a Hackathon, it features an immersive glass-morphism interface powered by Vite and React, equipped with an AI interception engine (powered by Google Gemini) that analyzes, visualizes, and isolates malicious content.

---

## 🚀 Newly Integrated Features

We have supercharged Bruhwser with 10 powerful new features focused on advanced threat analysis and forensics:

1. **🎙️ Threat Narrator (AI Audio):** Live audio alerts on security threats located right in your AddressBar. It automatically reads critical threat reports to you.
2. **🧬 Threat DNA Visualizer:** Real-time visual analysis of code obfuscation. Powered by D3.js, it sits in the Threat Panel and maps out structural anomalies in webpage scripts.
3. **⏮️ Scam Replay Mode:** Full session recording and playback functionality to trace the lifecycle of a browsing attack.
4. **🗺️ Attack Map:** Geospatial mapping of threat origins plotted in the Threat Panel dynamically based on your threat history.
5. **💬 Social Engineering Chat:** An interactive simulated overlay that allows you to chat directly with a simulated scammer on phishing domains (score < 40), analyzing their tactics in real-time.
6. **👣 Digital Footprint Estimator:** An isolated tab that calculates and reveals the active OSINT profile and tracker markers associated with your current session.
7. **✂️ URL Dissector:** Robust breakdown of URL parameters and structural threats, accessible from a dedicated button in the AddressBar.
8. **📸 Share Report:** One-click visual canvas snapshots (using `html2canvas`) for exporting incident reports straight from the Threat Panel.
9. **🕵️‍♂️ Tracker Inspector:** Deep tracking network correlations that categorize the telemetry scripts running across your tabs.
10. **⚔️ Red Team Mode:** A heavily-isolated environment specifically designed for intentionally engaging high-malware targets and experimenting with exploits.

---

## ✨ Core Functionality

- **Active Navigation & Isolation:** Enter URLs in the address bar to engage the Network Interceptor. If a site is highly malicious (Bruh Score < 40), it hits a rigid Block Screen.
- **Privacy Mocking & Deception:** Toggle the "eye" icon in the address bar to instantly inject randomized canvas noise, mock OS parameters, and obfuscate your audio device fingerprint against pervasive trackers.
- **AI Domain Scoring:** Utilizes real-time Large Language Model heuristics to score domains on a 0-100 scale, dissecting urgency language, typosquatting vectors, and WHOIS domain lifespans.

## 🛠️ Tech Stack & Setup

**Stack:** React 19, Vite, Lucide-Icons, D3.js, Google Generative AI SDK, html2canvas.

**Getting Started:**
1. Clone this repository locally.
2. Ensure you have your keys added properly inside your `.env` (Requires `VITE_GEMINI_API_KEY`).
3. Install dependencies: `npm install`
4. Run the local dev server: `npm run dev`
5. Visit your localhost port and explore safely!
