const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.MONGO_URL;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register page
router.post('/register', async (req,res)=>{
    try {
        const { name , email , password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const connection = await MongoClient.connect(URL);
        const db = connection.db("Users");
        const newUser = {
            name,
            email,
            password : hashedPassword ,
        };
        const result = await db.collection("Data").insertOne(newUser);
        const token = jsonwebtoken.sign(
            {
                userId : result.insertedId,
            },
            {
                expiresIn: "24h"
            }
        )
        res.status(201).json({
            message : "Registration success",
            newUser,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Server error"
        })
    }
    });


    module.exports = router;