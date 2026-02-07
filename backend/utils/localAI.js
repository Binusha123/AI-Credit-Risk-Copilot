const {
  calculateRiskScore,
  getRiskLevel
} = require("./riskCalculator");

function localAIResponse(question, data) {

  const enriched = data.map(c => {

    const score = calculateRiskScore(c);

    return {
      ...c,
      riskScore: score,
      riskLevel: getRiskLevel(score)
    };

  });

  const lowRisk =
    enriched.filter(c => c.riskLevel === "LOW");

  const highRisk =
    enriched.filter(c => c.riskLevel === "HIGH");

  if (question.toLowerCase().includes("low risk")) {

    return {

      riskExplanation: [
        `${lowRisk.length} customers are low risk`,
        `Example IDs: ${
          lowRisk.slice(0,5)
          .map(c=>c.Customer_ID)
          .join(", ")
        }`
      ],

      keyFactors: [
        "Low missed payments",
        "Low credit utilization"
      ],

      recommendations: [
        "Offer premium services"
      ]

    };

  }

  if (question.toLowerCase().includes("high risk")) {

    return {

      riskExplanation: [
        `${highRisk.length} customers are high risk`
      ],

      keyFactors: [
        "Missed payments",
        "High utilization"
      ],

      recommendations: [
        "Monitor closely"
      ]

    };

  }

  return {

    riskExplanation: [
      "Risk analysis completed using local AI"
    ],

    keyFactors: [
      "Payment behavior",
      "Credit usage"
    ],

    recommendations: [
      "Monitor portfolio"
    ]

  };

}

module.exports = localAIResponse;
