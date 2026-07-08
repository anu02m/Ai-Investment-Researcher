require("dotenv").config();

const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = "https://financialmodelingprep.com/stable";

async function fetchFMP(endpoint, ticker){
    const url = `${BASE_URL}/${endpoint}?symbol=${ticker}&apikey=${API_KEY}`;
    const response = await fetch(url);
    return response.json();
}

async function getFinancialData(ticker){
    const [income, balance, cashFlow, profile, ratios, priceHistory] = await Promise.all([
        fetchFMP("income-statement", ticker),
        fetchFMP("balance-sheet-statement", ticker ),
        fetchFMP("cash-flow-statement", ticker),
        fetchFMP("profile", ticker),
        fetchFMP("ratios", ticker),
        fetchFMP("historical-price-eod/full", ticker),
    ]);

    const oneYearPriceHistory = priceHistory.slice(0,252);

    return{
        income: income[0],
        balance: balance[0],
        cashFlow: cashFlow[0],
        profile: profile[0],
        ratios: ratios[0],
        priceHistory: oneYearPriceHistory,
    };
}

module.exports = { getFinancialData };