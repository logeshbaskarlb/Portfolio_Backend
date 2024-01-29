const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.DB;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");


router.post("/reset-password/:token", async (req, res) => {
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
          const db = connection.db("users");
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
          res.send({ message: "Password changed succesfully", user: user });
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
