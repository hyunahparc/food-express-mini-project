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
// GETALL (Public) - 모든 레스토랑 가져오기
// sorting (정렬) 포함 - name, address
const getAll = async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortField = "name";
        if(sortBy === "address") sortField = "address";

        // find() 후 sort() 적용
        const restaurants = await Restaurant.find().sort({ [ sortField]: 1 }); // 1 = 오름차순
        res.status(200).json({
            message: `Restaurant sorted by ${sortField}`,    
            data: restaurants,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



// UPDATE (Admin만)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // 레스토랑 조회
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const { name, address, phone, opening_hours } = req.body;
        // 변경할 필드 적용
        if (name) restaurant.name = name;
        if (address) restaurant.address = address;
        if (phone) restaurant.phone = phone;
        if (opening_hours) restaurant.opening_hours = opening_hours;

        // DB 저장
        const savedRestaurant = await restaurant.save();
        res.status(200).json({ message: "Restaurant updated", restaurant: savedRestaurant });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};




// DELETE (Admin만)
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
        if(!deletedRestaurant) {
            return res.status(404).json({ message: "Reataurant not found"});
        }
        
        res.status(200).json({ message: "Reataurant deleted successfully"});
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    create,
    getAll,
    remove,
    update,
}