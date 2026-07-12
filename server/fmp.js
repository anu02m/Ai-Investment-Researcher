require("dotenv").config();

const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = "https://financialmodelingprep.com/stable";

async function fetchFMP(endpoint, ticker) {
  const url = `${BASE_URL}/${endpoint}?symbol=${ticker}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(`Failed to parse ${endpoint}. Length: ${text.length}`);
    console.error(`Start: ${text.slice(0, 100)}`);
    console.error(`End: ${text.slice(-100)}`);
    throw new Error(`Invalid response from FMP endpoint: ${endpoint}`);
  }
}

async function getFinancialData(ticker) {
    const income = await fetchFMP("income-statement", ticker);
    const balance = await fetchFMP("balance-sheet-statement", ticker);
    const cashFlow = await fetchFMP("cash-flow-statement", ticker);
    const profile = await fetchFMP("profile", ticker);
    const ratios = await fetchFMP("ratios", ticker);
    const priceHistory = await fetchFMP("historical-price-eod/full", ticker);

    const oneYearPriceHistory = priceHistory.slice(0, 252);

    return {
    income: income[0],
    balance: balance[0],
    cashFlow: cashFlow[0],
    profile: profile[0],
    ratios: ratios[0],
    priceHistory: oneYearPriceHistory,
    };
}

module.exports = { getFinancialData };