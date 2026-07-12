require("dotenv").config();
const { TavilySearch } = require ("@langchain/tavily");

async function searchCompanyNews(CompanyName){
    const searchTool = new TavilySearch({
        maxResults: 5,
        tavilyApiKey: process.env.TAVILY_API_KEY,
    });

    const results = await searchTool.invoke({
        query: `${CompanyName} recent news financial performance future plans 2026`,
    });

    return results;
}
async function searchFinancialDataFallback(companyName) {
  const searchTool = new TavilySearch({
    maxResults: 5,
    tavilyApiKey: process.env.TAVILY_API_KEY,
  });

  const results = await searchTool.invoke({
    query: `${companyName} revenue net income PE ratio market cap debt profit margin financial data 2026`,
  });

  return results;
}

module.exports = { searchCompanyNews, searchFinancialDataFallback };