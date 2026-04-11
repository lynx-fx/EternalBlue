const https = require("https");
require("dotenv").config();

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API}`;

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.log("API Error:", parsed.error.message);
      } else {
        console.log("Available Models:");
        parsed.models.forEach(m => console.log(m.name));
      }
    } catch (e) {
      console.log("Parse Error:", e.message);
      console.log("Raw Data:", data);
    }
  });
}).on("error", (err) => {
  console.log("Request Error:", err.message);
});
