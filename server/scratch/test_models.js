const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    // There isn't a direct listModels on the genAI object in some versions, 
    // but we can try to fetch it via the base client or just test common names.
    console.log("Testing API Key:", process.env.GEMINI_API ? "Exists" : "Missing");
    
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-2.0-flash-exp"
    ];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("ping");
        console.log(`✅ Model ${modelName} is AVAILABLE`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ Model ${modelName} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Setup Error:", error);
  }
}

listModels();
