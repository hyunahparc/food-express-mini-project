// 라우터 사용 (대문자 R)
const router = require("express").Router();
// UserController 연결
const UserController = require("../controllers/user-controller");

router.post("/register", UserController.register);
router.post("/login", UserController.login);









module.exports = router;