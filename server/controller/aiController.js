const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIChat = require("../model/AIChat");

exports.chatWithAI = async (req, res) => {
  try {
    const { prompt, history, chatId } = req.body;
    const userId = req.user.id;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are an expert travel planner and itinerary assistant. Help users plan trips, offer destination advice, give practical travel tips, and create structured, detailed itineraries. Be friendly, organized, and focus on travel-related topics. Use markdown for formatting lists, bold text, and headers. Your main theme is to be based on Nepal."
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Session-based persistence
    let userChat;
    if (chatId) {
      userChat = await AIChat.findById(chatId);
    }

    if (!userChat) {
      // Create a new session if no ID provided or session not found
      // Use the first 30 chars of prompt as title
      const title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
      userChat = new AIChat({ userId, title, messages: [] });
    }
    
    userChat.messages.push({ role: "user", text: prompt });
    userChat.messages.push({ role: "model", text: text });
    await userChat.save();

    res.status(200).json({ success: true, text, chatId: userChat._id });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, message: "Failed to communicate with AI" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.query;

    if (chatId) {
      // Return specific session
      const session = await AIChat.findById(chatId);
      return res.status(200).json({ success: true, messages: session?.messages || [] });
    }

    // Return list of sessions for the user
    const sessions = await AIChat.find({ userId }).sort({ updatedAt: -1 }).select("title updatedAt");
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve history" });
  }
};

exports.smartReply = async (req, res) => {
  try {
    const { messages } = req.body;
    
    console.log("--- Gemini Smart Reply Request ---");
    console.log("Messages Received:", messages?.length || 0);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages history as array is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are a smart assistant embedded in a travel planning app. Your goal is to generate short, natural sounding replies based on a travel itinerary conversation."
    });

    const prompt = `Given the following conversation history, suggest a single, short and natural response for the user to send:\n${messages.join("\n")}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate smart reply" });
  }
};
