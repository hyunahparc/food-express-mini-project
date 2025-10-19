// 라우터 사용 (대문자 R)
const router = require("express").Router();
// UserController 연결
const UserController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
// auth 미들웨어 추가 - 로그인해야 접근 가능
router.put("/update", auth, UserController.update);
router.delete("/remove", auth, UserController.remove);






// 필수
module.exports = router;