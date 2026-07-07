require("dotenv").config(); 
const { ChatGroq } = require("@langchain/groq");

const model = new ChatGroq({
    model:"llama-3.3-70b-versatile",
    temprature: 0,
});

async function identifyCompany(userInput) {
    const prompt = `The user typed this company name, possibly with typos or shorthand: "${userInput}"
Identify the correct, full company name and its stock ticker symbol (as listed on a major exchange like NASDAQ, NYSE, or BSE/NSE if Indian).
Respond ONLY in this exact JSON format, no other text, no markdown:
{
    "companyName": "Full Correct Company Name"
    "ticker": "TICKER"
}
`;

const response = await model.invoke(prompt);
return JSON.parse(response.content);
}

module.exports = { identifyCompany };