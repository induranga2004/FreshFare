const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const Chat = require("../Models/chatModel.js");

const GEMINI_API_KEY = "AIzaSyC4uWe_IpoUGp48wVtkw1-cYizzmZBtbaI";  // 🔹 Add API Key Here

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// 🔹 Get Database Schema Information
const getDatabaseSchema = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  let schema = "";

  for (const col of collections) {
    const sample = await mongoose.connection.db.collection(col.name).findOne();
    if (sample) {
      schema += `Collection: ${col.name} - Fields: ${Object.keys(sample).join(", ")}\n`;
    }
  }

  return schema;
};

// 🔹 Generate a MongoDB Query Based on User Input
const generateMongoQuery = async (userQuery, schemaInfo) => {
  const prompt = `
  You are a MongoDB query generator. The database has these collections:
  ${schemaInfo}
  
  Convert this user request into a MongoDB query.

  Only return the query in raw JavaScript format, like this:
  db.collection.find({ field: "value" })

  Do not include explanations, code blocks, or extra text.
  `;

  const result = await model.generateContent(prompt);
  const rawQuery = result.response.text();

  // Extract only the first line (ensuring no extra text)
  const queryLine = rawQuery.split("\n")[0].trim();
  return queryLine;
};

// 🔹 Execute MongoDB Query Safely
const executeMongoQuery = async (query) => {
  try {
    console.log("Generated Query:", query);

    // Extract collection name
    const match = query.match(/db\.(\w+)\.find/);
    if (!match) {
      throw new Error("Invalid query format.");
    }

    const collectionName = match[1];
    const collection = mongoose.connection.db.collection(collectionName);

    // Extract JSON filter object from query
    const filterMatch = query.match(/find\((\{.*?\})\)/);
    const filter = filterMatch ? JSON.parse(filterMatch[1]) : {};

    return await collection.find(filter).toArray();
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Invalid query generated or database issue." };
  }
};

// 🔹 Handle AI Chat Requests
const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    let chatHistory = await Chat.findOne();

    if (!chatHistory) {
      chatHistory = new Chat({ messages: [] });
    }

    chatHistory.messages.push({ role: "user", content: message });

    const conversationContext = chatHistory.messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
    const schemaInfo = await getDatabaseSchema();
    const mongoQuery = await generateMongoQuery(message, schemaInfo);

    console.log("Generated Query:", mongoQuery);

    const queryResult = await executeMongoQuery(mongoQuery);

    // 🔹 AI Generates Response Based on Retrieved Data
    const aiPrompt = `
      Context so far:
      ${conversationContext}

      User asked: "${message}"
      Database data: ${JSON.stringify(queryResult)}

      You are the chatbot of FreshFare Grocery Store and your job is to provide a relevant response in natural language to the owner.
      Please format the response without using asterisks or extra formatting. Provide a clear, concise response in plain text.
    `;

    const aiResponse = await model.generateContent(aiPrompt);
    const botMessage = aiResponse.response.text();

    chatHistory.messages.push({ role: "assistant", content: botMessage });
    await chatHistory.save();

    res.json({ response: botMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing request" });
  }
};

// 🔹 Reset Chat (New Chat Button)
const resetChat = async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ message: "Chat history cleared. Start a new conversation!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error resetting chat" });
  }
};

module.exports = { chatWithAI, resetChat };
