const xlsx = require("xlsx");
const path = require("path");

function loadCreditData() {
  try {
    const filePath = path.join(
      __dirname,
      "../data/Delinquency_prediction_dataset.xlsx"
    );

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);
    return data;
  } catch (error) {
    console.error("Error loading Excel file:", error);
    return [];
  }
}

module.exports = loadCreditData;
