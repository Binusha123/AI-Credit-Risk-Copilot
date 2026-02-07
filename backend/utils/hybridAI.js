const callGemini = require("./geminiClient");
const localAIResponse = require("./localAI");

async function hybridAI(question, prompt, data) {

  try {

    /* TRY GEMINI FIRST */

    const aiResponse = await callGemini(prompt);

    /* CLEAN RESPONSE */

    let cleaned = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log("Using Gemini AI");

    return parsed;

  } catch (error) {

    console.log("Gemini failed, using Local AI");

    /* FALLBACK TO LOCAL AI */

    return localAIResponse(question, data);

  }

}

module.exports = hybridAI;
