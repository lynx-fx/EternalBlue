const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testChat() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-pro-preview",
      systemInstruction: "You are an expert travel planner."
    });

    console.log("Starting chat test...");
    const chat = model.startChat({
        history: [],
    });

    const result = await chat.sendMessage("Hi, tell me about Tokyo.");
    const response = await result.response;
    console.log("Success:", response.text());
  } catch (error) {
    console.error("Gemini Error:", error.message);
    if (error.response) {
        console.error("Error Status:", error.response.status);
    }
    // Try without system instruction
    console.log("Trying without systemInstruction...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log("Success (No System):", response.text());
    } catch (e) {
        console.error("Gemini Error (No System):", e.message);
    }
  }
}

testChat();
