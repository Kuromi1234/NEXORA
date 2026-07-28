// services/intent.service.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

/**
 * Parses raw natural language booking intent into structured JSON
 * via Gemini API.
 *
 * @param {string} rawText - e.g. "Book me a quiet Italian restaurant for 2, Saturday 8pm, budget ₹2000"
 * @returns {Object} - { cuisine, date, timeSlot, partySize, budget, mood }
 */
const parseIntent = async (rawText) => {
  const today = new Date().toISOString().split('T')[0];

  const prompt = `
You are an intent parser for a restaurant booking system.
Extract structured booking information from the user's message.
Today's date is ${today}. Use this to resolve relative dates like "Saturday" or "tomorrow".

User message: "${rawText}"

Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks.
Use exactly this structure:
{
  "cuisine": "string (e.g. Italian, Indian, Chinese)",
  "date": "YYYY-MM-DD",
  "timeSlot": "HH:MM (24hr format)",
  "partySize": number,
  "budget": number or null (in INR, null if not mentioned),
  "mood": "string or null (e.g. quiet, romantic, casual, null if not mentioned)"
}

Rules:
- If cuisine is not mentioned, use "any"
- If time is not mentioned, use "20:00" as default
- If partySize is not mentioned, use 2 as default
- If date is not mentioned, use the next Saturday
- budget and mood are optional, set to null if not mentioned
- Always return valid JSON, nothing else
`;

  const result = await model.generateContent(prompt);
  const rawJson = result.response.text().trim();

  let intent;
  try {
    intent = JSON.parse(rawJson);
  } catch (err) {
    throw new Error(`Intent parser returned invalid JSON: ${rawJson}`);
  }

  const required = ['cuisine', 'date', 'timeSlot', 'partySize'];
  for (const field of required) {
    if (!intent[field]) {
      throw new Error(`Intent parser missing required field: ${field}`);
    }
  }

  return intent;
};

module.exports = { parseIntent };