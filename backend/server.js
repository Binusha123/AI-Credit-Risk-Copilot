const express = require("express");
const cors = require("cors");
require("dotenv").config();

const callGemini = require("./utils/geminiClient");
const hybridAI = require("./utils/hybridAI");

const loadCreditData = require("./utils/dataLoader");
const generateDataSummary = require("./utils/dataSummary");

const {
  calculateRiskScore,
  getRiskLevel
} = require("./utils/riskCalculator");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* --------------------------------
   HEALTH CHECK
-------------------------------- */

app.get("/", (req, res) => {
  res.send("AI Credit Risk Copilot Backend is running 🚀");
});

/* --------------------------------
   DASHBOARD DATA
-------------------------------- */

app.get("/dashboard-data", (req, res) => {

  try {

    const data = loadCreditData();

    const enriched = data.map(customer => {

      const score = calculateRiskScore(customer);

      return {

        ...customer,

        riskScore: score,

        riskLevel: getRiskLevel(score)

      };

    });

    res.json(enriched);

  } catch {

    res.status(500).json({
      error: "Dashboard data failed"
    });

  }

});

/* --------------------------------
   ANALYZE INDIVIDUAL CUSTOMER
-------------------------------- */

app.post("/analyze-customer", async (req, res) => {

  try {

    const customer = req.body.customer;

    if (!customer) {

      return res.status(400).json({
        error: "Customer data required"
      });

    }

    const prompt = `
You are an AI Credit Risk Analyst.

Analyze this customer:

Customer ID: ${customer.Customer_ID}
Risk Score: ${customer.riskScore}
Risk Level: ${customer.riskLevel}
Missed Payments: ${customer.Missed_Payments}
Utilization: ${customer.Credit_Utilization}

Return JSON:

{
  "riskExplanation": ["point"],
  "keyFactors": ["point"],
  "recommendations": ["point"]
}
`;

    const parsed = await hybridAI(
      "analyze customer",
      prompt,
      [customer]
    );

    res.json(parsed);

  } catch {

    res.status(500).json({
      error: "Customer analysis failed"
    });

  }

});

/* --------------------------------
   MAIN AI CHAT ENDPOINT
-------------------------------- */

app.post("/chat", async (req, res) => {

  try {

    const question = req.body.question;

    if (!question) {

      return res.status(400).json({
        error: "Question required"
      });

    }

    /* LOAD DATA */

    const data = loadCreditData();

    const summary = generateDataSummary(data);

    /* ADD RISK SCORES */

    const enrichedData = data.map(c => {

      const score = calculateRiskScore(c);

      return {

        ...c,

        riskScore: score,

        riskLevel: getRiskLevel(score)

      };

    });

    /* FIND LOW & HIGH RISK */

    const lowRisk =
      enrichedData.filter(c => c.riskLevel === "LOW");

    const highRisk =
      enrichedData.filter(c => c.riskLevel === "HIGH");

    /* BUILD PROMPT */

    const prompt = `
You are an AI Credit Risk Analyst.

Dataset Summary:
${summary}

Low Risk Customers: ${lowRisk.length}

Sample Low Risk Customers:
${JSON.stringify(lowRisk.slice(0,5), null, 2)}

High Risk Customers: ${highRisk.length}

Sample High Risk Customers:
${JSON.stringify(highRisk.slice(0,5), null, 2)}

User Question:
${question}

Return JSON format:

{
  "riskExplanation": ["point"],
  "keyFactors": ["point"],
  "recommendations": ["point"]
}
`;

    /* HYBRID AI CALL */

    const aiResult = await hybridAI(
      question,
      prompt,
      enrichedData
    );

    /* FORMAT RESPONSE FOR FRONTEND */

    const formatted = {

      explanation:
        aiResult.riskExplanation || [],

      factors:
        aiResult.keyFactors || [],

      recommendations:
        aiResult.recommendations || []

    };

    res.json(formatted);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI analysis failed"
    });

  }

});

/* --------------------------------
   SERVER START
-------------------------------- */

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);

  console.log(
    "Hybrid AI Mode Active (Gemini + Local fallback)"
  );

});
