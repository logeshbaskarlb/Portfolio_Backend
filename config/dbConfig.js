const mongoose = require("mongoose");

mongoose.connect(process.env.DB);
    const connection = mongoose.connection;
    connection.on('error',()=>{
        console.log("Error connecting to database");
    })
    connection.on('connected',()=>{
        console.log('Connected to MongoDB');
    });
    module.exports = connection;