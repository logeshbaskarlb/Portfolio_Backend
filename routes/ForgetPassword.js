const router = require("express").Router();
const bcrypt = require("bcryptjs");
const URL = process.env.MONGO_URL;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// forget password
router.post("/forget-password",async (req,res)=>{
    try {
        const { email } = req.body;
        const connection = await MongoClient.connect(URL);
        const db = connection.db('Users');
        const user = await db.collection('Data').findOne({email});
    
        if(!user){
            res.status(404).json({
                message : "User not registered"
            })
        }
        const token = jsonwebtoken.sign({
            id : user._id,
        },{
            expiresIn:"10m"  //expire in 10 min
        })
    
        connection.close();
    
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            host : 'smpt.gmail.com',
            auth :{
                user : process.env.MAIL_ID,
                pass : process.env.MAIL_PASSWORD,
            },
            port : 587,
            secure : false
        })
    
        const info = await transporter.sendMail({
            from : process.env.MAIL_ID,
            to : email,
            subject : 'Reset password link',
            html : `Click the following link to rest your password : 
                    ${process.env.CLIENT_URL}/reset-password/${token}`
        })
        console.log(info);
        res.status(200).json({
            message : "Password reset link sent successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : "Failed to send password rest email"
        })
    }
    })


    module.exports = router;