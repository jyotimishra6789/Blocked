/**
 * Feature 1: Live Threat Narration
 * Uses Web Speech API to narrate threats as they are detected.
 * No backend required — runs entirely in the browser.
 */

const VOICE_SETTINGS = {
  rate: 0.92,
  pitch: 0.85,
  volume: 1,
};

// Pick the best available voice — prefer a calm, authoritative English one
function getBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  const preferred = ['Google UK English Male', 'Microsoft David', 'Alex', 'Daniel'];
  for (const name of preferred) {
    const match = voices.find(v => v.name.includes(name));
    if (match) return match;
  }
  return voices.find(v => v.lang === 'en-US') || voices[0] || null;
}

function buildNarration(report, url) {
  if (!report) return null;
  const { score, typosquatting, targetDomain, newDomain, age, aiAnalysis, behavioralFlags } = report;

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  if (score > 80) {
    return `Site analysis complete. ${domain} appears safe with a trust score of ${score} out of 100. No significant threats detected. You may proceed.`;
  }

  const parts = [`Warning. Security threat detected on ${domain}.`];

  if (score < 40) {
    parts.push(`This site has a critically low trust score of ${score} out of 100.`);
  } else {
    parts.push(`This site has a low trust score of ${score} out of 100. Proceed with caution.`);
  }

  if (typosquatting && targetDomain) {
    parts.push(`The domain closely mimics ${targetDomain}, a known legitimate service. This is a classic typosquatting attack designed to steal your credentials.`);
  }

  if (newDomain) {
    parts.push(`This domain was registered recently — ${age}. Newly registered domains are a primary indicator of phishing infrastructure.`);
  }

  if (aiAnalysis?.classification === 'Scam') {
    parts.push(`Artificial intelligence content analysis classifies this page as a scam with ${aiAnalysis.confidenceScore} percent confidence.`);
    if (aiAnalysis.urgency) parts.push('The page uses urgency language designed to pressure you into acting without thinking.');
    if (aiAnalysis.fear) parts.push('Fear-based manipulation tactics have been detected.');
  }

  if (behavioralFlags?.length > 0) {
    parts.push(`Suspicious browser behavior detected: ${behavioralFlags.join('. ')}.`);
  }

  parts.push('Do not enter any personal information or credentials on this site.');

  return parts.join(' ');
}

let currentUtterance = null;

export function narrateThreat(report, url) {
  if (!window.speechSynthesis) return;

  // Cancel any current speech
  window.speechSynthesis.cancel();

  const text = buildNarration(report, url);
  if (!text) return;

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = VOICE_SETTINGS.rate;
    utterance.pitch = VOICE_SETTINGS.pitch;
    utterance.volume = VOICE_SETTINGS.volume;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be loaded yet on first call
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
  } else {
    speak();
  }
}

export function stopNarration() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isNarrating() {
  return window.speechSynthesis?.speaking ?? false;
}
