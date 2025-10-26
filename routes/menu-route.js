// Use the router (uppercase R)
const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
// Connnect MenuController
const MenuController = require("../controllers/menu-controller");


// PUBLIC
router.get("/", MenuController.getAll);

// ADMIN ONLY
router.post("/create", auth, adminOnly, MenuController.create);
router.put("/update/:id", auth, adminOnly, MenuController.update);
router.delete("/remove/:id", auth, adminOnly, MenuController.remove);



module.exports = router;