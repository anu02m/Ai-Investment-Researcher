require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { identifyCompany } = require("./agent");
const { getFinancialData } = require("./fmp")
const { searchCompanyNews } = require("./tavily");
const { makeDecision } = require("./decision")


const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("Server is running");
});

app.get("/test", (req,res) => {
    res.json({message: "Hello from the backend"});
})

app.post("/research", async(req,res) => {
    try{
        const{ companyName } = req.body;

        if((!companyName || companyName.trim() == "")){
            return res.status(400).json({error: "Company Name is Required"});
        }

        const identified = await identifyCompany(companyName);
        
        const [financialData, newsResults] = await Promise.all([
            getFinancialData(identified.ticker),
            searchCompanyNews(identified.companyName),
        ]);

        const decision = await makeDecision(identified.companyName, financialData, newsResults);

        res.json({
            companyName: identified.companyName,
            ticker: identified.ticker,
            financialData,
            decision,
        });

    }catch(err){
        console.error("Error in /research:",err.message);
        res.status(500).json({error: "Something went wrong"});
    }
});

app.listen(process.env.PORT,() => {
    console.log(`Server running at port ${process.env.PORT}`);
});