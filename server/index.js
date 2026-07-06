require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("Server is running");
});

app.listen(process.env.PORT,() => {
    console.log(`Server running at port ${process.env.PORT}`);
});