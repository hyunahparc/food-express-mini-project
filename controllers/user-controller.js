// User 모델 가져오기
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER (회원가입)
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // 이메일 중복 확인
        const existingEmail = await User.findOne({ email: email });
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        // 새로운 User 객체 만들기
        // (비밀번호 해싱은 user-model의 pre-save 훅에서 자동 처리)
        const user = new User({ username: username, email: email, password: password });
        // DB에 저장
        // 여기서 Mongoose가 user-model.js에 등록된 pre('save') 미들웨어를 자동으로 실행
        const savedUser = await user.save();
        // 비밀번호 제외 후 데이터 응답
        const { password: _, ...userData } = savedUser.toObject();
        res.status(200).json({
            message: "User registered successfully",
            user: userData,
        });
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
};

// LOGIN (로그인)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 이메일로 사용자 찾기
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // user-model의 comparePassword 메서드 사용
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // JWT 생성
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h"}
        );
        // 비밀번호 제외 후 데이터 응답
        const { password: _, ...userData } = user.toObject();
        res.status(201).json({
            message: "Login successful",
            user: userData,
            token,
        });

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};





module.exports = {
    register,
    login,
}