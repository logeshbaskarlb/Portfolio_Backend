const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.DB;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");


router.post("/login", async (req, res) => {
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


module.exports = router;