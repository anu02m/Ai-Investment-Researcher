require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
});

async function makeDecision(companyName, financialData, newsResult){
    const newsSnippets = newsResult.results
    .map((r) => `- ${r.title}: ${r.content}`)
    .join("\n");

    const prompt = `You are an investment analyst. Analyze ${companyName} using the real data below and decide: INVEST or PASS.

FINANCIAL DATA:
- Revenue: $${financialData.income.revenue}
- Net Income: $${financialData.income.netIncome}
- EPS: ${financialData.income.eps}
- Market Cap: $${financialData.profile.marketCap}
- PE Ratio: ${financialData.ratios.priceToEarningsRatio}
- Profit Margin: ${financialData.ratios.netProfitMargin}
- Debt to Assets Ratio: ${financialData.ratios.debtToAssetsRatio}
- Total Debt: $${financialData.balance.totalDebt}
- Free Cash Flow: $${financialData.cashFlow.freeCashFlow}
- Current Stock Price: $${financialData.profile.price}

RECENT NEWS:
${newsSnippets}

Based on this real data, decide whether to INVEST or PASS. Weigh profitability, valuation (is PE ratio reasonable?), debt levels, cash flow health, and recent news sentiment together.

Respond ONLY in this exact JSON format, no other text, no markdown:
{
  "decision": "INVEST" or "PASS",
  "confidence": "High" or "Medium" or "Low",
  "riskScore": a number from 0 to 10 (0 = very safe, 10 = very risky),
  "reasoning": "3-4 sentence explanation referencing specific numbers above",
  "keyRisks": "1-2 sentence summary of the main risks"
}
`;

const response = await model.invoke(prompt);
return JSON.parse(response.content);
}

const { getFinancialData } = require("./fmp");
const { searchCompanyNews } = require("./tavily");

module.exports = { makeDecision };