function generateDataSummary(data) {
  if (!data || data.length === 0) {
    return "Dataset is empty.";
  }

  let totalIncome = 0;
  let totalDTI = 0;
  let totalUtilization = 0;
  let totalMissed = 0;
  let highRiskCount = 0;

  data.forEach((row) => {
    const income = parseFloat(row.Income) || 0;
    const dti = parseFloat(row.DTI) || 0;
    const utilization = parseFloat(row.Credit_Utilization) || 0;
    const missed = parseInt(row.Missed_Payments) || 0;

    totalIncome += income;
    totalDTI += dti;
    totalUtilization += utilization;
    totalMissed += missed;

    if (utilization > 0.8 || missed >= 2 || dti > 0.6) {
      highRiskCount++;
    }
  });

  const count = data.length;

  return `
Dataset contains ${count} customers.

Average Income: ${(totalIncome / count).toFixed(2)}
Average Debt-to-Income Ratio: ${(totalDTI / count).toFixed(2)}
Average Credit Utilization: ${(totalUtilization / count).toFixed(2)}
Total Missed Payments: ${totalMissed}

High Risk Customers: ${highRiskCount}

High risk defined as:
- Credit utilization > 80%
- OR Missed payments ≥ 2
- OR DTI > 60%
`;
}

module.exports = generateDataSummary;
