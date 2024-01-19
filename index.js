const express = require("express");
const cors = require("cors") ;
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig")
const portfolioRoute = require("./routes/portfolioRoute");
const login = require("./routes/Login");
const register = require("./routes/Register");
const forgetPassword = require("./routes/ForgetPassword");
const resetPassword = require("./routes/ResetPassword");
 
app.use(cors({
    origin:'http://localhost:3000'
}))

app.use(express.json());

app.use("/api/portfolio",portfolioRoute)

app.use("/",login)

app.use("/register",register);

app.use("/forget-Password",forgetPassword);

app.use("reset-Password/:token",resetPassword);

const SMTP = 8080
app.listen(SMTP,()=>{
    console.log('Server is running at http://localhost:8080/');
})