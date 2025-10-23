// Menu 모델 가져오기
const Menu = require("../models/menu-model");


// CREATE (Admin만)
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
// GETALL (Public) - 모든 메뉴 가져오기
// sorting (정렬) 포함 - price, category 기준
// pagination - limit 10
const getAll = async (req, res) => {
    try {
        const { sortBy, page = 1, limit = 10 } = req.query; // 디폴트로 1페이지, 10개씩 보여짐
        let sortField = "category"; // 디폴트 정렬 : category
        if(sortBy === "price") sortField = "price";      
        
        // 페이지네이션 계산
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

// UPDATE (Admin만)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // 메뉴 조회
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }
        const { restaurant_id, name, description, price, category } = req.body;
        // 변경할 필드 적용
        if (restaurant_id) menu.restaurant_id = restaurant_id;
        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = price;
        if (category) menu.category = category;

        // DB 저장
        const savedMenu = await menu.save();
        res.status(200).json({ message: "Menu updated", menu: savedMenu });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE (Admin만)
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