const mongoose = require("mongoose");

// 스키마 만들기
const menuSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    name: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    price: {
        type: Number, 
        required: true,
    },
    category: {
        type: String, 
        enum: ["main", "side", "drink", "dessert", "etc"],
        required: true,
    }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

// Menu라는 테이블과 연결
const Menu = mongoose.model("Menu", menuSchema);



module.exports = Menu;