import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API using the Vite environment variable
let ai = null;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenerativeAI(apiKey);
  } else {
    console.warn("VITE_GEMINI_API_KEY is not set. AI Scam Detection will run in mock mode.");
  }
} catch (e) {
  console.warn("Failed to initialize Google Generative AI SDK.", e);
}

const SYSTEM_PROMPT = `
You are a cybersecurity expert analyzing webpage content to detect psychological manipulation and potential scams.
Analyze the following HTML or text content.
Detect elements of:
- Urgency (e.g., "act now", "limited time", "expires in")
- Fear (e.g., "account suspended", "unauthorized access", "police", "fine")
- Rewards (e.g., "you won", "exclusive giveaway", "free money")

Classify the text into one of three categories: Safe, Suspicious, Scam.
Provide a confidence score from 0 to 100.
Provide a concise, 1-2 sentence explanation of your reasoning.

You MUST format your response strictly as valid JSON, nothing else:
{
  "classification": "Safe" | "Suspicious" | "Scam",
  "confidenceScore": number,
  "explanation": "string",
  "urgency": boolean,
  "fear": boolean,
  "rewards": boolean
}
`;

export const analyzeContentWithAI = async (url, content) => {
  // If no API key is provided, return a simulated response after a delay
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let classification = "Safe";
        let confidenceScore = 95;
        let explanation = "No clear signs of phishing, urgency, or fear tactics detected. Standard content.";
        let urgency = false;
        let fear = false;
        let rewards = false;

        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes("suspended") || lowerContent.includes("urgent")) {
          classification = "Scam";
          confidenceScore = 90;
          explanation = "The content aggressively uses fear tactics and false urgency regarding an account suspension.";
          urgency = true;
          fear = true;
        } else if (lowerContent.includes("won") || lowerContent.includes("giveaway") || lowerContent.includes("crypto")) {
          classification = "Scam";
          confidenceScore = 98;
          explanation = "The page uses typical scam tropes involving unexpected huge rewards and forced deadlines.";
          urgency = true;
          rewards = true;
        }

        resolve({
          classification,
          confidenceScore,
          explanation,
          urgency,
          fear,
          rewards
        });
      }, 1500); // Simulate network latency
    });
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });
    const response = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: `URL: ${url}\n\nCONTENT:\n${content}\n\nAnalyze the content based on the instructions.` }] }
      ]
    });

    const resultText = response.response.text();
    // Sometimes the model returns markdown code blocks, let's strip them
    const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '');
    const jsonResult = JSON.parse(jsonStr);
    return jsonResult;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      classification: "Error",
      confidenceScore: 0,
      explanation: "AI analysis failed to execute.",
      urgency: false,
      fear: false,
      rewards: false
    };
  }
};
