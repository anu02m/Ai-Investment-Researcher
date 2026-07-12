require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function identifyCompany(userInput) {
  const prompt = `The user typed this company name, possibly with typos or shorthand: "${userInput}"

Identify this company and provide the following. Use your general knowledge for founder/origin/sector — these should be real, accurate facts you're confident about, not guesses. If something genuinely isn't knowable (e.g. ticker for a private company), say so clearly in that field rather than inventing a value.

Respond ONLY in this exact JSON format, no other text, no markdown:
{
  "companyName": "Full Correct Company Name",
  "ticker": "TICKER or 'Not publicly traded' if private",
  "origin": "Country where the company was founded/is headquartered",
  "founderName": "Name(s) of the founder(s)",
  "sector": "Industry/sector the company operates in",
  "isPubliclyTraded": true or false
}`;

  const response = await model.invoke(prompt);

  let cleanedContent = response.content.trim();
  cleanedContent = cleanedContent.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleanedContent);
  } catch (err) {
    console.error("Failed to parse identifyCompany JSON:", cleanedContent);
    throw new Error("Invalid company identification response from model");
  }
}

module.exports = { identifyCompany };