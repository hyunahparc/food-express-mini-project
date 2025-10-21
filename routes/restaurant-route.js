// 라우터 사용 (대문자 R)
const router = require("express").Router();
// RestaurantController 연결
const RestaurantController = require("../controllers/restaurant-controller");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");


// PUBLIC (모든 사용자 조회 가능)
router.get("/", RestaurantController.getAll);

// ADMIN만 레스토랑 등록, 수정, 삭제 가능
router.post("/create", auth, adminOnly, RestaurantController.create);
router.put("/update/:id", auth, adminOnly, RestaurantController.update);
router.delete("/remove/:id", auth, adminOnly, RestaurantController.remove);






// 필수
module.exports = router;