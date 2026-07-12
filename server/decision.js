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
`;
  } else {
  const fallbackSnippets = fallbackData.results
    .map((r) => `- ${r.title}: ${r.content}`)
    .join("\n");
  financialSection = `
STRUCTURED FINANCIAL DATA WAS NOT AVAILABLE for this company. This usually means one of:
(a) the company is not publicly traded / listed on a stock exchange,
(b) it trades on an exchange not covered by our data provider (e.g. non-US exchanges),
(c) the company name/ticker could not be matched correctly.

Below is what web search found instead — use it to determine WHICH of the above reasons applies, and say so explicitly and clearly in your reasoning. Do not give a vague "data was incomplete" answer — state the specific reason if you can determine it from the search results.

WEB SEARCH RESULTS:
${fallbackSnippets}
`;
}
  const prompt = `
You are an investment analyst. Analyze ${companyName} using the real data below and decide: INVEST or PASS.

${financialSection}

RECENT NEWS:
${newsSnippets}

Based on this real data, decide whether to INVEST or PASS. Weigh profitability, valuation, debt levels, cash flow health, and recent news sentiment together.
If the company does not appear to be publicly traded (e.g. it's a private company, a startup, an ed-tech platform, a community/media brand, etc.), your decision should be "PASS", your confidence should be "High" (since the reason is clear-cut, not uncertain), and your reasoning MUST state plainly that this company is not publicly investable and explain why, rather than discussing financial metrics that don't apply.
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

module.exports = { makeDecision };