const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    // Use the v1 version of the client if possible
    // Use global fetch (Node 18+)

    
    // Manual fetch to list models to see what's actually there
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.log("API Error:", data.error.message);
    } else {
      console.log("Available Models:");
      data.models.forEach(m => console.log(m.name));
    }
  } catch (error) {
    console.log("Error:", error.message);
    // fallback if fetch is missing
    console.log("Trying SDK listModels...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        // The SDK doesn't have a direct listModels in the top level 
        // usually, but we can try to find it.
    } catch(e) {}
  }
}

listModels();
