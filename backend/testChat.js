const { GoogleGenAI } = require("@google/genai");
require('dotenv').config(); // Load environment variables

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: "Explain how AI works in a few words" }]}],
  });

  console.log(response.candidates[0].content);
}

// Call the function using .then() to avoid top-level await issues
main().catch(console.error);
