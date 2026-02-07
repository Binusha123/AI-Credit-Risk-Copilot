function calculateRiskScore(customer) {

  let score = 0;

  const utilization = parseFloat(customer.Credit_Utilization) || 0;
  const missed = parseInt(customer.Missed_Payments) || 0;
  const dti = parseFloat(customer.DTI) || 0;

  /* UTILIZATION SCORE (0–40) */
  score += utilization * 40;

  /* MISSED PAYMENTS SCORE (0–40) */
  score += Math.min(missed * 10, 40);

  /* DTI SCORE (0–20) */
  score += dti * 20;

  return Math.round(score);
}

function getRiskLevel(score) {

  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";

}

module.exports = {
  calculateRiskScore,
  getRiskLevel
};
