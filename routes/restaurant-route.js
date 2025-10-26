// Use the router (uppercase R)
const router = require("express").Router();
// Connnect RestaurantController
const RestaurantController = require("../controllers/restaurant-controller");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");


// PUBLIC
router.get("/", RestaurantController.getAll);

// ADMIN ONLY
router.post("/create", auth, adminOnly, RestaurantController.create);
router.put("/update/:id", auth, adminOnly, RestaurantController.update);
router.delete("/remove/:id", auth, adminOnly, RestaurantController.remove);



module.exports = router;