const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyC4uWe_IpoUGp48wVtkw1-cYizzmZBtbaI" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: "Explain how AI works in a few words" }]}],
  });

  console.log(response.candidates[0].content);
}

// Call the function using .then() to avoid top-level await issues
main().catch(console.error);
