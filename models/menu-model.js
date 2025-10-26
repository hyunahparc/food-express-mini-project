const mongoose = require("mongoose");

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
  timestamps: true,
});


const Menu = mongoose.model("Menu", menuSchema);



module.exports = Menu;