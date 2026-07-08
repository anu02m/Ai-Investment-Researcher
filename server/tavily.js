require("dotenv").config();
const { TavilySearch } = require ("@langchain/tavily");

async function searchCompanyNews(CompanyName){
    const searchTool = new TavilySearch({
        maxResult: 5,
        tavilyApiKey: process.env.TAVILY_API_KEY,
    });

    const results = await searchTool.invoke({
        query: `${CompanyName} recent news financial performance future plans 2026`,
    });

    return results;
}

module.export = { searchCompanyNews };