// User 모델 가져오기
const User = require("../models/user-model");
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
        const user = new User({ username: username, email: email, password: password, role: role });
        // DB에 저장
        // 여기서 Mongoose가 user-model.js에 등록된 pre('save') 미들웨어를 자동으로 실행
        const savedUser = await user.save();
        // 비밀번호 제외 후 데이터 응답
        const { password: _, ...userData } = savedUser.toObject();
        res.status(201).json({
            message: "User registered successfully",
            user: userData,
        });
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE (회원정보 수정)
const update = async (req, res) => {
    try {
        const userId = req.user.id; // 토큰에서 가져온 본인 ID
        const { username, password } = req.body;

        // 사용자 조회
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 변경할 필드 적용
        if (username) user.username = username;
        if (password) user.password = password; // pre('save') 훅에서 자동 해시됨

        // DB 저장 (pre-save 훅 자동 실행)
        const savedUser = await user.save();

        // 비밀번호 제외 후 응답
        const { password: _, ...userData } = savedUser.toObject();
        res.status(200).json({
            message: "User information updated successfully",
            user: userData,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE (회원 탈퇴)
// delete 예약어라 사용 불가
const remove = async (req, res) => {
    try {
        const userId = req.user.id; // 토큰에서 가져온 본인 ID

        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser) {
            return res.status(404).json({ message: "User not found"});
        }
        
        res.status(200).json({ message: "Account deleted successfully"});
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

/////////// ADMIN ONLY //////////

// GETALL USER (Admin only)
const getAll = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            message: "All users fetched successfully",
            total: users.length,
            users,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE USER (Admin only) - username, role
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params; // 수정 대상 user id
        const { username, role } = req.body;

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(username) user.username = username;
        if(role) user.role = role;

        // DB에 저장
        const updatedUser = await user.save();
        // 비밀번호 제외 후 데이터 응답
        const { password: _, ...userData } = updatedUser.toObject();
        res.status(200).json({
            message: "User updated successfully (by admin)",
            user: userData,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE USER (Admin only)
const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully (by admin)" });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    register,
    update,
    remove,
    getAll,
    updateUserByAdmin,
    deleteUserByAdmin,
}