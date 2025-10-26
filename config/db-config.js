// Required to use the .env file
require("dotenv").config();

// Import mongoose
const mongoose = require("mongoose");

// Database connection configuration
const DB_URL = process.env.DB_URL + "/food_express";
mongoose.connect(DB_URL);
const db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to DB");
});
db.once("error", (err) => {
    console.log("DB connection error: ", err);
});



module.exports = db;