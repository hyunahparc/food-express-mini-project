// .env 파일 사용하기 위해 필요
require("dotenv").config();

// mongoose 불러오기
const mongoose = require("mongoose");

// DB 연결 설정
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