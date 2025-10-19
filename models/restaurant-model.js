const mongoose = require("mongoose");

// 스키마 만들기
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    address: {
        type: String, 
        required: true,
    },
    phone: {
        type: String, 
        required: true,
    },
    opening_hours: {
        type: String, 
        required: true,
    }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

// Restaurant이라는 테이블과 연결
const Restaurant = mongoose.model("Restaurant", restaurantSchema);



module.exports = Restaurant;