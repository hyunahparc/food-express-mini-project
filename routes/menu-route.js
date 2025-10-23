// 라우터 사용 (대문자 R)
const router = require("express").Router();
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
// MenuController 연결
const MenuController = require("../controllers/menu-controller");


// PUBLIC (모든 사용자 조회 가능)
router.get("/", MenuController.getAll);

// ADMIN만 메뉴 등록, 수정, 삭제 가능
router.post("/create", auth, adminOnly, MenuController.create);
router.put("/update/:id", auth, adminOnly, MenuController.update);
router.delete("/remove/:id", auth, adminOnly, MenuController.remove);



// 필수
module.exports = router;