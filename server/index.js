require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { identifyCompany } = require("./agent");
const { getFinancialData } = require("./fmp");
const { searchCompanyNews, searchFinancialDataFallback } = require("./tavily");
const { makeDecision } = require("./decision");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/research", async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName || companyName.trim() === "") {
      return res.status(400).json({ error: "Company name is required" });
    }

    const identified = await identifyCompany(companyName);

    let financialData = null;
    let fallbackData = null;
    let usedFallback = false;

    try {
      financialData = await getFinancialData(identified.ticker);
    } catch (err) {
      console.error("FMP failed, using Tavily fallback:", err.message);
      usedFallback = true;
    }

    const newsResults = await searchCompanyNews(identified.companyName);

    if (usedFallback) {
      fallbackData = await searchFinancialDataFallback(identified.companyName);
    }

    const decision = await makeDecision(
      identified.companyName,
      financialData,
      newsResults,
      fallbackData
    );

    res.json({
  companyName: identified.companyName,
  ticker: identified.ticker,
  origin: identified.origin,
  founderName: identified.founderName,
  sector: identified.sector,
  isPubliclyTraded: identified.isPubliclyTraded,
  marketValue: financialData?.profile?.marketCap
    ? `$${(financialData.profile.marketCap / 1e9).toFixed(1)}B`
    : "Not publicly disclosed (private company or data unavailable)",
  financialData,
  newsHeadlines: newsResults.results,
  usedFallback,
  decision,
});
  } catch (err) {
    console.error("Error in /research:", err.message);
    res.status(500).json({ error: "Something went wrong while researching" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});