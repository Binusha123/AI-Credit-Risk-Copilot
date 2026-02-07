const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);

    const response =
      result.response.text();

    return response;

  } catch (error) {

    console.log("Gemini quota exceeded. Using fallback.");

    return JSON.stringify({

      riskExplanation: [
        "Gemini API quota exceeded. Using local analysis."
      ],

      keyFactors: [
        "Missed payments",
        "Credit utilization",
        "Debt-to-income ratio"
      ],

      recommendations: [
        "Retry later when quota resets",
        "Upgrade Gemini API plan",
        "Use offline dataset analysis"
      ]

    });

  }

}

module.exports = callGemini;
