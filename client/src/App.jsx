import { useState } from "react";
import "./App.css";

const SUGGESTIONS = ["Apple", "Tesla", "Microsoft"];
const CONFIDENCE_PCT = { High: 90, Medium: 60, Low: 30 };
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function runSearch(name) {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("`${API_URL}/research`", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyName: name }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [data, ...prev.filter((h) => h.ticker !== data.ticker)]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(companyName);
  }

  function handleNewSearch() {
    setResult(null);
    setCompanyName("");
    setError(null);
  }

  if (!result) {
    return (
      <div className="landing-wrap">
        <div className="landing">
          <div className="logo">📈 InvestAI</div>
          <h1>What company do you want to research?</h1>
          <form onSubmit={handleSubmit} className="landing-search">
            <input
              className="search"
              placeholder="Enter a company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <button type="submit">{loading ? "Researching..." : "Research"}</button>
          </form>
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <div key={s} className="chip" onClick={() => { setCompanyName(s); runSearch(s); }}>
                {s}
              </div>
            ))}
          </div>
          {loading && <p className="small" style={{ marginTop: 20 }}>This can take up to 15 seconds...</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  const confPct = CONFIDENCE_PCT[result.decision.confidence] ?? 50;
  const isInvest = result.decision.decision === "INVEST";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">📈 InvestAI</div>
        <div className="new" onClick={handleNewSearch}>+ New Analysis</div>
        <div className="hist">
          {history.map((h) => (
            <div key={h.ticker} onClick={() => setResult(h)}>
              {h.companyName} {h.ticker === result.ticker && "← Current"}
            </div>
          ))}
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <h1>{result.companyName} ({result.ticker})</h1>
          <div className="search" onClick={handleNewSearch} style={{ cursor: "pointer" }}>
            New Search
          </div>
        </div>

        <div className="card" style={{ marginBottom: 22 }}>
          <div className="title">Company Info</div>
          <div className="info-grid">
            <div>
              <h4>Sector</h4>
              <p>{result.sector}</p>
            </div>
            <div>
              <h4>Origin</h4>
              <p>{result.origin}</p>
            </div>
            <div>
              <h4>Founder</h4>
              <p>{result.founderName}</p>
            </div>
            <div>
              <h4>Market Value</h4>
              <p>{result.marketValue}</p>
            </div>
          </div>
          {result.usedFallback && (
            <p className="small" style={{ color: "var(--accent)", marginTop: 12 }}>
              Note: not listed on a major public exchange we track — analysis below is based on web research instead of stock market filings.
            </p>
          )}
        </div>

        <div className="grid">
          <div className="card">
            <div className="title">Agent Execution</div>
            <div className="steps">
              <div className="row">
                <div className="dot"></div>
                <div><b>Company identified</b><div className="small">{result.companyName} ({result.ticker})</div></div>
              </div>
              <div className="row">
                <div className="dot"></div>
                <div>
                  <b>{result.usedFallback ? "Financial data via web search fallback" : "Financial statements analyzed"}</b>
                  <div className="small">{result.usedFallback ? "Structured data unavailable" : "Income, Balance Sheet, Cash Flow"}</div>
                </div>
              </div>
              <div className="row">
                <div className="dot"></div>
                <div><b>News sentiment processed</b><div className="small">Latest headlines summarized</div></div>
              </div>
              <div className="row">
                <div className="dot"></div>
                <div><b>Risk factors evaluated</b><div className="small">Debt, valuation, margins</div></div>
              </div>
              <div className="row">
                <div className="dot"></div>
                <div><b>Investment recommendation generated</b><div className="small">Reasoning complete</div></div>
              </div>
            </div>
          </div>

          <div className="card verdict">
            <div className="title">Final Decision</div>
            <div className="buy" style={{ color: isInvest ? "#22c55e" : "#f87171" }}>
              {result.decision.decision}
            </div>
            <div className="conf">Confidence <b>{confPct}%</b></div>
            <div className="bar"><span style={{ width: `${confPct}%`, background: isInvest ? "#22c55e" : "#f87171" }}></span></div>
            <div>Risk Score: <b>{result.decision.riskScore}/10</b></div>
          </div>
        </div>

        {result.financialData && (
          <div className="card" style={{ marginTop: 22 }}>
            <div className="title">Key Financial Snapshot</div>
            <div className="metrics">
              <div className="metric"><h4>Revenue</h4><b>${(result.financialData.income.revenue / 1e9).toFixed(1)}B</b></div>
              <div className="metric"><h4>Net Income</h4><b>${(result.financialData.income.netIncome / 1e9).toFixed(1)}B</b></div>
              <div className="metric"><h4>Free Cash Flow</h4><b>${(result.financialData.cashFlow.freeCashFlow / 1e9).toFixed(1)}B</b></div>
              <div className="metric"><h4>Profit Margin</h4><b>{(result.financialData.ratios.netProfitMargin * 100).toFixed(1)}%</b></div>
              <div className="metric"><h4>P/E</h4><b>{result.financialData.ratios.priceToEarningsRatio?.toFixed(0)}</b></div>
              <div className="metric"><h4>Debt/Assets</h4><b>{result.financialData.ratios.debtToAssetsRatio?.toFixed(2)}</b></div>
            </div>
          </div>
        )}

        <div className="twocol">
          <div className="card">
            <div className="title">Why the Agent Recommends {result.decision.decision}</div>
            <p className="reason">{result.decision.reasoning}</p>
          </div>
          <div className="card">
            <div className="title">Price Performance</div>
            {result.financialData?.priceHistory ? (
              <PriceChart priceHistory={result.financialData.priceHistory} />
            ) : (
              <div className="chart">📈 Chart not available</div>
            )}
          </div>
        </div>

        <div className="twocol">
          <div className="card">
            <div className="title">Key Risks</div>
            <p className="reason">{result.decision.keyRisks}</p>
          </div>
          <div className="card">
            <div className="title">Latest News</div>
            <div className="news">
              {result.newsHeadlines?.slice(0, 4).map((n, i) => (
                <article key={i}>
                  <h4>{n.title}</h4>
                  <p className="small">{n.content}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PriceChart({ priceHistory }) {
  const prices = [...priceHistory].reverse().map((d) => d.price ?? d.close);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * 400;
      const y = 220 - ((p - min) / (max - min || 1)) * 220;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="chart" style={{ border: "none", padding: 0 }}>
      <svg viewBox="0 0 400 220" style={{ width: "100%", height: "100%" }}>
        <polyline points={points} fill="none" stroke="#f0a500" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default App;