const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.DB;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// forget password
router.post("/forgot-password", async (req, res) => {
    
    try {
      const { email } = req.body;
      const connection = await MongoClient.connect(URL);
      const db = connection.db('users');
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


    module.exports = router;