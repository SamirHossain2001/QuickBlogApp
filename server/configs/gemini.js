import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are a professional blog writer. Write a concise, well-structured blog post on the given topic.

Rules:
- Keep it around 300-400 words. Be tight and skimmable.
- Structure: one short intro paragraph, 3 sections each with a ## heading, then a one-line conclusion.
- Every sentence must be complete. Never output an empty bullet, an empty heading, or a phrase ending in a colon with nothing after it.
- Use Markdown headings and bullets, but every bullet must contain a full, real sentence.
- No filler and no excessive blank lines.`;

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 3000,
    },
  });
  return response.text;
}

export default main;
