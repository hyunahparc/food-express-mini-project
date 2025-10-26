// Import the Restaurant model
const Restaurant = require("../models/restaurant-model");


// CREATE (Admin only)
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

// READ
// GET ALL (Public) - Retrieve all restaurants
// Includes sorting by name or address
// Pagination - limit 10
const getAll = async (req, res) => {
    try {
        const { sortBy, page = 1, limit = 10 } = req.query; // Defaults to page 1, 10 items per page
        let sortField = "name"; // Default sorting: name
        if(sortBy === "address") sortField = "address";
 
        // Calculate pagination
        const skip = (page - 1) * limit;

        // Apply find(), then sort(), then pagination
        const restaurants = await Restaurant.find()
            .sort({ [ sortField]: 1 }) // 1 = ascending order
            .skip(skip) // Skip the first n items
            .limit(parseInt(limit)); // Convert string to number

        // Total count (for calculating total pages)
        const total = await Restaurant.countDocuments(); // Total number of restaurants
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            message: `Restaurant sorted by ${sortField}`,
            currentPage: parseInt(page),
            totalPages,
            totalRestaurants: total,   
            data: restaurants,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE (Admin only)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the restaurant
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const { name, address, phone, opening_hours } = req.body;
        // Apply updated fields
        if (name) restaurant.name = name;
        if (address) restaurant.address = address;
        if (phone) restaurant.phone = phone;
        if (opening_hours) restaurant.opening_hours = opening_hours;

        // Save to the database
        const savedRestaurant = await restaurant.save();
        res.status(200).json({ message: "Restaurant updated", restaurant: savedRestaurant });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE (Admin only)
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
        if(!deletedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found"});
        }
        
        res.status(200).json({ message: "Restaurant deleted successfully"});
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