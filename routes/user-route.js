// 라우터 사용 (대문자 R)
const router = require("express").Router();
// UserController 연결
const UserController = require("../controllers/user-controller");
const auth = require("../middlewares/auth");
const adminOnly = require("../middlewares/admin");
const passport = require("../config/passport");
// Joi
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema, updateSchema, adminUpdateSchema } = require("../validations/userValidation");


// PUBLIC
router.post("/register", validate(registerSchema), UserController.register);

// LOGIN (with Passport.js) + custom messages
router.post("/login", validate(loginSchema), (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => { // 인증 결과를 콜백으로 받음
        if(err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if(!user) {
            return res.status(400).json({ message: info?.message || "Login failed" });
        }
        // JWT 생성
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        );
        // 비밀번호 제외 후 데이터 응답
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({
            message: "Login successful",
            user: userData,
            token,
        });      
    })(req, res, next);
});

// // LOGIN (with Passport.js)
// router.post("/login", validate(loginSchema),
//     passport.authenticate("local", { session: false }),
//     (req, res) => {
//         const user = req.user; // passport.js에서 가져온 user

//         // JWT 생성
//         const jwt = require("jsonwebtoken");
//         const token = jwt.sign(
//             { id: user._id, email: user.email, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "24h"}
//         );
//         // 비밀번호 제외 후 데이터 응답
//         const { password: _, ...userData } = user.toObject();
//         res.status(200).json({
//             message: "Login successful",
//             user: userData,
//             token,
//         });        
//     }
// );

// AUTH REQUIRED - 로그인해야 접근 가능
router.put("/update", auth, validate(updateSchema), UserController.update);
router.delete("/remove", auth, UserController.remove);

// ADMIN ONLY
router.get("/", auth, adminOnly, UserController.getAll);
router.put("/update/:id", auth, adminOnly, validate(adminUpdateSchema), UserController.updateUserByAdmin);
router.delete("/remove/:id", auth, adminOnly, UserController.deleteUserByAdmin);



// 필수
module.exports = router;