const express = require("express");
const cors = require("cors") ;
const app = express();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const URL = process.env.MONGO_URL;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const portfolioRoute = require("./routes/portfolioRoute");
const nodemailer = require("nodemailer");
const dbConfig = require("./config/dbConfig");
const CILENT_URL = process.env.CILENT_URL;
app.use(cors({
    origin:'*'
}))

app.use(express.json());

app.use("/api/portfolio",portfolioRoute)



app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const connection = await MongoClient.connect(URL);
      const db = connection.db("mern-portfolio-udemy");
      const user = await db.collection("Registered").findOne({
        email,
      });
      if (!user) {
        res.status(404).json({ message: "User or password not match!" });
      } 
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
          res.status(404).json({ message: "User or password not match!" });
        }
          const token = jsonwebtoken.sign({ userId: user._id }, secretKey, {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token,
          });
          connection.close();
     
     
    } catch (error) {
      console.log(error);
      return  res.status(500).json({ message: "Internal server error" });
    }
  });


app.post("/register", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
    try {       
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await MongoClient.connect(URL);
      const db = connection.db("mern-portfolio-udemy");
      const newUser ={
        name,
        email,
        password: hashedPassword,
      };

      const result = await db.collection("Registered").insertOne(newUser);
      const token = jsonwebtoken.sign(
        {
          userId:  result.insertedId,
        },
        secretKey,
        { expiresIn: "24h" }
      );
      res.status(201).json({
        message: "Registration success",
        token,
      });
      connection.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server error",
      });
    } 
  });


app.post("/forgot-password", async (req, res) => {
    
    try {
      const { email } = req.body;
      const connection = await MongoClient.connect(URL);
      const db = connection.db('mern-portfolio-udemy');
      const user = await db.collection('Registered').findOne({ email });
      if(!user){
       res.status(404).json({
        message: "User not register"
       });
      }
  
      const token = jsonwebtoken.sign({ id: user._id }, secretKey, { expiresIn: '24hr' });
  
      await db.collection('Registered').updateOne({ email }, {
          $set: { token }
      });
  
      connection.close();
  
      const transporter = nodemailer.createTransport({ 
          service: 'gmail',
          host:"smpt.gmail.com",
          auth: {
              user: process.env.MAIL_ID,
              pass: process.env.MAIL_PASSWORD,
          },
          port:587,
          secure:false
      });
      const info = await transporter.sendMail({
          from: process.env.MAIL_ID,
          to: email,
          subject: 'Reset password link',
          html: `Click the following link to reset your password: ${process.env.CILENT_URL}/reset-password/${token}`
      });
     console.log(info);
      res.status(200).json({ message: 'Password reset link sent successfully.' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send password reset email.' });
  }
  });



app.post("/reset-password/:token", async (req, res) => {
    try {
      const { password, confirmPassword } = req.body;
      const token = req.params.token;
      jsonwebtoken.verify(token, secretKey, async (err, decoded) => {
        try {
          if (err) {
            res.json({
              message: "Error with token",
            });
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const connection = await MongoClient.connect(URL);
            const db = connection.db("mern-portfolio-udemy");
            const user = await db
              .collection("Registered")
              .findOne({ token: token });
            await db.collection("Registered").updateOne(
              { token },
              {
                $set: {
                  password: hashedPassword,
                  confirmPassword: hashedPassword,
                },
              }
            );
            connection.close();
            res.status(200).send({ message: "Password changed succesfully", user });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

const SMTP = 8080
app.listen(SMTP,()=>{
    console.log('Server is running at http://localhost:8080/');
})