const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testFlash() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are an expert travel planner."
    });

    console.log("Starting Flash test...");
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("Success (Flash):", response.text());
  } catch (error) {
    console.error("Flash Error:", error.message);
  }
}

testFlash();
