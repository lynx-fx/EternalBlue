const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are an expert travel planner and itinerary assistant. Help users plan trips, offer destination advice, give practical travel tips, and create structured, detailed itineraries. Be friendly, organized, and focus on travel-related topics."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, message: "Failed to communicate with AI" });
  }
};

exports.smartReply = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages history as array is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
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
