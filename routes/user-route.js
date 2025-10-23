// 라우터 사용 (대문자 R)
const router = require("express").Router();
// UserController 연결
const UserController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
// Joi
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema, updateSchema } = require("../validations/userValidation");


router.post("/register", validate(registerSchema), UserController.register);
router.post("/login", validate(loginSchema), UserController.login);
// auth 미들웨어 추가 - 로그인해야 접근 가능
router.put("/update", auth, validate(updateSchema), UserController.update);
router.delete("/remove", auth, UserController.remove);
router.get("/", auth, adminOnly, UserController.getAll);



// 필수
module.exports = router;