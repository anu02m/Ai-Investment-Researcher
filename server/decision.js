require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function makeDecision(companyName, financialData, newsResults, fallbackData) {
  const newsSnippets = newsResults.results
    .map((r) => `- ${r.title}: ${r.content}`)
    .join("\n");

  let financialSection;

  if (financialData) {
    financialSection = `
FINANCIAL DATA (from public filings):
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
`;
  } else {
    const fallbackSnippets = fallbackData.results
      .map((r) => `- ${r.title}: ${r.content}`)
      .join("\n");
    financialSection = `
NOTE: This company does not have public stock market data available (it may be private, or listed on an exchange we don't have access to). Use the web search results below to still assess the business itself — its revenue/funding if mentioned, growth, market position, and reputation. Evaluate it as you would for a private investment or partnership, not just a stock purchase.

WEB SEARCH RESULTS ABOUT THE COMPANY:
${fallbackSnippets}
`;
  }

  const prompt = `
You are an investment analyst. Analyze ${companyName} using the real data below and decide: INVEST or PASS.

${financialSection}

RECENT NEWS:
${newsSnippets}

Give a real, substantive analysis based on what's actually in the data above. Do not give a generic answer like "not enough data" or "can't invest since it's not listed" — instead, discuss what the available information actually says about the business: is it growing, well-regarded, financially sound, risky, controversial, etc. If public market data is missing, evaluate it as a potential private investment or business opportunity instead, using whatever real details the news/web search provided. Only say the data is insufficient if the web search results are genuinely empty or irrelevant — otherwise, use what's there.

Respond ONLY in this exact JSON format, no other text, no markdown:
{
  "decision": "INVEST" or "PASS",
  "confidence": "High" or "Medium" or "Low",
  "riskScore": a number from 0 to 10 (0 = very safe, 10 = very risky),
  "reasoning": "3-4 sentence explanation referencing specific facts from the data above",
  "keyRisks": "1-2 sentence summary of real, specific risks based on the data"
}
`;

  const response = await model.invoke(prompt);

  let cleanedContent = response.content.trim();
  cleanedContent = cleanedContent.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleanedContent);
  } catch (err) {
    console.error("Failed to parse decision JSON:", cleanedContent);
    throw new Error("Invalid decision response from model");
  }
}

module.exports = { makeDecision };