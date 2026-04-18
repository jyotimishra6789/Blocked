import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, AlertTriangle, Send } from 'lucide-react';

/**
 * Feature 5: Social Engineering Chat Simulator
 * Injects a "scammer support chat" into flagged sites.
 * Bruhwser labels every manipulation tactic in real time.
 * Uses the Anthropic API to generate scammer responses.
 */

const TACTIC_LABELS = {
  urgency: { label: 'Urgency', color: '#ef4444', desc: 'Creates artificial time pressure' },
  fear: { label: 'Fear tactic', color: '#dc2626', desc: 'Induces anxiety to bypass rational thinking' },
  authority: { label: 'Authority impersonation', color: '#f59e0b', desc: 'Pretends to be official to gain trust' },
  reward: { label: 'False reward', color: '#f59e0b', desc: 'Lures with too-good-to-be-true offers' },
  isolation: { label: 'Isolation', color: '#ef4444', desc: 'Discourages consulting others' },
  personal: { label: 'Personal data fishing', color: '#dc2626', desc: 'Attempting to extract sensitive info' },
  trust: { label: 'Trust building', color: '#64748b', desc: 'Establishing false rapport before the ask' },
};

function detectTactics(message) {
  const m = message.toLowerCase();
  const detected = [];
  if (/urgent|immediately|right now|asap|limited time|expire|24 hour/i.test(m)) detected.push('urgency');
  if (/suspend|block|freeze|banned|illegal|breach|compromised|at risk/i.test(m)) detected.push('fear');
  if (/official|department|support team|security team|we are from/i.test(m)) detected.push('authority');
  if (/won|prize|reward|gift|free|selected|lucky|congratulations/i.test(m)) detected.push('reward');
  if (/don't tell|keep private|between us|don't share|confidential/i.test(m)) detected.push('isolation');
  if (/ssn|social security|credit card|password|otp|pin|account number|date of birth/i.test(m)) detected.push('personal');
  if (/understand|here to help|don't worry|i see|i know how you feel/i.test(m)) detected.push('trust');
  return detected;
}

async function getScammerResponse(userMessage, history, targetBrand) {
  try {
    const systemPrompt = `You are simulating a SCAMMER pretending to be ${targetBrand} support for a cybersecurity EDUCATIONAL demo. 
Your job is to show realistic social engineering tactics so users can recognize them. 
Use exactly ONE clear manipulation tactic per message: urgency, fear, authority impersonation, false rewards, isolation, or personal data fishing.
Keep messages SHORT (1-2 sentences). Always push toward getting account credentials or personal info.
This is purely educational — label your tactic clearly through your language.`;

    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: userMessage }
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: systemPrompt,
        messages,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? "Please verify your account details to continue.";
  } catch {
    return "Your account has been flagged. Please verify your identity immediately to avoid suspension.";
  }
}

const TacticBadge = ({ tactic }) => {
  const info = TACTIC_LABELS[tactic];
  if (!info) return null;
  return (
    <div title={info.desc} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '0.65rem', fontWeight: 600,
      padding: '2px 6px', borderRadius: 10,
      background: `${info.color}22`,
      color: info.color,
      border: `1px solid ${info.color}44`,
    }}>
      <AlertTriangle size={9} />
      {info.label}
    </div>
  );
};

const SocialEngineeringChat = ({ report, targetBrand = 'PayPal' }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-open on high-threat sites
  useEffect(() => {
    if (report && report.score < 40) {
      setTimeout(() => setOpen(true), 1500);
      // First scammer message
      setMessages([{
        id: 1, role: 'assistant',
        content: `Hello! I'm from ${targetBrand} Security Department. We've detected suspicious activity on your account. Please verify your identity immediately to prevent suspension.`,
        tactics: ['fear', 'authority', 'urgency'],
      }]);
    }
  }, [report]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: input, tactics: [] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const responseText = await getScammerResponse(input, history, targetBrand);
    const tactics = detectTactics(responseText);

    setMessages(prev => [...prev, {
      id: Date.now() + 1, role: 'assistant',
      content: responseText, tactics,
    }]);
    setLoading(false);
  };

  if (!report || report.score > 60) return null;

  return (
    <>
      {/* Chat bubble trigger */}
      {!open && (
        <div onClick={() => setOpen(true)} style={{
          position: 'absolute', bottom: 20, right: 20,
          background: 'var(--accent-primary)',
          borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 50,
          animation: 'pulse-danger 2s infinite',
          boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
        }}>
          <MessageCircle size={22} color="white" />
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          width: 320, height: 420,
          background: '#0f0f13',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12,
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          boxShadow: '0 10px 40px rgba(239,68,68,0.15)',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>{targetBrand} Support</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-danger)' }}>Bruhwser: SCAM SIMULATION — Educational</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
                <div style={{
                  maxWidth: '80%', padding: '8px 10px', borderRadius: 10,
                  background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                  fontSize: '0.8rem', color: 'white', lineHeight: 1.4,
                }}>
                  {msg.content}
                </div>
                {msg.tactics.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: '80%' }}>
                    {msg.tactics.map(t => <TacticBadge key={t} tactic={t} />)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `pulse-danger 1s ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a response..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', color: 'white', fontSize: '0.8rem' }}
            />
            <button onClick={send} disabled={loading} style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialEngineeringChat;
