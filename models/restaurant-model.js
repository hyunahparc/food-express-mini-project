const mongoose = require("mongoose");

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
  timestamps: true, // Automatically generate createdAt and updatedAt timestamps
});


const Restaurant = mongoose.model("Restaurant", restaurantSchema);



module.exports = Restaurant;