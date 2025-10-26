// Import the Menu model
const Menu = require("../models/menu-model");


// CREATE (Admin only)
const create = async (req, res) => {
    try {
        const { restaurant_id, name, description, price, category } = req.body;
        const menu = new Menu({ restaurant_id, name, description, price, category });
        const savedMenu = await menu.save();
        res.status(201).json({ message: "Menu created", menu: savedMenu });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// READ
// GET ALL (Public) - Retrieve all restaurants
// Includes sorting by category or price
// Pagination - limit 10
const getAll = async (req, res) => {
    try {
        const { sortBy, page = 1, limit = 10 } = req.query;
        let sortField = "category"; // Default sorting: category
        if(sortBy === "price") sortField = "price";      
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        const menus = await Menu.find()
            .sort({ [ sortField]: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Menu.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            message: `Menu sorted by ${sortField}`,
            currentPage: parseInt(page),
            totalPages,
            totalMenus: total,   
            data: menus,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE (Admin only)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the menu
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }
        const { restaurant_id, name, description, price, category } = req.body;
        // Apply updated fields
        if (restaurant_id) menu.restaurant_id = restaurant_id;
        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = price;
        if (category) menu.category = category;

        // Save to the database
        const savedMenu = await menu.save();
        res.status(200).json({ message: "Menu updated", menu: savedMenu });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE (Admin only)
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMenu = await Menu.findByIdAndDelete(id);
        if(!deletedMenu) {
            return res.status(404).json({ message: "Menu not found"});
        }
        res.status(200).json({ message: "Menu deleted successfully"});
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    create,
    getAll,
    update,
    remove,
}