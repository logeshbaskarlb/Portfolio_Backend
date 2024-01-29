const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.DB;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register page
router.post("/register", async (req, res) => {
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
   
    } finally {
      // Close the connection in the finally block
      if (connection) {
        await connection.close();
      }
    }
  });
  


module.exports = router;