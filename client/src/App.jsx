import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const[companyName, setCompanyName] = useState("");
  const[result, setResult] = useState(null);
  const[error, setError] = useState(null);
  const[loading, setLoading] = useState(false);

 async function handleSearch(e){
  e.preventDefault();
  if(!companyName.trim())return;

  setLoading(true);
  setError(null);
  setResult(null);

  try{
    const res = await fetch("http://127.0.0.1:5000/research", {
      method:"POST",
      headers:{ "content-type" : "application/json"},
      body: JSON.stringify({ companyName }),
     })
     if(!res.ok){
      throw new Error("Request Failed");
     }

     const data = await res.json();
     setResult(data);

  }catch(err) {
    setError("Something went wrong. please try again");
  }finally{
    setLoading(false);
  }
 }

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>AI Investment Research Agent</h1>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          placeholder="Enter a company name..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {loading ? "Researching..." : "Research"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>
            {result.companyName} ({result.ticker})
          </h2>
          {result.usedFallback && (
            <p style={{ color: "#b8860b", fontSize: 14 }}>
              ⚠️ Structured financial data unavailable — using web search fallback.
            </p>
          )}
          <h3>
            {result.decision.decision} — {result.decision.confidence} confidence — Risk: {result.decision.riskScore}/10
          </h3>
          <p><b>Reasoning:</b> {result.decision.reasoning}</p>
          <p><b>Key Risks:</b> {result.decision.keyRisks}</p>
        </div>
      )}
    </div>
  );
}

export default App;