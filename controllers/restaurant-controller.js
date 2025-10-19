// Restaurant 모델 가져오기
const Restaurant = require("../models/restaurant-model");


// CREATE (Admin만)
const create = async (req, res) => {
    try {
        const { name, address, phone, opening_hours } = req.body;
        const restaurant = new Restaurant({ name, address, phone, opening_hours });
        const savedRestaurant = await restaurant.save();
        res.status(201).json({ message: "Restaurant created", restaurant: savedRestaurant });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



// READ (sorting도)




// UPDATE (Admin만)





// DELETE (Admin만)











module.exports = {
    create,
    
}